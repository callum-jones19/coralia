// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use album::Album;
use app::App;
use song::Song;
use tauri::State;

mod app;
mod collection;
mod data;
mod song;
mod album;

fn main() {
    let app = App::new(vec![String::from("C:/Users/Callum/Music/")]);
}
