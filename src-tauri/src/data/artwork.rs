use std::path::Path;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Artwork {
    cached_embedded_art: Option<Box<Path>>,
    folder_album_art: Option<Box<Path>>,
}

impl Artwork {
    pub fn blank_artwork() -> Self {
        Artwork {
            cached_embedded_art: None,
            folder_album_art: None,
        }
    }

    pub fn has_no_art(&self) -> bool {
        self.cached_embedded_art.is_none() && self.folder_album_art.is_none()
    }

    pub fn has_art(&self) -> bool {
        self.cached_embedded_art.is_some() || self.folder_album_art.is_some()
    }
}
