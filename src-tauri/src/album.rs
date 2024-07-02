use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Album {
  pub title: String,
  pub cached_artwork_uri: String,
  pub album_artist: String,
  // TODO release date, etc
}

impl Album {
  pub fn new(title: String, cached_artwork_uri: String, album_artist: String) -> Self {
    Album { title, cached_artwork_uri, album_artist }
  }
}