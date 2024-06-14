// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use lofty::prelude::*;
use lofty::probe::Probe;
use lofty::picture::*;
use serde::Serialize;

fn main() {
    read_music_metadata("C:/Users/Callum/Music/albums/Arcade Fire/Funeral/09 Rebellion (Lies).mp3");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_music_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize)]
struct MusicMetadata {
    title: String,
    artist: String,
    album: String,
    genre: String,
    encoded_cover_art: String,
}

#[tauri::command]
fn read_music_metadata(filepath: &str) -> Option<MusicMetadata> {
    let path = Path::new(filepath);

    if !path.is_file() {
        return None;
    }

    // let tagged_file = Probe::open(path)
    //     .expect("ERROR: Bad path provided")
    //     .read()
    //     .expect("ERROR: Failed to read file!");
    let tagged_file = match Probe::open(path) {
        Ok(t) => match t.read() {
            Ok(f) => f,
            Err(_) => return None,
        },
        Err(_) => return None,
    };

    let tag = match tagged_file.primary_tag() {
        Some(primary_tag) => primary_tag,
        None => match tagged_file.first_tag() {
            Some(t) => t,
            None => return None,
        },
    };

    println!("--- TAG INFORMATION ---");
    println!("Title: {}", tag.title().as_deref().unwrap_or("None"));
    println!("artist: {}", tag.artist().as_deref().unwrap_or("None"));
    println!("album: {}", tag.album().as_deref().unwrap_or("None"));
    println!("genre: {}", tag.genre().as_deref().unwrap_or("None"));
    if tag.pictures().len() > 0 {
        println!("picture: {:?}", tag.pictures()[0]);
    }

    Some(MusicMetadata {
        title: tag.title().as_deref().unwrap_or("None").to_string(),
        album: tag.album().as_deref().unwrap_or("None").to_string(),
        artist: tag.artist().as_deref().unwrap_or("None").to_string(),
        genre: tag.genre().as_deref().unwrap_or("None").to_string(),
        encoded_cover_art: String::from("tmp"),
    })
}
