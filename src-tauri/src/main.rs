// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::App;
use song::Song;
use tauri::State;

mod app;
mod collection;
mod data;
mod song;

fn main() {
    let app = App::new(vec![String::from("C:/Users/Callum/Music")]);

    tauri::Builder::default()
        .manage(app)
        .invoke_handler(tauri::generate_handler![
            filter_songs_by_title,
            get_all_songs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
fn filter_songs_by_title(title_filter: String, state: State<App>) -> Vec<Song> {
    state.filter_songs_by_title(title_filter)
}

#[tauri::command(async)]
fn get_all_songs(state: State<App>) -> Vec<Song> {
    state.get_all_songs()
}
