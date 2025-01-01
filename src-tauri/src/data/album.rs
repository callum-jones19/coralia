use serde::{Deserialize, Serialize};

use super::{artwork::Artwork, song::Song};

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Album {
    pub title: String,
    pub album_artist: String,
    pub album_songs: Vec<Song>,
}

impl Album {
    /// Given an album title and album artist, filter out all the songs in the
    /// given list that meet these two values, and then construct a new
    /// album from them
    pub fn create_from_song(first_song: &Song) -> Result<Self, String> {
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

        Ok(Album {
            album_artist: album_artist.to_string(),
            title: album.to_string(),
            album_songs: vec![first_song.clone()],
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
    pub fn try_add_song(&mut self, new_song: &Song) -> Result<(), String> {
        let album_artist = match &new_song.tags.album_artist {
            Some(album_artist) => album_artist,
            None => {
                return Err(String::from(
                    "Attempted to create an album from a song with no album artist",
                ))
            }
        };

        let album = match &new_song.tags.album {
            Some(album) => album,
            None => {
                return Err(String::from(
                    "Attempted to create an album from a song with no album",
                ))
            }
        };

        if album == &self.title && album_artist == &self.album_artist {
            self.album_songs.push(new_song.clone());

            // Check if we need to update the album's artwork
            // TODO
            // if self.artwork.has_no_art() && new_song.artwork.has_art() {
            //     self.artwork = new_song.artwork.clone();
            // }

            Ok(())
        } else {
            Err(String::from("New song did not match album criteria"))
        }
    }
}
