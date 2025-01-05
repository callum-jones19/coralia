// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    path::PathBuf,
    sync::{
        mpsc::{channel, Receiver, Sender},
        Mutex,
    },
    time::Duration,
};

use data::{album::Album, library::Library, song::Song};
use player::audio::{CachedPlayerState, Player, PlayerStateUpdate};
use serde::Serialize;
use tauri::{AppHandle, Manager, State};

mod data;
mod player;
mod utils;

enum PlayerCommand {
    EmptyAndPlay(Box<Song>),
    Enqueue(Box<Song>),
    Play,
    Pause,
    SetVolume(u8),
    SkipOne,
    RemoveAtIndex(usize),
    TrySeek(Duration),
    GetPlayerState(Sender<CachedPlayerState>),
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PlayEventData {
    paused: bool,
    position: Duration,
}

struct AppState {
    command_tx: Sender<PlayerCommand>,
    library: Library,
}

fn create_and_run_audio_player(
    state_update_tx: Sender<PlayerStateUpdate>,
    player_cmd_rx: Receiver<PlayerCommand>,
) {
    println!("Starting player command handler loop");
    let mut player = Player::new(state_update_tx);

    loop {
        let command = player_cmd_rx.recv().unwrap();
        match command {
            PlayerCommand::Enqueue(song) => {
                player.add_to_queue(&song);
            }
            PlayerCommand::Play => {
                println!("Resuming playback");
                player.play();
            }
            PlayerCommand::Pause => {
                println!("Pausing playback");
                player.pause();
            }
            PlayerCommand::SetVolume(vol) => {
                let clamped_vol = if vol > 100 { 100 } else { vol };
                let parsed_vol = f32::from(clamped_vol) / 100.0;
                println!("{}", parsed_vol);
                player.change_vol(parsed_vol);
            }
            PlayerCommand::SkipOne => {
                println!("skipping");
                player.skip_current_song();
                player.play();
            }
            PlayerCommand::EmptyAndPlay(song) => {
                player.clear();
                player.add_to_queue(&song);
            }
            PlayerCommand::TrySeek(duration) => {
                match player.seek_current_song(duration) {
                    Ok(_) => println!("Seeking song"),
                    Err(_) => println!("Unable to seek current song"),
                };
            }
            PlayerCommand::RemoveAtIndex(skip_index) => {
                let _ = player.remove_song_from_queue(skip_index);
            }
            PlayerCommand::GetPlayerState(state_rx) => {
                let cached_state = player.get_current_state();
                state_rx.send(cached_state).unwrap();
            }
        }
    }
}

fn handle_player_events(handle: AppHandle, player_event_rx: Receiver<PlayerStateUpdate>) {
    println!("Starting player state update handler loop");
    loop {
        println!("State updated!");
        let state_update = player_event_rx.recv().unwrap();
        match state_update {
            PlayerStateUpdate::SongEnd(new_queue) => {
                handle
                    .emit_all("currently-playing-update", &new_queue.front())
                    .unwrap();
                handle
                    .emit_all("song-end-queue-length", &new_queue.len())
                    .unwrap();
                handle.emit_all("song-end", new_queue.clone()).unwrap();
                handle.emit_all("queue-change", new_queue).unwrap();
            }
            PlayerStateUpdate::SongPlay(song_pos) => {
                let payload = PlayEventData {
                    paused: false,
                    position: song_pos,
                };
                handle.emit_all("is-paused", payload).unwrap();
            }
            PlayerStateUpdate::SongPause(song_pos) => {
                let payload = PlayEventData {
                    paused: true,
                    position: song_pos,
                };
                handle.emit_all("is-paused", payload).unwrap();
            }
            PlayerStateUpdate::QueueUpdate(updated_queue) => {
                if updated_queue.len() == 1 {
                    handle
                        .emit_all("currently-playing-update", &updated_queue.front())
                        .unwrap();
                }
                handle
                    .emit_all("queue-length-change", &updated_queue.len())
                    .unwrap();
                handle.emit_all("queue-change", updated_queue).unwrap();
            }
        }
    }
}

fn main() {
    let tauri_context = tauri::generate_context!();

    // Initialise an empty music library, and setup the player command and the
    // the player events system.
    let music_library = Library::new_empty();
    let (player_cmd_tx, player_cmd_rx) = channel::<PlayerCommand>();
    let (player_event_tx, player_event_rx) = channel::<PlayerStateUpdate>();

    tauri::Builder::default()
        .setup(move |app| {
            let handle = app.app_handle();

            tauri::async_runtime::spawn(async move {
                create_and_run_audio_player(player_event_tx, player_cmd_rx);
            });

            tauri::async_runtime::spawn(async move {
                handle_player_events(handle, player_event_rx);
            });

            Ok(())
        })
        .manage(Mutex::new(AppState {
            command_tx: player_cmd_tx,
            library: music_library,
        }))
        .invoke_handler(tauri::generate_handler![
            add_library_directories,
            enqueue_song,
            clear_queue_and_play,
            play,
            pause,
            set_volume,
            skip_current_song,
            get_library_songs,
            get_library_albums,
            seek_current_song,
            remove_song_from_queue,
            get_player_state,
            load_library_from_cache,
        ])
        .run(tauri_context)
        .expect("Error while running tauri application!");
}

// ============================== Commands =====================================
#[tauri::command]
async fn add_library_directories(
    state_mutex: State<'_, Mutex<AppState>>,
    root_dirs: Vec<PathBuf>,
) -> Result<(), ()> {
    let mut state = state_mutex.lock().unwrap();
    state.library.add_new_folders(root_dirs);
    state.library.scan_library_songs();
    state.library.scan_library_albums();

    state.library.save_library_to_cache();

    Ok(())
}

#[tauri::command]
async fn load_library_from_cache(state_mutex: State<'_, Mutex<AppState>>) -> Result<bool, ()> {
    let mut state = state_mutex.lock().unwrap();
    let lib = Library::get_library_from_cache();
    match lib {
        Some(saved_lib) => {
            state.library = saved_lib;
            Ok(true)
        }
        None => return Ok(false),
    }
}

#[tauri::command]
async fn enqueue_song(state_mutex: State<'_, Mutex<AppState>>, song: Song) -> Result<(), ()> {
    println!("Received tauri command: enqueue_song");

    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::Enqueue(Box::new(song)))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn clear_queue_and_play(
    state_mutex: State<'_, Mutex<AppState>>,
    song: Song,
) -> Result<(), ()> {
    println!("Received tauri command: enqueue_song");

    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::EmptyAndPlay(Box::new(song)))
        .unwrap();
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
async fn set_volume(state_mutex: State<'_, Mutex<AppState>>, new_volume: u8) -> Result<(), ()> {
    println!("Received tauri command: set_volume, {}", new_volume);

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

#[tauri::command]
async fn remove_song_from_queue(
    state_mutex: State<'_, Mutex<AppState>>,
    skip_index: usize,
) -> Result<(), ()> {
    println!("Received tauri command: remove song from queue");

    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::RemoveAtIndex(skip_index))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn seek_current_song(
    state_mutex: State<'_, Mutex<AppState>>,
    seek_duration: Duration,
) -> Result<(), ()> {
    println!("Received tauri command: seek song");

    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::TrySeek(seek_duration))
        .unwrap();

    Ok(())
}

// ============================= Senders =======================================
#[tauri::command]
async fn get_library_songs(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_songs_unordered())
}

#[tauri::command]
async fn get_library_albums(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Album>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_albums())
}

#[tauri::command]
async fn get_player_state(
    state_mutex: State<'_, Mutex<AppState>>,
) -> Result<CachedPlayerState, ()> {
    let state = state_mutex.lock().unwrap();

    let (rx, tx): (Sender<CachedPlayerState>, Receiver<CachedPlayerState>) = channel();
    let _ = state.command_tx.send(PlayerCommand::GetPlayerState(rx));

    // Sleep on the response
    let updated_state = tx.recv().unwrap();

    Ok(updated_state)
}
