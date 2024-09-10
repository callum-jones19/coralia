use std::{fs::File, path::Path};

use serde::{Deserialize, Serialize};

use super::{artwork::Artwork, music_tags::MusicTags};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Song {
    pub file_path: Box<Path>,
    pub tags: MusicTags,
    pub artwork: Artwork,
}

impl Song {
    pub fn new_from_file(song_path: &Path) -> Result<Self, String> {
        let mut music_file = match File::open(song_path) {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to open file {:?}. Error {}", song_path, e)),
        };
        let music_tags = MusicTags::new_from_file(&mut music_file)?;
        // TODO get potentially embedded artwork
        let artwork = Artwork::artwork_from_folder(&mut song_path.to_path_buf());

        Ok(Song {
            file_path: song_path.into(),
            tags: music_tags,
            artwork: artwork,
        })
    }

    pub fn has_album_name(&self, album_name: &str) -> bool {
        match &self.tags.album {
            Some(album) => album == album_name,
            None => false,
        }
    }

    pub fn has_album_artist(&self, album_artist: &str) -> bool {
        match &self.tags.artist {
            Some(artist) => artist == album_artist,
            None => false,
        }
    }
}
