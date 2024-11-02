// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::Path, sync::{ mpsc::{self, Receiver, Sender}, Mutex}};

use data::song::Song;
use player::audio::Player;
use tauri::{async_runtime::{Runtime, TokioRuntime}, Manager, State};


mod data;
mod player;

enum PlayerCommand {
    Enqueue(Song),
    Play,
    Pause,
    SetVolume(f32)
}

struct AppState {
    command_tx: Sender<PlayerCommand>,
}

fn main() {
    let tauri_context = tauri::generate_context!();

    let (tx, rx): (Sender<PlayerCommand> , Receiver<PlayerCommand>) = mpsc::channel();


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
                        },
                        PlayerCommand::Play => {
                            player.play();
                        },
                        PlayerCommand::Pause => {
                            player.pause();
                        },
                        PlayerCommand::SetVolume(vol) => {
                            player.change_vol(vol);
                        },
                    }
                }
            });
            Ok(())
        })
        .manage(Mutex::new(AppState {
            command_tx: tx,
        }))
        .invoke_handler(tauri::generate_handler![enqueue_song])
        .run(tauri_context)
        .expect("Error while running tauri application!");
}

#[tauri::command]
async fn enqueue_song(state_mutex: State<'_, Mutex<AppState>>, song: Song) -> Result<(), ()> {
    println!("Received tauri command: enqueue_song");

    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Enqueue(song)).unwrap();
    Ok(())
}





// fn handle_inputs(player: &mut Player) {
//     loop {
//         print!(">: ");
//         std::io::stdout().flush().unwrap();
//         let mut input = String::new();
//         match io::stdin().read_line(&mut input) {
//             Err(_) => continue,
//             _ => {}
//         }
//         let tmp_cmd = match input.strip_suffix("\n") {
//             Some(c) => c,
//             None => continue,
//         };

//         let mut whole_command = tmp_cmd.split_whitespace();
//         let command = match whole_command.next() {
//             Some(c) => c,
//             None => continue,
//         };

//         if command == "play" {
//             player.play();
//         } else if command == "pause" {
//             player.pause();
//         } else if command == "q" {
//             return;
//         } else if command == "enqueue" {
//             let path = Path::new(whole_command.next().unwrap());
//             println!("Path: {:?}", path);
//             let try_song = Song::new_from_file(path);
//             let song = match try_song {
//                 Ok(s) => s,
//                 Err(_) => {
//                     println!("Could not parse given song path");
//                     return;
//                 }
//             };

//             player.add_to_queue(&song);
//         } else if command == "skip" {
//             player.skip_current_song();
//         } else if command == "debug" {
//             player.debug_queue();
//         } else if command == "help" {
//             println!("Available commands: play, pause, q, enqueue, skip, debug");
//         } else {
//             println!("Unknown command");
//         }
//     }
// }
