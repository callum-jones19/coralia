// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::Path};

use music::{music_tags::MusicTags, song::Song};

mod music;
mod library;

fn main() {
  let args: Vec<String> = env::args().collect();
  let song_path = Path::new(&args[1]);

  let tmp = Song::new_from_file(song_path).unwrap();
  println!("{:?}", tmp);
}
