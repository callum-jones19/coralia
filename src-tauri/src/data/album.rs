use std::sync::atomic::{AtomicUsize, Ordering};

use serde::{Deserialize, Serialize};

use super::song::Song;

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Album {
    pub id: usize,
    pub title: String,
    pub album_artist: String,
    pub album_songs: Vec<usize>,
}

static COUNTER: AtomicUsize = AtomicUsize::new(1);
fn get_id() -> usize {
    COUNTER.fetch_add(1, Ordering::Relaxed)
}

impl Album {
    /// Given an album title and album artist, filter out all the songs in the
    /// given list that meet these two values, and then construct a new
    /// album from them
    pub fn create_from_song(first_song: &mut Song) -> Result<Self, String> {
        let album_id = get_id();

        let album_artist = match &first_song.tags.album_artist {
            Some(album_artist) => album_artist,
            None => {
                return Err(String::from(
                    "Attempted to create an album from a song with no album artist",
                ))
            }
        };

        let album = match &first_song.tags.album {
            Some(album) => album,
            None => {
                return Err(String::from(
                    "Attempted to create an album from a song with no album",
                ))
            }
        };

        first_song.album = Some(album_id);

        Ok(Album {
            id: album_id,
            album_artist: album_artist.to_string(),
            title: album.to_string(),
            album_songs: vec![first_song.id],
        })
    }

    pub fn should_contain_song(&self, song_to_check: &Song) -> bool {
        let album_artist = match &song_to_check.tags.album_artist {
            Some(album_artist) => album_artist,
            None => return false,
        };

        let album = match &song_to_check.tags.album {
            Some(album) => album,
            None => return false,
        };

        album == &self.title && album_artist == &self.album_artist
    }

    /// If new_song belongs in this album, add it. Otherwise, throw an error
    /// FIXME I don't like how this is returning info. Please improve
    pub fn add_song(&mut self, new_song: &mut Song) {
        self.album_songs.push(new_song.id);
        new_song.album = Some(self.id);
    }
}
