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
            get_all_songs,
            get_queue,
            add_to_queue,
            queue_pop,
            clear_queue
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
fn filter_songs_by_title(title_filter: String, state: State<App>) -> Vec<Song> {
    println!("1");
    state.filter_songs_by_title(title_filter)
}

#[tauri::command(async)]
fn get_all_songs(state: State<App>) -> Vec<Song> {
    println!("2");
    state.get_all_songs()
}

#[tauri::command(async)]
fn get_queue(state: State<App>) -> Vec<Song> {
    println!("3");
    state.get_queue()
}

#[tauri::command(async)]
fn add_to_queue(state: State<App>, song_to_add_path: String) -> Vec<Song> {
    println!("4");
    state.collection.lock().unwrap().add_to_queue(song_to_add_path);
    state.collection.lock().unwrap().get_queue()
}

#[tauri::command(async)]
fn queue_pop(state: State<App>) -> Option<Song> {
    println!("5");
    state.collection.lock().unwrap().queue_pop()
}

#[tauri::command(async)]
fn clear_queue(state: State<App>) {
    println!("6");
    state.collection.lock().unwrap().empty_queue();
}
