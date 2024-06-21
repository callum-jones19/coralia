// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod music;

use std::{fs::File, path::Path};

use glob::glob;
use lofty::prelude::*;
use lofty::probe::Probe;
use music::{Collection, MusicTags, Song};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_music_metadata])
        .invoke_handler(tauri::generate_handler![get_files_in_folder_recursive])
        .invoke_handler(tauri::generate_handler![scan_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
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
        cached_artwork_uri: String::from("tmp"),
    })
}

///
/// Recursively list every file inside this path and every sub-directory
#[tauri::command(async)]
fn get_files_in_folder_recursive(root_dir: &str) -> Vec<String> {
    let path = String::from(root_dir) + "/**/*";

    let pattern = match glob(&path) {
        Ok(paths) => paths,
        Err(err) => return vec![],
    };

    let mut res: Vec<String> = Vec::new();

    for entry in pattern {
        match entry {
            Ok(path_buf) => {
                if path_buf.is_file() {
                    let tmp = String::from(path_buf.to_str().unwrap());
                    res.push(tmp);
                }
            },
            Err(err) => return vec![],
        }
    };
    return res;
}

#[tauri::command(async)]
fn scan_folder (root_dir: &str) -> Vec<Song> {
    let tagged_songs: Vec<Song> = get_files_in_folder_recursive(root_dir)
        .iter()
        .map(|file_path| (read_music_metadata(file_path), file_path))
        .filter(|tags_and_path| tags_and_path.0.is_ok())
        .map(|tags_and_path| Song {file_path: tags_and_path.1.to_owned(), tags: tags_and_path.0.unwrap() })
        .collect();

    tagged_songs
}

#[tauri::command(async)]
fn load_or_create_collection(root_dir: &str) -> Collection {
    let tagged_songs = scan_folder(root_dir);
    let collection = Collection::new(tagged_songs);

    serde_json::to_writer(writer, collection);
    todo!()
}

