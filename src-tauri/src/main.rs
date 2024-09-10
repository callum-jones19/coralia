// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::Path};

use data::library::Library;
use player::audio::test_play;

mod data;
mod player;

fn main() {
    let args: Vec<String> = env::args().collect();
    let root_dir = Path::new(&args[1]);

    let lib = Library::new(root_dir);

    let target_index: usize = args[2].parse::<usize>().unwrap();
    test_play(&lib.songs[target_index].file_path);
}
