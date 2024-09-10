use std::path::Path;

use serde::{Deserialize, Serialize};

/// Represents the artwork we expect to possibly see associated with a music file
/// By default prefers folder_album_art as default, and uses embedded artwork as
/// the fallback
///
/// TODO In future, we will have the user define which artwork they would prefer
/// to use as the default
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

    pub fn get_artwork(&self) -> Option<&Path> {
        if let Some(art) = &self.folder_album_art {
            Some(art.as_ref())
        } else if let Some(art) = &self.cached_embedded_art {
            Some(art.as_ref())
        } else {
            None
        }
    }
}
