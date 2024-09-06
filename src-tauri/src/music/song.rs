use std::path::Path;

use serde::{Deserialize, Serialize};

use super::music_tags::MusicTags;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Song {
    pub file_path: String,
    pub tags: MusicTags,
}

impl Song {
    pub fn new_from_file(song_path: &Path) -> Self {

        todo!()
    }
}
