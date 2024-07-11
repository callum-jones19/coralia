use std::io::{BufWriter, Write};
use std::path::Path;
use std::{fmt::Debug, fs::File};

use lofty::prelude::*;
use lofty::probe::Probe;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MusicTags {
    pub title: String,
    pub artist: String,
    pub album_artist: String,
    pub album: String,
    pub genre: String,
    pub cached_artwork_uri: Option<String>,
}

impl MusicTags {
    pub fn read_from_file(song_path: &String) -> Result<Self, String> {
        let path = Path::new(song_path);

        let tagged_file = match Probe::open(path) {
            Ok(t) => match t.read() {
                Ok(f) => f,
                Err(_) => {
                    return Err(format!(
                        "Unregistered file type was encountered while reading {}",
                        path.display()
                    ));
                }
            },
            Err(_) => return Err(format!("Path {} does not exist", path.display())),
        };

        let tag = match tagged_file.primary_tag() {
            Some(primary_tag) => primary_tag,
            None => match tagged_file.first_tag() {
                Some(t) => t,
                None => return Err("ERROR: Failed to grab any tags off the provided file".into()),
            },
        };

        let album_artist: Vec<String> = tag
            .get_strings(&ItemKey::AlbumArtist)
            .map(|artist| artist.to_string())
            .collect();

        // Deal with the cover art
        // Create the cache folder, if it doesn't exist
        let cached_dir_path = Path::new("/home/callumjones/kleo");

        let cover = tag.pictures().first();
        let mut cached_artwork_uri: Option<String> = None;
        if let Some(pic) = cover {
            let sanitised_album_title: String = tag
                .album()
                .unwrap()
                .to_string()
                .chars()
                .filter(|letter| letter.is_alphabetic() || letter.is_numeric())
                .collect();
            let cached_art_file_name = cached_dir_path
                .join(sanitised_album_title + "_" + &tag.year().unwrap_or(0).to_string() + ".jpg")
                .to_str()
                .unwrap()
                .to_string();
            match File::create(&Path::new(&cached_art_file_name)) {
                Ok(created_file) => {
                    let mut writer = BufWriter::new(created_file);
                    writer.write(pic.data()).unwrap();
                    cached_artwork_uri = Some(cached_art_file_name);
                }
                Err(e) => {
                    println!(
                        "Failed to write cached art file for song with name {}",
                        &cached_art_file_name
                    );
                    println!("ERROR: {}", e.to_string());
                }
            }
        }

        Ok(MusicTags {
            title: tag.title().as_deref().unwrap_or("None").to_string(),
            album: tag.album().as_deref().unwrap_or("None").to_string(),
            album_artist: album_artist.first().unwrap().to_string(),
            artist: tag.artist().as_deref().unwrap_or("None").to_string(),
            genre: tag.genre().as_deref().unwrap_or("None").to_string(),
            cached_artwork_uri: cached_artwork_uri,
        })
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Song {
    pub file_path: String,
    pub tags: MusicTags,
}

impl Song {
    pub fn new(song_file_path: String, tags: MusicTags) -> Self {
        Song {
            file_path: song_file_path,
            tags,
        }
    }

    pub fn from_file(song_file_path: String) -> Result<Self, String> {
        let song_tags = MusicTags::read_from_file(&song_file_path)?;

        return Ok(Self::new(song_file_path, song_tags));
    }
}
