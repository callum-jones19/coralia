// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    path::Path,
    sync::{
        mpsc::{self, Receiver, Sender},
        Mutex,
    },
};

use data::{album::Album, library::Library, song::Song};
use player::audio::Player;
use tauri::{
    async_runtime::{Runtime, TokioRuntime},
    Manager, State,
};

mod data;
mod player;

enum PlayerCommand {
    Enqueue(Song),
    Play,
    Pause,
    SetVolume(f32),
}

struct AppState {
    command_tx: Sender<PlayerCommand>,
    library: Library,
}

fn main() {
    let tauri_context = tauri::generate_context!();
    let root_lib_str = String::from("C:/Users/Callum/Music/music");
    let root_lib = Path::new(&root_lib_str);

    println!("Setting up music library...");
    let music_library = Library::new(root_lib);
    println!("Scanned music library...");
    let (tx, rx): (Sender<PlayerCommand>, Receiver<PlayerCommand>) = mpsc::channel();

    tauri::Builder::default()
        .setup(move |app| {
            tauri::async_runtime::spawn(async move {
                println!("Starting loop");
                let mut player = Player::new();

                loop {
                    let command = rx.recv().unwrap();
                    match command {
                        PlayerCommand::Enqueue(song) => {
                            player.add_to_queue(&song);
                        }
                        PlayerCommand::Play => {
                            player.play();
                        }
                        PlayerCommand::Pause => {
                            player.pause();
                        }
                        PlayerCommand::SetVolume(vol) => {
                            player.change_vol(vol);
                        }
                    }
                }
            });
            Ok(())
        })
        .manage(Mutex::new(AppState {
            command_tx: tx,
            library: music_library,
        }))
        .invoke_handler(tauri::generate_handler![
            enqueue_song,
            get_library_songs,
            get_library_albums
        ])
        .run(tauri_context)
        .expect("Error while running tauri application!");
}

// ============================== Commands =====================================
#[tauri::command]
async fn enqueue_song(state_mutex: State<'_, Mutex<AppState>>, song: Song) -> Result<(), ()> {
    println!("Received tauri command: enqueue_song");

    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Enqueue(song)).unwrap();
    Ok(())
}

// ============================= Senders =======================================
#[tauri::command]
async fn get_library_songs(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_songs())
}

#[tauri::command]
async fn get_library_albums(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Album>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_albums())
}
