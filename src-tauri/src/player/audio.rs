use std::{borrow::BorrowMut, fs::File, io::BufReader, path::Path};

use rodio::{Decoder, OutputStream, Source};

pub fn test_play(song_path: &Path) {
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();

  let file = BufReader::new(File::open(song_path).unwrap());

  let source = Decoder::new(file).unwrap();
  let _ = stream_handle.play_raw(source.convert_samples());

  std::thread::sleep(std::time::Duration::from_secs(5));
}