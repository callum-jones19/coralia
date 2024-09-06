use std::{fs::File, path::Path};

use serde::{Deserialize, Serialize};

use super::music_tags::MusicTags;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Song {
    pub file_path: String,
    pub tags: MusicTags,
}

impl Song {
    pub fn new_from_file(song_path: &Path) -> Result<Self, String> {
        let mut music_file = File::open(song_path)
            .expect(&format!("Failed to find given file {}", song_path.display()));
        let music_tags = MusicTags::new_from_file(&mut music_file)?;

        Ok(Song { file_path: String::from("()"), tags: music_tags })
    }
}
