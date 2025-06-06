// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    path::{Path, PathBuf},
    sync::{
        Arc, Mutex,
        mpsc::{Receiver, Sender, channel},
    },
    thread,
    time::Duration,
};

use data::{
    album::Album,
    library::{ExportedLibrary, Library, SearchResults},
    settings::Settings,
    song::Song,
};
use log::info;
use player::audio::{CachedPlayerState, Player};
use serde::{Deserialize, Serialize};
use souvlaki::{MediaControls, PlatformConfig};

use crate::{
    data::{music_tags::MusicTags, song::SongProperties},
    events::EventHandler,
};

mod data;
mod events;
mod player;
mod utils;

pub struct PlayerState {
    library: Library,
    settings: Settings,
    player: Player,
    event_handler: EventHandler,
}

impl PlayerState {
    pub fn new() -> Self {
        env_logger::init();

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

        let init_settings = settings.clone();

        let event_handler = EventHandler::new();
        let player = Player::new(event_handler.new_sender());

        PlayerState {
            library: music_library,
            settings: init_settings,
            player,
            event_handler,
        }
    }
}
