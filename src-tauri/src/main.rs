// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs::File, io::BufReader, path::Path};

use data::library::Library;
use player::audio::Player;
use rodio::Decoder;

mod data;
mod player;

fn main() {
    let args: Vec<String> = env::args().collect();
    let root_dir = Path::new(&args[1]);

    let lib = Library::new(root_dir);

    let player = Player::new();

    // player.test_play(vec![&lib.songs[0], &lib.songs[1],&lib.songs[2]])

    let file = BufReader::new(File::open(&lib.songs[0].file_path).unwrap());
    let source = Decoder::new(file).unwrap();
    player.audio_sink.append(source);
    let file2 = BufReader::new(File::open(&lib.songs[2].file_path).unwrap());
    let source2 = Decoder::new(file2).unwrap();
    player.audio_sink.append(source2);

    player.audio_sink.sleep_until_end();
}
