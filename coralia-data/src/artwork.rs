use core::panic;
use std::{
    fs::{self, File, create_dir_all},
    io::BufWriter,
    path::{Path, PathBuf},
};

use log::info;
use serde::{Deserialize, Serialize};

use super::song::Song;

/// Get the path of the album art that sits in the song and album folders as
/// separate image files, if it exists
fn find_folder_art(song_path: &Path) -> Option<PathBuf> {
    let art_file_names = vec![
        "folder", "Folder", "cover", "Cover", "front", "Front", "artwork", "Artwork",
    ];

    let mut song_folder_path = PathBuf::from(song_path);
    song_folder_path.pop();

    // Try each possible art file name in the list and return the first
    // found artwork
    for art_f_name in art_file_names {
        let jpg_file_name = String::from(art_f_name) + ".jpg";
        let png_file_name = String::from(art_f_name) + ".png";
        let jpg_path = Path::new(&jpg_file_name);
        let png_path = Path::new(&png_file_name);

        let mut jpg_full_path = PathBuf::from(&song_folder_path);
        jpg_full_path.push(jpg_path);

        let mut png_full_path = PathBuf::from(&song_folder_path);
        png_full_path.push(png_path);

        // Check if a jpg cover exists
        // FIXME exists is error prone
        if jpg_full_path.exists() {
            return Some(jpg_full_path.to_owned());
        } else if png_full_path.exists() {
            return Some(png_full_path.to_owned());
        }
    }

    // No art was found in the song's folder
    None
}

fn create_art_folder_if_missing() {
    match dirs::cache_dir() {
        Some(mut cache) => {
            cache.push("coralia");
            cache.push("AlbumArtwork");
            if !cache.exists() {
                create_dir_all(cache).unwrap();
            }
        }
        None => panic!("No cache folder exists"),
    }
}

fn get_album_art_folder() -> Result<PathBuf, String> {
    create_art_folder_if_missing();

    match dirs::cache_dir() {
        Some(mut cache) => {
            cache.push("coralia");
            cache.push("AlbumArtwork");
            Ok(cache)
        }
        None => Err(String::from("Could not find system cache folder")),
    }
}

/// Represents the artwork we expect to possibly see associated with a music file
/// By default prefers folder_album_art as default, and uses embedded artwork as
/// the fallback
///
/// TODO In future, we will have the user define which artwork they would prefer
/// to use as the default
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Artwork {
    pub full_res_art: PathBuf,
    pub thumb_art: PathBuf,
    pub art_400: PathBuf,
}

impl Artwork {
    pub fn new(song: &Song) -> Option<Self> {
        info!(
            "Generating album art for {}",
            song.tags.album.as_ref().unwrap()
        );
        let try_folder_art = find_folder_art(&song.file_path);

        let artwork = match try_folder_art {
            Some(folder_art) => None,
            None => None,
        };

        artwork
    }
}
