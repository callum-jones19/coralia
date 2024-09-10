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
}
