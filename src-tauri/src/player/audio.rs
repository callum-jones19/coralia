use std::{
    collections::VecDeque,
    fs::File,
    io::BufReader,
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc::{channel, Receiver, Sender},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use rodio::{
    decoder::DecoderError,
    source::{EmptyCallback, SeekError},
    Decoder, OutputStream, OutputStreamHandle, Sink, Source,
};
use serde::{Deserialize, Serialize};

use crate::data::song::Song;

/// Take a Song, and open its file path into a decoded Rodio Source.
/// Place this source into the end of the sink.
/// At the same time, also place a control for this source in an index-aligned
/// controls list. This allows us to control a Source that has not yet started
/// in the sink.
///
/// Also pass in a mcsp Sender to signal to another sleeping thread when this
/// Source has ended, which gives us full control over what happens afterwards.
/// This circumvents how the callback inside this function needs to place a new
/// empty callback source that would also need to call this function.
fn open_song_into_sink(
    sink: &mut Sink,
    sink_songs_controls: Arc<Mutex<VecDeque<Arc<AtomicBool>>>>,
    song: &Song,
    song_end_tx: &Sender<()>,
) -> Result<(), DecoderError> {
    // Open the file.

    let song_file = BufReader::new(File::open(&song.file_path).unwrap());

    let song_source = match Decoder::new(song_file) {
        Ok(src) => src,
        Err(e) => return Err(e),
    };

    let skip: Arc<AtomicBool> = Arc::new(AtomicBool::new(false));

    let skip_inner = skip.clone();

    let controlled = song_source.periodic_access(Duration::from_millis(5), move |src| {
        if skip_inner.load(Ordering::SeqCst) {
            src.stoppable();
        }
    });

    // Add a control for this new source in the sink. It should be index-aligned
    // (ignoring the EmptyCallback elements).

    // It's getting stuck here. Which means BEFORE this is run, the
    // sink_song_controls are getting locked and not freed.
    let mut sink_song_controls_locked = sink_songs_controls.lock().unwrap();
    sink_song_controls_locked.push_back(skip);

    // Create a callback
    let song_end_tx = song_end_tx.clone();

    let callback_source: EmptyCallback<f32> =
        EmptyCallback::new(Box::new(move || match song_end_tx.send(()) {
            Ok(_) => println!("Successfully sent song end event"),
            Err(e) => println!("{:?}", e),
        }));

    // Append the song and its end callback signaler into the queue
    sink.append(controlled);
    sink.append(callback_source);

    Ok(())
}

/// Sleep on this function until woken up on the given mcsp channel.
/// When awoken, this function will handle what to do when a source ends.
/// It will pop finished songs out of the Song queue (not Sink - this is
/// automatic).
/// More importantly, it will check the sink to see if it is now below the
/// buffer limit. If it is, it will trigger a new source to be added into the
/// sink out of the current Song queue.
fn handle_sink_song_end(
    sink_song_end_rx: Receiver<()>,
    sink: Arc<Mutex<Sink>>,
    sink_songs_ctrl: Arc<Mutex<VecDeque<Arc<AtomicBool>>>>,
    song_queue: Arc<Mutex<VecDeque<Song>>>,
    state_update_tx: Sender<PlayerStateUpdate>,
    sink_song_end_tx: Sender<()>,
) {
    loop {
        // Sleep this thread until a song ends
        sink_song_end_rx.recv().unwrap();
        {
            let sink_songs_ctrl2 = Arc::clone(&sink_songs_ctrl);

            let mut song_queue_locked = song_queue.lock().unwrap();
            let mut sink_locked = sink.lock().unwrap();

            {
                // Pop the old song out of the queue
                let mut sink_songs_ctrls_locked = sink_songs_ctrl.lock().unwrap();
                song_queue_locked.pop_front();
                sink_songs_ctrls_locked.pop_front();
            }

            // Do we need to pull a new song into the sink from the
            // queue? If yes, do it as many times to fill out the buffer

            while sink_locked.len() < 6 && song_queue_locked.len() > 2 {
                println!("!");
                if let Some(s) = song_queue_locked.get(2) {
                    let open_status = open_song_into_sink(
                        &mut sink_locked,
                        sink_songs_ctrl2.clone(),
                        s,
                        &sink_song_end_tx,
                    );

                    match open_status {
                        Ok(_) => {}
                        Err(_) => {
                            println!(
                                "Removing song {} from queue - could not decode into sink",
                                &s.tags.title
                            );
                            // Remove the song from the Song queue
                            song_queue_locked.remove(2);
                        }
                    }
                }
            }

            if song_queue_locked.len() == 0 {
                sink_locked.pause();

                let pos = sink_locked.get_pos();

                state_update_tx
                    .send(PlayerStateUpdate::SongPause(pos))
                    .unwrap();
            }

            // Signal to the Player Event System that a song has ended
            let new_queue = song_queue_locked.clone();

            state_update_tx
                .send(PlayerStateUpdate::SongEnd(new_queue.clone()))
                .unwrap();
            state_update_tx
                .send(PlayerStateUpdate::QueueUpdate(new_queue, Duration::ZERO))
                .unwrap();
        }
    }
}

/// An enum of possible events that we may want to send out of the player
/// thread for major events that could occur within the Player structure.
pub enum PlayerStateUpdate {
    SongEnd(VecDeque<Song>),
    SongPlay(Duration),
    SongPause(Duration),
    QueueUpdate(VecDeque<Song>, Duration),
}

/// Stores a snapshot of the player state at a given moment
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CachedPlayerState {
    songs_queue: VecDeque<Song>,
    current_song_pos: Duration,
    current_volume: f32,
    is_paused: bool,
}

impl CachedPlayerState {
    pub fn new(player: &Player) -> Self {
        let locked_songs = player.songs_queue.lock().unwrap();
        let locked_sink = player.audio_sink.lock().unwrap();

        CachedPlayerState {
            songs_queue: locked_songs.clone(),
            current_song_pos: locked_sink.get_pos(),
            current_volume: locked_sink.volume(),
            is_paused: locked_sink.is_paused(),
        }
    }
}

/// The Player that handles all playback functionality that we might want in
/// a music player.
pub struct Player {
    // Need these to keep the player stream alive, but we don't
    // want to actually access it.
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Actual values
    audio_sink: Arc<Mutex<Sink>>,
    // We need a list of sources to track what is currently in the sink,
    // as the sink gives us no info about the sources inside it.
    sink_songs_controls: Arc<Mutex<VecDeque<Arc<AtomicBool>>>>,
    songs_queue: Arc<Mutex<VecDeque<Song>>>,
    player_event_tx: Sender<()>,
    state_update_tx: Sender<PlayerStateUpdate>,
}

impl Player {
    /// Create a new player backend.
    /// This takes a mcsp channel sender to communicate updates outside of
    /// the player once initialised. This allows it to work in its own thread
    /// but still communicate outside of this.
    pub fn new(state_update_tx: Sender<PlayerStateUpdate>) -> Self {
        // Setup rodio backend
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        // Initialise default sink state
        const INIT_VOLUME: f32 = 0.5;
        sink.set_volume(INIT_VOLUME);
        sink.pause();

        // Setup channel messenger for when a song in the sink ends,
        // on which we will wake up the thread that pulls a new song into the
        // sink.
        let (sink_song_end_tx, sink_song_end_rx) = channel::<()>();

        // Setup multithreading types for the sink, songs queue, and the
        // controls for the sources inside the sink.
        let sink_wrapped = Arc::new(Mutex::new(sink));
        let songs_queue = Arc::new(Mutex::new(VecDeque::<Song>::new()));
        let sink_songs_controls: Arc<Mutex<VecDeque<Arc<AtomicBool>>>> =
            Arc::new(Mutex::new(VecDeque::new()));

        // Spawn the thread that runs whenever a song source in the sink ends.
        let sink_songs_ctrl_2 = Arc::clone(&sink_songs_controls);
        let songs_queue_2 = Arc::clone(&songs_queue);
        let sink2 = Arc::clone(&sink_wrapped);
        let state_update_tx2 = state_update_tx.clone();
        let sink_song_end_tx2 = sink_song_end_tx.clone();
        thread::spawn(move || {
            handle_sink_song_end(
                sink_song_end_rx,
                sink2,
                sink_songs_ctrl_2,
                songs_queue_2,
                state_update_tx2,
                sink_song_end_tx2,
            );
        });

        // Create and return the player
        Player {
            _stream,
            _stream_handle: stream_handle,
            audio_sink: sink_wrapped,
            songs_queue,
            sink_songs_controls,
            player_event_tx: sink_song_end_tx,
            state_update_tx,
        }
    }

    /// Take a Song struct and open it manually into the sink
    fn song_into_sink(&mut self, song: &Song) -> Result<(), DecoderError> {
        let mut sink = self.audio_sink.lock().unwrap();
        let sink_songs_ctrls_2 = Arc::clone(&self.sink_songs_controls);
        open_song_into_sink(
            &mut sink,
            sink_songs_ctrls_2,
            song,
            &self.player_event_tx.clone(),
        )?;
        Ok(())
    }

    /// Gets number of actual songs in the sink, ignoring non-song sources
    /// such as `EmptyCallback`. This prevents us accidentally
    /// double counting empty signalling sources as songs.
    fn number_songs_in_sink(&self) -> usize {
        let num_srcs_in_sink = self.audio_sink.lock().unwrap().len();
        num_srcs_in_sink / 2
    }

    /// Add to our queue of paths that we want to play.
    pub fn add_to_queue(&mut self, song: &Song) {
        // TODO FIXME look into whether a source marked as Stoppable is
        // instantly removed from the sink, or if it waits until it gets to
        // it and then does it. This will influence the size calculation.

        // The sink should have at most 3 song files open in it at any given time.
        // If it is full, we just leave the song in the file queue, and then
        // will pull more into the sink as other songs finish playing.

        // Should not add to queue if tried to open into sink and failed
        // due to decode error.
        let mut should_add_to_queue = true;
        if self.number_songs_in_sink() < 3 {
            let added_successfully = match &self.song_into_sink(song) {
                Ok(_) => true,
                Err(_) => {
                    println!(
                        "Skipping adding song {} to queue - could not decode",
                        &song.tags.title
                    );
                    false
                }
            };
            should_add_to_queue = added_successfully;
        }

        {
            let mut songs_queue_locked = self.songs_queue.lock().unwrap();
            let audio_sink_locked = self.audio_sink.lock().unwrap();
            if should_add_to_queue {
                songs_queue_locked.push_back(song.clone());
            }
            let queue_change_state = PlayerStateUpdate::QueueUpdate(
                songs_queue_locked.clone(),
                audio_sink_locked.get_pos(),
            );
            self.state_update_tx.send(queue_change_state).unwrap();
        };
    }

    /// Change the sink volume.
    pub fn change_vol(&mut self, vol: f32) {
        self.audio_sink.lock().unwrap().set_volume(vol);
    }

    /// Signal the sink to start playing.
    pub fn play(&mut self) {
        let curr_pos = {
            let sink = self.audio_sink.lock().unwrap();
            println!("{}", sink.len());
            if sink.len() != 0 {
                sink.play();
                Some(sink.get_pos().clone())
            } else {
                None
            }
        };

        match curr_pos {
            Some(pos) => self
                .state_update_tx
                .send(PlayerStateUpdate::SongPlay(pos))
                .unwrap(),
            None => {}
        }
    }

    /// Clear the sink and songs queue of every source and song
    pub fn clear(&mut self) {
        let sink_locked = self.audio_sink.lock().unwrap();
        let mut songs_queue_locked = self.songs_queue.lock().unwrap();

        sink_locked.clear();
        songs_queue_locked.clear();
    }

    /// Signal the sink to pause
    pub fn pause(&mut self) {
        let sink = self.audio_sink.lock().unwrap();
        sink.pause();
        let curr_pos = sink.get_pos();
        self.state_update_tx
            .send(PlayerStateUpdate::SongPause(curr_pos))
            .unwrap();
    }

    /// Skip the currently playing source in the sink
    pub fn skip_current_song(&mut self) {
        self.audio_sink.lock().unwrap().skip_one();
    }

    /// Remove a song from the queue given its index.
    /// If a song does not exist at this index, return None.
    /// If a song does exist, return the Song that was removed.
    pub fn remove_song_from_queue(&mut self, song_index: usize) -> Option<Song> {
        let mut song_queue = self.songs_queue.lock().unwrap();
        let sink = self.audio_sink.lock().unwrap();

        let skipped_song = song_queue.remove(song_index);

        if song_index < 3 {
            let sink_song_controls = self.sink_songs_controls.lock().unwrap();
            let sink_song_ctr = sink_song_controls.get(song_index);

            if let Some(ctrl) = sink_song_ctr {
                ctrl.store(true, Ordering::SeqCst);
            }
        }

        if skipped_song.is_some() {
            let queue_change_state =
                PlayerStateUpdate::QueueUpdate(song_queue.clone(), sink.get_pos());
            self.state_update_tx.send(queue_change_state).unwrap();
        }

        skipped_song
    }

    /// Try to seek the currently playing sound in the sink to the given Duration
    /// position. If this is greater than the duration of the currently playing
    /// sound, it will just clamp to the max value.
    pub fn seek_current_song(&mut self, seek_amount: Duration) -> Result<(), SeekError> {
        let sink_locked = self.audio_sink.lock().unwrap();
        sink_locked.try_seek(seek_amount)?;
        Ok(())
    }

    /// Return a snapshot of the player's current state
    pub fn get_current_state(&self) -> CachedPlayerState {
        CachedPlayerState::new(self)
    }
}
