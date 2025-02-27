use std::{fs::File, io::{self, BufReader, BufWriter}, path::Path};

use serde::{Deserialize, Serialize};
use tauri::Theme;

use crate::utils::program_cache_dir;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    theme: Option<Theme>
}

impl Settings {
    /// Create a new set of user settings with the defaults
    pub fn new() -> Self {
        Settings {
            theme: Some(Theme::Dark)
        }
    }

    pub fn from_file() -> Result<Self, ()> {
        let base_program_dir = program_cache_dir().unwrap();
        let mut settings_path = base_program_dir.clone();
        settings_path.push("settings.json");

        let settings_f = File::open(settings_path);

        match settings_f {
            Ok(f) => {
                let reader = BufReader::new(f);
                let saved_settings: Settings = serde_json::from_reader(reader).unwrap();
                Ok(saved_settings)
            },
            Err(_) => Err(()),
        }
    }

    pub fn write_to_file(&self) -> Result<(), io::Error> {
        let mut settings_path = program_cache_dir().unwrap();
        settings_path.push("settings.json");
        let settings_f = File::create(settings_path);
        match settings_f {
            Ok(settings_f) => {
                let out_stream = BufWriter::new(settings_f);
                serde_json::to_writer(out_stream, self).unwrap();
                Ok(())
            },
            Err(e) => Err(e),
        }
    }

    pub fn update_theme(&mut self, new_theme: Option<Theme>) {
        self.theme = new_theme;
    }
}