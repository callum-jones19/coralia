use serde::{Deserialize, Serialize};

/// Every tag is optional, except for the title. While this isn't strictly
/// speaking mandatory, I will assume that if a file is so poorly tagged that
/// it doesn't even have a title, there's probably not much point including
/// it in the collection at all.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MusicTags {
    pub title: String,
    pub artist: Option<String>,
    pub album_artist: Option<String>,
    pub album: Option<String>,
    pub genre: Option<String>,
    pub year: Option<String>,
    pub publiser: Option<String>,
    pub composer: Option<String>,
    pub original_year: Option<String>,
    // pub lyrics: TODO
    pub cached_artwork_uri: Option<String>,
}

impl MusicTags {
    pub fn new_empty_tags(song_title: String) -> Self {
        MusicTags {
            title: song_title,
            artist: None,
            album_artist: None,
            album: None,
            genre: None,
            year: None,
            publiser: None,
            composer: None,
            original_year: None,
            cached_artwork_uri: None,
        }
    }

    pub fn set_artist(mut self, artist: String) -> Self {
      self.artist = Some(artist);
      self
    }

    pub fn set_album_artist(mut self, album_artist: String) ->  Self {
      self.album_artist = Some(album_artist);
      self
    }

    pub fn set_album(mut self, album: String) -> Self {
      self.album = Some(album);
      self
    }

    pub fn set_genre(mut self, genre: String) -> Self {
      self.genre = Some(genre);
      self
    }

    pub fn set_year(mut self, year: String) -> Self {
      self.year = Some(year);
      self
    }

    pub fn set_publisher(mut self, publisher: String) -> Self {
      self.publiser = Some(publisher);
      self
    }

    pub fn set_composer(mut self, composer: String) -> Self {
      self.composer = Some(composer);
      self
    }

    pub fn set_original_year(mut self, original_year: String) -> Self {
      self.original_year = Some(original_year);
      self
    }

}