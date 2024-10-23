use std::{collections::VecDeque, fs::File, io::BufReader, path::{Path, PathBuf}};

use rodio::{
    source::EmptyCallback, Decoder, OutputStream, OutputStreamHandle, Sample, Sink, Source
};

use crate::data::song::Song;

pub struct Player {
    // Need these to keep the player stream alive, but we don't
    // want to actually access it.
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Actual values
    audio_sink: Sink,
    files_queue: VecDeque<PathBuf>
}

impl Player {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        Player {
            audio_sink: sink,
            files_queue: VecDeque::new(),
            _stream,
            _stream_handle: stream_handle,
        }
    }

    fn open_song_into_sink(&mut self, song: &Song) {
        // Open the file and place its source into the sink.
        let song_file = BufReader::new(File::open(&song.file_path).unwrap());
        let song_source = Decoder::new(song_file).unwrap();
        self.audio_sink.append(song_source);

        // Now create a callback source and place it after this song, so we can signal
        // when it has finished playback.
        let callback_source: EmptyCallback<f32> = EmptyCallback::new(Box::new(|| {
            println!("Song finished!");
        }));
        self.audio_sink.append(callback_source);
    }

    /// Add to our queue of paths that we want to play.
    pub fn add_to_queue(&mut self, song: &Song) {
        self.files_queue.push_back(song.file_path.to_path_buf());

        // We want to add this to the sink as an actual opened source if the sink has room
        if self.audio_sink.len() < 5 {
            self.open_song_into_sink(&song);
        }
    }

    pub fn play(&mut self) {
        self.audio_sink.play();
    }

    pub fn pause(&mut self) {
        self.audio_sink.pause();
    }

    pub fn toggle_playing(&mut self) {
        if self.audio_sink.is_paused() {
            self.play();
        } else {
            self.pause();
        }
    }

    pub fn skip_current_song(&mut self) {
        self.audio_sink.skip_one();
    }

    pub fn debug_queue(&self) {
        println!("file queue: {:?}", self.files_queue);
        print!("Song queue: {:?}", self.audio_sink.len());
    }
}
