use std::{
    path::{Path, PathBuf},
    sync::atomic::{AtomicUsize, Ordering},
    time::Duration,
};

use lofty::{file::AudioFile, read_from_path};
use serde::{Deserialize, Serialize};

use super::{artwork::Artwork, music_tags::MusicTags};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SongProperties {
    duration: Duration,
}

impl SongProperties {
    pub fn new_from_file(music_file_path: PathBuf) -> Result<Self, String> {
        let tagged_file = match read_from_path(music_file_path) {
            Ok(t) => t,
            Err(e) => return Err(format!("Could not read tags from file. Error: {}", e)),
        };

        let music_file_properties = tagged_file.properties();

        let duration = music_file_properties.duration();

        // TODO other props.

        Ok(SongProperties { duration })
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Song {
    pub id: usize,
    pub file_path: Box<Path>,
    pub tags: MusicTags,
    pub properties: SongProperties,
    pub album: Option<usize>,
}

static COUNTER: AtomicUsize = AtomicUsize::new(1);
fn get_id() -> usize {
    COUNTER.fetch_add(1, Ordering::Relaxed)
}

impl Song {
    pub fn new_from_file(song_path: &Path) -> Result<Self, String> {
        let music_tags = MusicTags::new_from_file(song_path.to_path_buf())?;
        let music_props = SongProperties::new_from_file(song_path.to_path_buf())?;

        // TODO get potentially embedded artwork
        let artwork = Artwork::art_from_song_folder(&mut song_path.to_path_buf());

        Ok(Song {
            id: get_id(),
            file_path: song_path.into(),
            tags: music_tags,
            properties: music_props,
            album: None,
        })
    }
}
