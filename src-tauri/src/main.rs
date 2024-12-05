// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    collections::VecDeque, path::Path, sync::{
        mpsc::{channel, Receiver, Sender}, Arc, Mutex
    }, time::Duration
};

use data::{album::Album, library::Library, song::Song};
use player::audio::{CachedPlayerState, Player, PlayerStateUpdate};
use serde::Serialize;
use tauri::{Manager, State};

mod data;
mod player;

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
struct PlayInfo {
    paused: bool,
    position: Duration,
}



struct AppState {
    command_tx: Sender<PlayerCommand>,
    library: Library,
}

fn main() {
    let tauri_context = tauri::generate_context!();
    let root_lib_str = String::from("C:/Users/Callum/Music/music/Magdalena Bay");
    let root_lib = Path::new(&root_lib_str);

    println!("Setting up music library...");
    let music_library = Library::new(root_lib);
    println!("Scanned music library...");
    let (player_cmd_tx, player_cmd_rx) = channel::<PlayerCommand>();
    let (state_update_tx, state_update_rx) = channel::<PlayerStateUpdate>();

    tauri::Builder::default()
        .setup(move |app| {
            let handle = app.app_handle();

            tauri::async_runtime::spawn(async move {
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
                        }
                        PlayerCommand::EmptyAndPlay(song) => {
                            player.clear();
                            player.add_to_queue(&song);
                        }
                        PlayerCommand::TrySeek(duration) => {
                            player.seek_current_song(duration);
                        }
                        PlayerCommand::RemoveAtIndex(skip_index) => {
                            let _ = player.remove_song_from_queue(skip_index);
                        },
                        PlayerCommand::GetPlayerState(state_rx) => {
                            let cached_state = player.get_current_state();
                            state_rx.send(cached_state).unwrap();
                        },
                    }
                }
            });

            tauri::async_runtime::spawn(async move {
                println!("Starting player state update handler loop");
                loop {
                    println!("State updated!");
                    let state_update = state_update_rx.recv().unwrap();
                    match state_update {
                        PlayerStateUpdate::SongEnd(new_queue) => {
                            handle.emit_all("currently-playing-update", &new_queue.get(0)).unwrap();
                            handle.emit_all("song-end-queue-length", &new_queue.len()).unwrap();
                            handle.emit_all("song-end", new_queue).unwrap();
                        }
                        PlayerStateUpdate::SongPlay(song_pos) => {
                            let payload = PlayInfo {paused: false, position: song_pos};
                            handle.emit_all("is-paused", payload).unwrap();
                        }
                        PlayerStateUpdate::SongPause(song_pos) => {
                            let payload = PlayInfo {paused: true, position: song_pos};
                            handle.emit_all("is-paused", payload).unwrap();
                        }
                        PlayerStateUpdate::QueueUpdate(updated_queue) => {
                            if updated_queue.len() == 1 {
                                handle.emit_all("currently-playing-update", &updated_queue.get(0)).unwrap();
                            }
                            handle.emit_all("queue-length-change", &updated_queue.len()).unwrap();
                            handle.emit_all("queue-change", updated_queue).unwrap();
                        }
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
        ])
        .run(tauri_context)
        .expect("Error while running tauri application!");
}

// ============================== Commands =====================================
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
    Ok(state.library.get_all_songs())
}

#[tauri::command]
async fn get_library_albums(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Album>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_albums())
}

#[tauri::command]
async fn get_player_state(state_mutex: State<'_, Mutex<AppState>>) -> Result<CachedPlayerState, ()> {
    let state = state_mutex.lock().unwrap();

    let (rx, tx): (Sender<CachedPlayerState>, Receiver<CachedPlayerState>) = channel();
    let _ = state.command_tx.send(PlayerCommand::GetPlayerState(rx));

    // Sleep on the response
    let updated_state = tx.recv().unwrap();

    Ok(updated_state)
}
