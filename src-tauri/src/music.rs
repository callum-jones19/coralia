use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct MusicTags {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub genre: String,
    pub cached_artwork_uri: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Song {
    pub file_path: String,
    pub tags: MusicTags,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    pub songs: Vec<Song>,
}

impl Collection {
    pub fn new(songs: Vec<Song>) -> Self {
        Collection { songs }
    }
}
