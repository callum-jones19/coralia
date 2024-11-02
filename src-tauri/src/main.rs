// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::Path, sync::Mutex};

use crossbeam::channel::Sender;
use data::{album::Album, library::Library, song::Song};
use player::audio::{Player, PlayerEvent};
use tauri::{Manager, State};

mod data;
mod player;

enum PlayerCommand {
    Enqueue(Song),
    Play,
    Pause,
    SetVolume(f32),
    SkipOne,
}

struct PlayerState {
    is_playing: bool,
    curr_song_pos: Option<f32>,
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
    let (player_cmd_tx, player_cmd_rx) = crossbeam::channel::unbounded::<PlayerCommand>();

    tauri::Builder::default()
        .setup(move |app| {
            let (player_event_tx, player_event_rx) = crossbeam::channel::unbounded::<PlayerEvent>();
            let player_event_rx2 = player_event_rx.clone();

            tauri::async_runtime::spawn(async move {
                println!("Starting player command handler loop");
                let mut player = Player::new(player_event_tx, player_event_rx);

                loop {
                    let command = player_cmd_rx.recv().unwrap();
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
                        PlayerCommand::SkipOne => {
                            player.skip_current_song();
                        }
                    }
                }
            });

            let handle = app.app_handle();
            tauri::async_runtime::spawn(async move {
                println!("Starting player event handler loop");
                loop {
                    let event = player_event_rx2.recv().unwrap();
                    match event {
                        PlayerEvent::SongEnd => {
                            handle.emit_all("songEnd", ()).unwrap();
                        },
                        PlayerEvent::SongPause => {
                            handle.emit_all("isPaused", true).unwrap();
                        },
                        PlayerEvent::SongPlay => {
                            handle.emit_all("isPaused", false).unwrap();
                        },
                    }
                }
            });

            Ok(())
        })
        .manage(Mutex::new(AppState {
            command_tx: player_cmd_tx,
            library: music_library,
        }))
        .invoke_handler(tauri::generate_handler![
            enqueue_song,
            play,
            pause,
            set_volume,
            skip_current_song,
            get_library_songs,
            get_library_albums,
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

#[tauri::command]
async fn play(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    println!("Received tauri command: play");

    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Play).unwrap();
    Ok(())
}

#[tauri::command]
async fn pause(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    println!("Received tauri command: pause");

    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Pause).unwrap();
    Ok(())
}

#[tauri::command]
async fn set_volume(state_mutex: State<'_, Mutex<AppState>>, new_volume: f32) -> Result<(), ()> {
    println!("Received tauri command: set_volume");

    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::SetVolume(new_volume))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn skip_current_song(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    println!("Received tauri command: skip song");

    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::SkipOne).unwrap();
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

// async fn is_player_playing(state_mutex: State<'_, Mutex<AppState>>) -> Result<bool, ()> {
//     let state = state_mutex.lock().unwrap();
//     Ok(state.player_state.is_playing)
// }
