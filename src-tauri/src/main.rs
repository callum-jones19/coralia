// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    env,
    fs::File,
    io::{self, stdin, BufReader, Write},
    path::Path,
};

use data::{library::Library, song::Song};
use player::audio::Player;
use rodio::Decoder;

mod data;
mod player;

fn main() {
    let mut player = Player::new();

    println!("Enter command:");
    loop {
        print!(">: ");
        std::io::stdout().flush().unwrap();
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        let tmp_cmd = input.strip_suffix("\n").unwrap();

        let mut whole_command = tmp_cmd.split_whitespace();
        let command = whole_command.next().unwrap();
        if command == "play" {
            todo!();
        } else if command == "pause" {
            todo!();
        } else if command == "q" {
            break;
        } else if command == "enqueue" {
            let path = Path::new(whole_command.next().unwrap());
            println!("Path: {:?}", path);
            let try_song = Song::new_from_file(path);
            let song = match try_song {
                Ok(s) => s,
                Err(_) => {
                    println!("Could not parse given song path");
                    continue;
                }
            };

            player.add_to_queue(song);
            player.play();
        } else if command == "skip" {
            player.skip();
        } else if command == "help" {
            println!("Current queue: {:?}", player.queue());
            println!("Available commands: play, pause, q, enqueue, skip");
        } else {
            println!("Unknown command");
        }
    }
}
