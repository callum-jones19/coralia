use std::{
    fs::File,
    io::{BufWriter, Write},
};

use serde::{Deserialize, Serialize};
use tauri::Theme;

use crate::utils::program_cache_dir;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    theme: Option<Theme>,
}

impl Settings {
    /// Create a new set of user settings with the defaults
    pub fn new() -> Self {
        Settings { theme: None }
    }

    pub fn write_to_file(&self) -> Result<(), ()> {
        let mut base_dir = match program_cache_dir() {
            Some(d) => d,
            None => return Err(()),
        };

        base_dir.push("settings.json");
        println!("{:?}", base_dir);
        let settings_f = match File::create(base_dir) {
            Ok(f) => f,
            Err(_) => return Err(()),
        };

        let out_stream = BufWriter::new(settings_f);
        serde_json::to_writer(out_stream, self).unwrap();

        Ok(())
    }

    pub fn update_theme(&mut self, new_theme: Option<Theme>) {
        self.theme = new_theme;
    }
}
