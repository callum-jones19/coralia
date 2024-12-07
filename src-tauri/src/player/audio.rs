use std::{
    collections::VecDeque,
    fs::File,
    io::BufReader,
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc::{channel, Sender},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use rodio::{
    source::{EmptyCallback, SeekError},
    Decoder, OutputStream, OutputStreamHandle, Sink, Source,
};
use serde::{Deserialize, Serialize};

use crate::data::song::Song;

/// Place a new song into the sink. This returns the control for whether the
/// song should be removed from the sink early or not
fn open_song_into_sink(
    sink: &mut Sink,
    sink_songs_controls: Arc<Mutex<VecDeque<Arc<AtomicBool>>>>,
    song: &Song,
    song_end_tx: &Sender<PlayerEvent>,
) {
    // Open the file.
    let song_file = BufReader::new(File::open(&song.file_path).unwrap());
    let song_source = Decoder::new(song_file).unwrap();

    let skip: Arc<AtomicBool> = Arc::new(AtomicBool::new(false));
    let skip_inner = skip.clone();
    let controlled = song_source.periodic_access(Duration::from_millis(5), move |src| {
        if skip_inner.load(Ordering::SeqCst) {
            src.stoppable();
        }
    });

    sink_songs_controls.lock().unwrap().push_back(skip);
    // Create a callback
    let song_end_tx = song_end_tx.clone();
    let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(move || {
        println!("Callback running");
        match song_end_tx.send(PlayerEvent::SongEnd) {
            Ok(_) => println!("Successfully sent song end event"),
            Err(e) => println!("{:?}", e),
        }
    }));

    // Append the song and its end callback signaler into the queue
    sink.append(controlled);
    sink.append(callback_source);
}

pub enum PlayerEvent {
    SongEnd,
}

pub enum PlayerStateUpdate {
    SongEnd(Box<VecDeque<Song>>),
    SongPlay(Duration),
    SongPause(Duration),
    QueueUpdate(Box<VecDeque<Song>>),
}

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

        let new_state = CachedPlayerState {
            songs_queue: locked_songs.clone(),
            current_song_pos: locked_sink.get_pos().clone(),
            current_volume: locked_sink.volume().clone(),
            is_paused: locked_sink.is_paused().clone(),
        };

        new_state
    }
}

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
    player_event_tx: Sender<PlayerEvent>,
    state_update_tx: Sender<PlayerStateUpdate>,
}

impl Player {
    pub fn new(state_update_tx: Sender<PlayerStateUpdate>) -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();
        sink.set_volume(0.5);
        sink.pause();
        let (player_event_tx, player_event_rx) = channel::<PlayerEvent>();

        let sink_wrapped = Arc::new(Mutex::new(sink));
        let songs_queue_wrapped = Arc::new(Mutex::new(VecDeque::<Song>::new()));

        // ======================================================================
        // God help me
        let sink2 = Arc::clone(&sink_wrapped);
        let queue2 = Arc::clone(&songs_queue_wrapped);
        let end_event_tx2 = player_event_tx.clone();

        let sink_songs_controls: Arc<Mutex<VecDeque<Arc<AtomicBool>>>> =
            Arc::new(Mutex::new(VecDeque::new()));

        // This is also good because it means the callback won't accidentally
        // delay playback. Don't forget that the callback must execute to
        // completion before the next song in the sink plays.
        let state_update_tx2 = state_update_tx.clone();

        let inner_sink_songs_ctrls = Arc::clone(&sink_songs_controls);
        thread::spawn(move || {
            loop {
                // Sleep this thread until a song ends
                let ctrls = Arc::clone(&inner_sink_songs_ctrls);
                println!("Sleeping");
                let player_evt = match player_event_rx.recv() {
                    Ok(e) => e,
                    Err(err) => {
                        println!("Error receiving message");
                        println!("{:?}", err);
                        continue;
                    }
                };
                println!("Awake");
                match player_evt {
                    PlayerEvent::SongEnd => {
                        println!("Song finished!");

                        let mut sink3 = sink2.lock().unwrap();
                        println!("Sink length: {}", sink3.len());

                        // Pop the old song out of the queue
                        let mut queue3 = queue2.lock().unwrap();
                        queue3.pop_front();
                        {
                            let mut ctrls_unlocked = ctrls.lock().unwrap();
                            ctrls_unlocked.pop_front();
                        }

                        let new_queue = queue3.clone();
                        println!("Sending queue with SongEnd event");
                        state_update_tx2
                            .send(PlayerStateUpdate::SongEnd(Box::new(new_queue)))
                            .unwrap();
                        println!("Sent queue with SongEnd event");

                        // Do we need to pull a new song into the sink from the
                        // queue?
                        if let Some(s) = queue3.get(2) {
                            open_song_into_sink(&mut sink3, ctrls, s, &end_event_tx2);
                        } else if queue3.len() == 0 {
                            sink3.pause();
                            let pos = sink3.get_pos();
                            state_update_tx2
                                .send(PlayerStateUpdate::SongPause(pos))
                                .unwrap();
                        }
                    }
                };
            }
        });
        // ======================================================================

