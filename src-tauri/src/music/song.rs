use serde::{Deserialize, Serialize};

use super::music_tags::MusicTags;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Song {
    pub file_path: String,
    pub tags: MusicTags,
}

impl Song {

}
