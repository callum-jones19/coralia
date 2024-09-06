// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::Path};

use library::Library;
use music::{music_tags::MusicTags, song::Song};

mod music;
mod library;

fn main() {
  let args: Vec<String> = env::args().collect();
  let root_dir = Path::new(&args[1]);

  let lib = Library::new(root_dir);
  println!("{:?}", lib);
}
