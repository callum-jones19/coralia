// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use lofty::prelude::*;
use lofty::probe::Probe;
use serde::Serialize;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_music_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize)]
struct MusicTags {
    title: String,
    artist: String,
    album: String,
    genre: String,
    encoded_cover_art: String,
}

#[tauri::command]
fn read_music_metadata(filepath: &str) -> Result<MusicTags, String> {
    let path = Path::new(filepath);

    let tagged_file = match Probe::open(path) {
        Ok(t) => match t.read() {
            Ok(f) => f,
            Err(e) => return Err(format!("ERROR {:?}: Unregistered file type was encountered while reading file {}", e.kind(), path.display())),
        },
        Err(e) => return Err(format!("ERROR {:?}: Given path {} does not exist", e.kind(), path.display())),
    };

    let tag = match tagged_file.primary_tag() {
        Some(primary_tag) => primary_tag,
        None => match tagged_file.first_tag() {
            Some(t) => t,
            None => return Err("ERROR: Failed to grab any tags off the provided file".into()),
        },
    };

    Ok(MusicTags {
        title: tag.title().as_deref().unwrap_or("None").to_string(),
        album: tag.album().as_deref().unwrap_or("None").to_string(),
        artist: tag.artist().as_deref().unwrap_or("None").to_string(),
        genre: tag.genre().as_deref().unwrap_or("None").to_string(),
        encoded_cover_art: String::from("tmp"),
    })
}
