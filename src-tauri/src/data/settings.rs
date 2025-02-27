use serde::{Deserialize, Serialize};
use tauri::Theme;

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

    pub fn update_theme(&mut self, new_theme: Option<Theme>) {
        self.theme = new_theme;
    }
}