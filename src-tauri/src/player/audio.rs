use std::{
    collections::VecDeque,
    fs::File,
    io::BufReader,
    sync::{mpsc::{Receiver, Sender}, Arc, Mutex},
    thread,
};

use rodio::{source::EmptyCallback, Decoder, OutputStream, OutputStreamHandle, Sink};
use tauri::{AppHandle, Manager};

use crate::data::song::Song;

pub enum PlayerEvent {
    SongEnd,
    SongPause,
    SongPlay,
}

pub struct Player {
    // Need these to keep the player stream alive, but we don't
    // want to actually access it.
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Actual values
    audio_sink: Arc<Mutex<Sink>>,
    songs_queue: Arc<Mutex<VecDeque<Song>>>,
    player_event_tx: Sender<PlayerEvent>,
    app_handle: AppHandle,
}

fn open_song_into_sink(sink: &mut Sink, song: &Song, song_end_tx: &Sender<PlayerEvent>) {
    // Open the file.
    let song_file = BufReader::new(File::open(&song.file_path).unwrap());
    let song_source = Decoder::new(song_file).unwrap();

    // Create a callback
    let song_end_tx = song_end_tx.clone();
    let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(move || {
        println!("Callback running");
        match song_end_tx.send(PlayerEvent::SongEnd) {
            Ok(a) => println!("Successfully sent song end event"),
            Err(e) => println!("{:?}", e),
        }
    }));

    // Append the song and its end callback signaler into the queue
    sink.append(song_source);
    sink.append(callback_source);
}

impl Player {
    pub fn new(
        player_event_tx: Sender<PlayerEvent>,
        player_event_rx: Receiver<PlayerEvent>,
        appHandle: AppHandle,
    ) -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();
        sink.set_volume(0.2);

        let sink_wrapped = Arc::new(Mutex::new(sink));
        let songs_queue_wrapped = Arc::new(Mutex::new(VecDeque::<Song>::new()));

        // ======================================================================
        // God help me
        let sink2 = Arc::clone(&sink_wrapped);
        let queue2 = Arc::clone(&songs_queue_wrapped);
        let end_event_tx2 = player_event_tx.clone();

        // This is also good because it means the callback won't accidentally
        // delay playback. Don't forget that the callback must execute to
        // completion before the next song in the sink plays.
        let inner_app_handle = appHandle.clone();
        thread::spawn( move || {
            loop {
                // Sleep this thread until a song ends
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
                        let mut queue3 = queue2.lock().unwrap();

                        println!("Sink length: {}", sink3.len());

                        // Pop the old song out of the queue
                        queue3.pop_front();

                        let next_song = match queue3.get(2) {
                            Some(s) => s,
                            None => continue,
                        };
                        open_song_into_sink(&mut sink3, next_song, &end_event_tx2);
                        inner_app_handle.emit_all("song-end", ()).unwrap();

                        let t: Vec<&String> = queue3.iter().map(|s| &s.tags.title).collect();

                        println!("{:?}", t);
                    },
                    // FIXME this might suggest i did something dumb in the
                    // architecture. Think about it when you're less delirious.
                    _ => continue
                };

            }
        });
        // ======================================================================

        Player {
            _stream,
            _stream_handle: stream_handle,
            audio_sink: sink_wrapped,
            songs_queue: songs_queue_wrapped,
            player_event_tx,
            app_handle: appHandle,
        }
    }

    fn song_into_sink(&mut self, song: &Song) {
        let mut sink = self.audio_sink.lock().unwrap();
        open_song_into_sink(&mut sink, &song, &self.player_event_tx.clone());
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
        self.songs_queue.lock().unwrap().push_back(song.clone());

        // The sink should have at most 3 song files open in it at any given time.
        // If it is full, we just leave the song in the file queue, and then
        // will pull more into the sink as other songs finish playing.
        if self.number_songs_in_sink() < 3 {
            self.song_into_sink(&song);
        }

        let locked_songs = self.songs_queue.lock().unwrap();
        let t: Vec<&String> = locked_songs.iter().map(|s| &s.tags.title).collect();

        println!("{:?}", t);
        println!("{}", self.audio_sink.lock().unwrap().len());
    }

    pub fn change_vol(&mut self, vol: f32) {
        self.audio_sink.lock().unwrap().set_volume(vol);
    }

    pub fn play(&mut self) {
        self.audio_sink.lock().unwrap().play();
        self.app_handle.emit_all("is-paused", false).unwrap();
    }

    pub fn pause(&mut self) {
        self.audio_sink.lock().unwrap().pause();
        self.app_handle.emit_all("is-paused", true).unwrap();
    }

    pub fn skip_current_song(&mut self) {
        self.audio_sink.lock().unwrap().skip_one();
    }
}