        Player {
            _stream,
            _stream_handle: stream_handle,
            audio_sink: sink_wrapped,
            songs_queue: songs_queue_wrapped,
            sink_songs_controls,
            player_event_tx,
            state_update_tx,
        }
    }

    fn song_into_sink(&mut self, song: &Song) {
        let mut sink = self.audio_sink.lock().unwrap();
        let sink_songs_ctrls_2 = Arc::clone(&self.sink_songs_controls);
        open_song_into_sink(
            &mut sink,
            sink_songs_ctrls_2,
            &song,
            &self.player_event_tx.clone(),
        );
    }

    ///
    /// Gets number of actual songs in the sink. This prevents us accidentally
    /// double counting empty signalling sources as songs.
    fn number_songs_in_sink(&self) -> usize {
        let num_srcs_in_sink = self.audio_sink.lock().unwrap().len();
        let num_songs = num_srcs_in_sink / 2;
        num_songs
    }

    /// Add to our queue of paths that we want to play.
    pub fn add_to_queue(&mut self, song: &Song) {
        // TODO FIXME look into whether a source marked as Stoppable is
        // instantly removed from the sink, or if it waits until it gets to
        // it and then does it. This will influence the size calculation.

        self.songs_queue.lock().unwrap().push_back(song.clone());

        // The sink should have at most 3 song files open in it at any given time.
        // If it is full, we just leave the song in the file queue, and then
        // will pull more into the sink as other songs finish playing.
        if self.number_songs_in_sink() < 3 {
            self.song_into_sink(&song);
        }

        let queue_to_send = self.songs_queue.lock().unwrap().clone();
        let queue_change_state = PlayerStateUpdate::QueueUpdate(Box::new(queue_to_send));
        self.state_update_tx.send(queue_change_state).unwrap();
        self.play();
    }

    pub fn change_vol(&mut self, vol: f32) {
        self.audio_sink.lock().unwrap().set_volume(vol);
    }

    pub fn play(&mut self) {
        let sink = self.audio_sink.lock().unwrap();
        sink.play();
        let curr_pos = sink.get_pos();
        self.state_update_tx
            .send(PlayerStateUpdate::SongPlay(curr_pos))
            .unwrap();
    }

    pub fn clear(&mut self) {
        self.audio_sink.lock().unwrap().clear();
        self.songs_queue.lock().unwrap().clear();
    }

    pub fn pause(&mut self) {
        let sink = self.audio_sink.lock().unwrap();
        sink.pause();
        let curr_pos = sink.get_pos();
        self.state_update_tx
            .send(PlayerStateUpdate::SongPause(curr_pos))
            .unwrap();
    }

    pub fn skip_current_song(&mut self) {
        println!("Skipping inside player");
        self.audio_sink.lock().unwrap().skip_one();
        println!("Finished Skipping inside player");
    }

    /// Remove a song from the queue given its index.
    /// If a song does not exist at this index, return None.
    /// If a song does exist, return the Song that was removed.
    pub fn remove_song_from_queue(&mut self, song_index: usize) -> Option<Song> {
        let mut song_queue = self.songs_queue.lock().unwrap();

        let skipped_song = song_queue.remove(song_index);

        if song_index < 3 {
            let sink_song_controls = self.sink_songs_controls.lock().unwrap();
            let sink_song_ctr = sink_song_controls.get(song_index);

            if let Some(ctrl) = sink_song_ctr {
                ctrl.store(true, Ordering::SeqCst);
            }
        }

        if let Some(_) = skipped_song {
            let queue_change_state = PlayerStateUpdate::QueueUpdate(Box::new(song_queue.clone()));
            self.state_update_tx.send(queue_change_state).unwrap();
        }

        skipped_song
    }

    pub fn seek_current_song(&mut self, seek_amount: Duration) -> Result<(), SeekError> {
        let unlocked_sink = self.audio_sink.lock().unwrap();
        unlocked_sink.try_seek(seek_amount)?;
        Ok(())
    }

    pub fn get_current_state(&self) -> CachedPlayerState {
        let res = CachedPlayerState::new(&self);

        res
    }
}
