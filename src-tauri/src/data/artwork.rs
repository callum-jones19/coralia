use std::path::PathBuf;

use serde::{Deserialize, Serialize};

/// Represents the artwork we expect to possibly see associated with a music file
/// By default prefers folder_album_art as default, and uses embedded artwork as
/// the fallback
///
/// TODO In future, we will have the user define which artwork they would prefer
/// to use as the default
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Artwork {
    cached_embedded_art: Option<PathBuf>,
    folder_album_art: Option<PathBuf>,
}

impl Artwork {
    pub fn blank_artwork() -> Self {
        Artwork {
            cached_embedded_art: None,
            folder_album_art: None,
        }
    }

    /// Look in the folder of the given song path for an artwork file with the
    /// given art file name
    fn try_art_by_name(song_path: &mut PathBuf, art_file_name: &str) -> Option<Self> {
        // Look for folder artwork.
        song_path.pop();
        song_path.push(art_file_name);

        // FIXME change to try_exists when you fix MSRV
        let art_file_exists = song_path.exists();

        if art_file_exists {
            Some(Artwork {
                cached_embedded_art: None,
                folder_album_art: Some(song_path.clone()),
            })
        } else {
            None
        }
    }

    pub fn art_from_song_folder(song_path: &mut PathBuf) -> Self {
        let cover_name_opts = vec![
            "folder", "Folder", "cover", "Cover", "front", "Front", "artwork", "Artwork",
        ];

        // Try each possible art file name in the list and return the first
        // found artwork
        for cover_name in cover_name_opts {
            let cover_name_jpg = cover_name.to_owned() + ".jpg";
            let cover_name_png = cover_name.to_owned() + ".png";

            let try_art_jpg = Self::try_art_by_name(song_path, &cover_name_jpg);
            if let Some(art) = try_art_jpg {
                return art;
            }

            let try_art_png = Self::try_art_by_name(song_path, &cover_name_png);
            if let Some(art) = try_art_png {
                return art;
            }
        }

        // If no art was found, return a blank artwork
        Self::blank_artwork()
    }

    pub fn has_no_art(&self) -> bool {
        self.cached_embedded_art.is_none() && self.folder_album_art.is_none()
    }

    pub fn has_art(&self) -> bool {
        self.cached_embedded_art.is_some() || self.folder_album_art.is_some()
    }

    // pub fn get_artwork(&self) -> Option<&Path> {
    //     if let Some(art) = &self.folder_album_art {
    //         Some(art.as_ref())
    //     } else if let Some(art) = &self.cached_embedded_art {
    //         Some(art.as_ref())
    //     } else {
    //         None
    //     }
    // }
}
