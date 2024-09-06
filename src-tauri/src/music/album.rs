use serde::{Deserialize, Serialize};

use super::song::Song;

#[derive(Debug, Deserialize, Serialize)]
pub struct Album {
    pub title: String,
    pub album_artist: String,
    pub album_songs: Vec<Song>,
}

impl Album {
    /// Given an album title and album artist, filter out all the songs in the
    /// given list that meet these two values, and then construct a new
    /// album from them
    pub fn new_filtered(album_title: String, album_artist: String, songs: Vec<Song>) -> Self {
        let filtered_songs: Vec<Song> = songs
            .into_iter()
            .filter(|song| {
                song.has_album_artist(&album_artist) && song.has_album_name(&album_title)
            })
            .collect();

        Album {
            title: album_title,
            album_artist: album_artist,
            album_songs: filtered_songs,
        }
    }
}
