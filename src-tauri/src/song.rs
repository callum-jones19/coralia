use std::any::Any;
use std::fmt::Debug;
use std::path::Path;

use lofty::prelude::*;
use lofty::probe::Probe;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MusicTags {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub genre: String,
    pub cached_artwork_uri: String,
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

        Ok(MusicTags {
            title: tag.title().as_deref().unwrap_or("None").to_string(),
            album: tag.album().as_deref().unwrap_or("None").to_string(),
            artist: tag.artist().as_deref().unwrap_or("None").to_string(),
            genre: tag.genre().as_deref().unwrap_or("None").to_string(),
            cached_artwork_uri: String::from("tmp"),
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
