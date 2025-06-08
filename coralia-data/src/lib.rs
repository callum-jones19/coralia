use log::info;

use crate::{music_library::Library, settings::Settings};

pub mod album;
pub mod artwork;
pub mod music_library;
pub mod music_tags;
pub mod settings;
pub mod song;
mod utils;

#[derive(Debug)]
pub struct AppData {
    library: Library,
    settings: Settings,
}

impl AppData {
    pub fn init() -> AppData {
        // Initialise an empty music library, and setup the player command and the
        // the player events system.
        let music_library = Library::new_empty();

        // Read the settings
        let settings = match Settings::from_file() {
            Ok(f) => {
                info!("Read in existing settings from settings file");
                info!("{:?}", &f);
                f
            }
            Err(_) => {
                // TODO use specific error
                Settings::new()
            }
        };

        AppData {
            library: music_library,
            settings: settings,
        }
    }
}
