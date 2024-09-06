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

    tauri::Builder::default()
        .manage(app)
        .invoke_handler(tauri::generate_handler![
            filter_songs_by_title,
            get_all_songs,
            filter_songs_by_album,
            get_all_albums
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
