use std::{collections::VecDeque, fs::File};

use rodio::{
    cpal::{default_host, traits::HostTrait},
    Decoder, DeviceTrait, OutputStream, OutputStreamHandle, Sink,
};

use crate::data::song::Song;

pub struct Player {
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    // Remember, the sink will just have a "list" of sources in it
    // So , when we skip it jumps into the next source waiting in the sink
    audio_sink: Sink,
    queue: VecDeque<Song>,
}

impl Player {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        Player {
            audio_sink: sink,
            queue: VecDeque::new(),
            _stream,
            _stream_handle: stream_handle,
        }
    }

    fn append_song_into_sink(&mut self, song: Song) {
        let song_path = song.file_path;
        let song_file = File::open(song_path).unwrap();
        let song_source = Decoder::new(song_file).unwrap();
        self.audio_sink.append(song_source);
    }

    pub fn play(&mut self) {
        if !self.audio_sink.is_paused() {
            return;
        }

        if self.audio_sink.len() > 0 {
            // If the sink has something in it, then we just want to start
            // playing that
            self.audio_sink.play();
        } else {
            // If the sink is empty, then we want to put in the first song we
            // have in Queue into it
            let try_next_song = self.queue.pop_front();
            if let Some(next_song) = try_next_song {
                self.append_song_into_sink(next_song);
                self.audio_sink.play();
            }
        }
    }

    /// Add a song to the queue
    pub fn add_to_queue(&mut self, song: Song) {
        self.queue.push_back(song);
    }
}
