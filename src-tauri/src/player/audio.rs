use std::{collections::VecDeque, fs::File, io::BufReader, path::{Path, PathBuf}, sync::{mpsc::{channel, Receiver, Sender}, Arc, Mutex}, thread};

use rodio::{
    source::EmptyCallback, Decoder, OutputStream, OutputStreamHandle, Sample, Sink, Source
};

use crate::data::song::Song;

enum PlayerCommand {
    Pause,
    Play,
    Enqueue(Song),
}

pub struct Player {
    // Need these to keep the player stream alive, but we don't
    // want to actually access it.
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Actual values
    audio_sink: Arc<Mutex<Sink>>,
    files_queue: VecDeque<PathBuf>,
    event_rx: Receiver<()>,
    command_tx: Sender<PlayerCommand>,
}

impl Player {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        let (event_tx, event_rx): (Sender<()>, Receiver<()>) = channel();
        let (command_tx, command_rx): (Sender<PlayerCommand>, Receiver<PlayerCommand>) = channel();

        Player {
            _stream,
            _stream_handle: stream_handle,
            audio_sink: Arc::new(Mutex::new(sink)),
            files_queue: VecDeque::new(),
            command_tx,
            event_rx
        }
    }

    fn open_song_into_sink(&mut self, song: &Song) {
        // Open the file and place its source into the sink.
        let song_file = BufReader::new(File::open(&song.file_path).unwrap());
        let song_source = Decoder::new(song_file).unwrap();
        self.audio_sink.lock().unwrap().append(song_source);

        // Now create a callback source and place it after this song, so we can signal
        // when it has finished playback.
        let tmp: Arc<Mutex<Sink>> = Arc::clone(&self.audio_sink);
        let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(move || {
            println!("Song finished!");
            let t1 = tmp.lock().unwrap().is_paused();
            println!("{}", t1);
        }));
        self.audio_sink.lock().unwrap().append(callback_source);

        // Don't start playing on append
        if self.audio_sink.lock().unwrap().is_paused() {
            self.audio_sink.lock().unwrap().pause();
        }
    }

    /// Add to our queue of paths that we want to play.
    pub fn add_to_queue(&mut self, song: &Song) {
        self.files_queue.push_back(song.file_path.to_path_buf());

        // We want to add this to the sink as an actual opened source if the sink has room
        if self.audio_sink.lock().unwrap().len() < 5 {
            self.open_song_into_sink(&song);
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
        println!("file queue: {:?}", self.files_queue);
        print!("Song queue: {:?}", self.audio_sink.lock().unwrap().len());
    }
}
