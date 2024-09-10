use std::{borrow::BorrowMut, fs::File, io::BufReader, path::Path};

use rodio::{Decoder, OutputStream, OutputStreamHandle, Sink, Source};

use crate::data::song::Song;

pub struct Player {
    _stream: OutputStream,
    _stream_handle: OutputStreamHandle,
    pub audio_sink: Sink,
}

impl Player {
    pub fn new() -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        Player {
            audio_sink: sink,
            _stream: _stream,
            _stream_handle: stream_handle,
        }
    }
}
