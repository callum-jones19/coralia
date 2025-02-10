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

use log::{error, info};
use rodio::{
    decoder::DecoderError,
    source::{EmptyCallback, SeekError},
    Decoder, OutputStream, OutputStreamHandle, Sink, Source,
};
use serde::{Deserialize, Serialize};

use crate::data::song::Song;

enum EndCause {
    EndOfSong,
    Stopped,
}

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
    song: &mut PlayerSong,
    song_end_tx: &Sender<EndCause>,
) -> Result<(), DecoderError> {
    // Open the file.
    let song_file = BufReader::new(File::open(&song.song.file_path).unwrap());

    // Decode the file into a source
    let song_source = match Decoder::new(song_file) {
        Ok(src) => src,
        Err(e) => return Err(e),
    };

    // Wrap it in a Stoppable.
    let stoppable_source = song_source.stoppable();

    // FIXME eject a true statement out of the list after the song has been skipped
    let stop: Arc<AtomicBool> = Arc::new(AtomicBool::new(false));
    song.sink_controls = Some(stop.clone());
    let skip_inner = stop.clone();
    let controlled_src = stoppable_source.periodic_access(Duration::from_millis(5), move |src| {
        let should_stop = skip_inner.load(Ordering::SeqCst);
        if should_stop {
            src.stop();
        }
    });

    // Create a callback
    // We only want the song end callback to be triggered if the source actually
    // ended naturally. If it was stopped (removed from queue), it should not fire.
    let song_end_tx = song_end_tx.clone();
    let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(move || {
        let was_stopped = stop.load(Ordering::SeqCst);
        if was_stopped {
            song_end_tx.send(EndCause::Stopped).unwrap();
        } else {
            song_end_tx.send(EndCause::EndOfSong).unwrap();
        }
    }));

    // Append the song and its end callback signaler into the queue
    sink.append(controlled_src);
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
    sink_song_end_rx: Receiver<EndCause>,
    sink: Arc<Mutex<Sink>>,
    song_queue: Arc<Mutex<VecDeque<PlayerSong>>>,
    prev_song_queue: Arc<Mutex<Vec<PlayerSong>>>,
    state_update_tx: Sender<PlayerStateUpdate>,
    sink_song_end_tx: Sender<EndCause>,
) {
    loop {
        // Sleep this thread until a song ends
        let song_end_cause = sink_song_end_rx.recv().unwrap();
        match song_end_cause {
            EndCause::EndOfSong => {
                let mut song_queue_locked = song_queue.lock().unwrap();
                let mut sink_locked = sink.lock().unwrap();
                let mut prev_songs_queue_locked = prev_song_queue.lock().unwrap();

                // Pop the song that just finished out of the queue
                let finished_song = song_queue_locked.pop_front();
                match finished_song {
                    Some(finished_song) => {
                        prev_songs_queue_locked.push(finished_song);
                    }
                    None => println!("Should this ever even happen?"),
                }
                // Do we need to pull a new song into the sink from the
                // queue? If yes, do it as many times to fill out the buffer
                while sink_locked.len() < 6 {
                    println!("!");
                    // Fetch the closest not-in-sink song.
                    let next_not_buffered_song = song_queue_locked
                        .iter_mut()
                        .find(|s| s.sink_controls.is_none());
                    let next_song = match next_not_buffered_song {
                        Some(s) => s,
                        None => break,
                    };

                    let open_status =
                        open_song_into_sink(&mut sink_locked, next_song, &sink_song_end_tx);

                    match open_status {
                        Ok(_) => {}
                        Err(_) => {
                            info!(
                                "Removing song {} from queue - could not decode into sink",
                                &next_song.song.tags.title
                            );
                            // Remove the song from the Song queue
                            song_queue_locked.remove(2);
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
                let new_queue: VecDeque<Song> = song_queue_locked
                    .clone()
                    .into_iter()
                    .map(|song| song.song)
                    .collect();

                state_update_tx
                    .send(PlayerStateUpdate::SongEnd(new_queue.clone()))
                    .unwrap();
                state_update_tx
                    .send(PlayerStateUpdate::QueueUpdate(new_queue, Duration::ZERO))
                    .unwrap();
            }
            EndCause::Stopped => {
                let mut song_queue_locked = song_queue.lock().unwrap();
                let mut sink_locked = sink.lock().unwrap();

                while sink_locked.len() < 6 {
                    println!("!");
                    // Fetch the closest not-in-sink song.
                    let next_not_buffered_song = song_queue_locked
                        .iter_mut()
                        .find(|s| s.sink_controls.is_none());
                    let next_song = match next_not_buffered_song {
                        Some(s) => s,
                        None => break,
                    };

                    let open_status =
                        open_song_into_sink(&mut sink_locked, next_song, &sink_song_end_tx);

                    match open_status {
                        Ok(_) => {}
                        Err(_) => {
                            info!(
                                "Removing song {} from queue - could not decode into sink",
                                &next_song.song.tags.title
                            );
                            // Remove the song from the Song queue
                            song_queue_locked.remove(2);
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
            }
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

        let queue: VecDeque<Song> = locked_songs.iter().map(|s| s.song.clone()).collect();

        CachedPlayerState {
            songs_queue: queue,
            current_song_pos: locked_sink.get_pos(),
            current_volume: locked_sink.volume(),
            is_paused: locked_sink.is_paused(),
        }
    }
}

#[derive(Clone, Debug)]
struct PlayerSong {
    song: Song,
    sink_controls: Option<Arc<AtomicBool>>,
}

impl PlayerSong {
    pub fn new(song: Song) -> Self {
        PlayerSong {
            sink_controls: None,
            song,
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
    songs_queue: Arc<Mutex<VecDeque<PlayerSong>>>,
    previous_songs: Arc<Mutex<Vec<PlayerSong>>>,
    player_event_tx: Sender<EndCause>,
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
        let (sink_song_end_tx, sink_song_end_rx) = channel::<EndCause>();

        // Setup multithreading types for the sink, songs queue, and the
        // controls for the sources inside the sink.
        let sink_wrapped = Arc::new(Mutex::new(sink));
        let songs_queue = Arc::new(Mutex::new(VecDeque::<PlayerSong>::new()));
        let prev_songs = Arc::new(Mutex::new(Vec::new()));

        // Spawn the thread that runs whenever a song source in the sink ends.
        let songs_queue_2 = Arc::clone(&songs_queue);
        let sink2 = Arc::clone(&sink_wrapped);
        let state_update_tx2 = state_update_tx.clone();
        let sink_song_end_tx2 = sink_song_end_tx.clone();
        let prev_songs_2 = Arc::clone(&prev_songs);
        thread::spawn(move || {
            handle_sink_song_end(
                sink_song_end_rx,
                sink2,
                songs_queue_2,
                prev_songs_2,
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
            previous_songs: prev_songs,
            player_event_tx: sink_song_end_tx,
            state_update_tx,
        }
    }

    /// Gets number of actual songs in the sink, ignoring non-song sources
    /// such as `EmptyCallback`. This prevents us accidentally
    /// double counting empty signalling sources as songs.
    fn number_songs_in_sink(&self) -> usize {
        let songs_queue = self.songs_queue.lock().unwrap();
        songs_queue
            .iter()
            .filter(|s| s.sink_controls.is_some())
            .count()
    }

    /// Add to our queue of paths that we want to play.
    /// The sink should have at most 3 song files open in it at any given time.
    /// If it is full, we just leave the song in the file queue, and then
    /// will pull more into the sink as other songs finish playing.
    /// Should not add to queue if tried to open into sink and failed
    /// due to decode error.
    pub fn add_to_queue(&mut self, song: &Song) -> Result<(), String> {
        info!("Player internals: adding song to queue");
        // If required, try to add this song into the sink buffer
        let mut player_song = PlayerSong::new(song.clone());
        let songs_in_sink = self.number_songs_in_sink();
        {
            let mut songs_queue = self.songs_queue.lock().unwrap();
            let mut audio_sink = self.audio_sink.lock().unwrap();
            if songs_in_sink < 3 {
                info!("Player internals: adding decoded song file into sink buffer.");
                let res = open_song_into_sink(
                    &mut audio_sink,
                    &mut player_song,
                    &self.player_event_tx.clone(),
                );
                match res {
                    Ok(_) => {}
                    Err(e) => {
                        error!(
                            "Sink internals: could not add decoded song into sink buffer. {}",
                            e.to_string()
                        );
                        // Broadcast the new queue anyway
                        let song_data_queue =
                            songs_queue.clone().into_iter().map(|s| s.song).collect();
                        let queue_change_state =
                            PlayerStateUpdate::QueueUpdate(song_data_queue, audio_sink.get_pos());
                        self.state_update_tx.send(queue_change_state).unwrap();
                        return Err(e.to_string());
                    }
                }
            }

            songs_queue.push_back(player_song.clone());
            let song_data_queue = songs_queue.clone().into_iter().map(|s| s.song).collect();
            let queue_change_state =
                PlayerStateUpdate::QueueUpdate(song_data_queue, audio_sink.get_pos());
            self.state_update_tx.send(queue_change_state).unwrap();
        }

        Ok(())
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
                info!("Sink internals: Sink state set to play");
                sink.play();
                Some(sink.get_pos())
            } else {
                info!("Sink internals: Sink buffer empty, so not starting playback");
                None
            }
        };

        if let Some(pos) = curr_pos {
            self.state_update_tx
                .send(PlayerStateUpdate::SongPlay(pos))
                .unwrap();
        }
    }

    /// Clear the sink and songs queue of every source and song
    pub fn clear(&mut self) {
        info!("Sink internals: Clearing sink and queue");
        let sink_locked = self.audio_sink.lock().unwrap();
        let mut songs_queue_locked = self.songs_queue.lock().unwrap();
        let mut prev_songs_locked = self.previous_songs.lock().unwrap();

        sink_locked.clear();
        songs_queue_locked.clear();
        prev_songs_locked.clear();
        self.state_update_tx
            .send(PlayerStateUpdate::SongPause(Duration::ZERO))
            .unwrap();
    }

    /// Signal the sink to pause
    pub fn pause(&mut self) {
        info!("Sink internals: Sink state set to pause");
        let sink = self.audio_sink.lock().unwrap();
        sink.pause();
        let curr_pos = sink.get_pos();
        self.state_update_tx
            .send(PlayerStateUpdate::SongPause(curr_pos))
            .unwrap();
    }

    /// Skip the currently playing source in the sink
    pub fn skip_current_song(&mut self) {
        info!("Sink internals: Skipping current song in buffer");
        self.audio_sink.lock().unwrap().skip_one();
    }

    /// Remove a song from the queue given its index.
    /// If a song does not exist at this index, return None.
    /// If a song does exist, return the Song that was removed.
    pub fn remove_song_from_queue(&mut self, song_index: usize) -> Option<Song> {
        info!("Sink internals: Removing song at index {song_index} from queue");
        let mut songs_queue = self.songs_queue.lock().unwrap();
        let sink = self.audio_sink.lock().unwrap();
        // Handle edge case of removing the first song.

        let song = match songs_queue.remove(song_index) {
            Some(s) => s,
            None => return None,
        };

        if let Some(sink_ctrls) = song.sink_controls {
            info!("Sink internals: Marking song in sink as stopped");
            sink_ctrls.store(true, Ordering::SeqCst);
        }

        // Send the event to the frontend
        let songs_data: VecDeque<Song> = songs_queue.clone().into_iter().map(|s| s.song).collect();
        if songs_data.len() == 0 {
            sink.pause();
            self.state_update_tx
                .send(PlayerStateUpdate::SongPause(Duration::ZERO))
                .unwrap();
        }

        // If we removed the first song we just want to reset the position
        // because we are emitting the event a moment before we remove the song
        // from the queue.
        if song_index != 0 {
            self.state_update_tx
                .send(PlayerStateUpdate::QueueUpdate(songs_data, sink.get_pos()))
                .unwrap();
        } else {
            self.state_update_tx
                .send(PlayerStateUpdate::QueueUpdate(songs_data, Duration::ZERO))
                .unwrap();
        }

        Some(song.song)
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
