// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    io::{self, Write},
    path::Path, sync::mpsc::channel,
};

use data::song::Song;
use player::audio::Player;

mod data;
mod player;

fn main() {
    let mut player = Player::new();

    println!("Enter command:");
    loop {
        handle_inputs(&mut player);
    }
}

fn handle_inputs(player: &mut Player) {
        print!(">: ");
        std::io::stdout().flush().unwrap();
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        let tmp_cmd = input.strip_suffix("\n").unwrap();

        let mut whole_command = tmp_cmd.split_whitespace();
        let command = whole_command.next().unwrap();
        if command == "play" {
            player.play();
        } else if command == "pause" {
            player.pause();
        } else if command == "q" {
            return;
        } else if command == "enqueue" {
            let path = Path::new(whole_command.next().unwrap());
            println!("Path: {:?}", path);
            let try_song = Song::new_from_file(path);
            let song = match try_song {
                Ok(s) => s,
                Err(_) => {
                    println!("Could not parse given song path");
                    return;
                }
            };

            player.add_to_queue(&song);
        } else if command == "skip" {
            player.skip_current_song();
        } else if command == "debug" {
            player.debug_queue();
        } else if command == "help" {
            println!("Available commands: play, pause, q, enqueue, skip, debug");
        } else {
            println!("Unknown command");
        }
}
