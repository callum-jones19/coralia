use std::{
    collections::VecDeque,
    fs::File,
    io::BufReader,
    path::{Path, PathBuf},
    sync::{
        mpsc::{channel, Receiver, Sender},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use rodio::{
    source::EmptyCallback, Decoder, OutputStream, OutputStreamHandle, Sample, Sink, Source,
};

use crate::data::song::Song;

pub struct Player {
    // Need these to keep the player stream alive, but we don't
    // want to actually access it.
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Actual values
    audio_sink: Arc<Mutex<Sink>>,
    songs_queue: Arc<Mutex<VecDeque<Song>>>,
    song_end_tx: Sender<()>,
}

fn open_song_into_sink(sink:&mut Sink, song: &Song, song_end_tx: &Sender<()>) {
    // Open the file.
    let song_file = BufReader::new(File::open(&song.file_path).unwrap());
    let song_source = Decoder::new(song_file).unwrap();

    // Create a callback
    let song_end_tx = song_end_tx.clone();
    let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(move || {
        song_end_tx.send(()).unwrap();
    }));

    // Append the song and its end callback signaler into the queue
    sink.append(song_source);
    sink.append(callback_source);
}

impl Player {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();
        sink.set_volume(0.2);
        let (end_event_tx,end_event_rx): (Sender<()>, Receiver<()>) = channel();

        let sink_wrapped = Arc::new(Mutex::new(sink));
        let songs_queue_wrapped = Arc::new(Mutex::new(VecDeque::<Song>::new()));


        // ======================================================================
        // God help me
        let sink2 = Arc::clone(&sink_wrapped);
        let queue2 = Arc::clone(&songs_queue_wrapped);
        let end_event_tx2 = end_event_tx.clone();

        // This is also good because it means the callback won't accidentally
        // delay playback. Don't forget that the callback must execute to
        // completion before the next song in the sink plays.
        thread::spawn(move || {
            loop {
                // Sleep this thread until a song ends
                let _ = end_event_rx.recv();
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
            }
        });
        // ======================================================================

        Player {
            _stream,
            _stream_handle: stream_handle,
            audio_sink: sink_wrapped,
            songs_queue: songs_queue_wrapped,
            song_end_tx: end_event_tx,
        }
    }

    fn song_into_sink(&mut self, song: &Song) {
        let mut sink = self.audio_sink.lock().unwrap();
        open_song_into_sink(&mut sink, &song, &self.song_end_tx.clone());
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
    }

    pub fn play(&mut self) {
        self.audio_sink.lock().unwrap().play();
    }

    pub fn pause(&mut self) {
        self.audio_sink.lock().unwrap().pause();
    }

    pub fn toggle_playing(&mut self) {
        if self.audio_sink.lock().unwrap().is_paused() {
            self.play();
        } else {
            self.pause();
        }
    }

    pub fn skip_current_song(&mut self) {
        self.audio_sink.lock().unwrap().skip_one();
    }

    pub fn debug_queue(&self) {
        println!("file queue: {:?}", self.songs_queue);
        print!("Song queue: {:?}", self.audio_sink.lock().unwrap().len());
    }
}
