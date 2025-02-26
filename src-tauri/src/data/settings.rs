use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
enum Theme {
    Light,
    Dark,
    System,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    theme: Theme
}

impl Settings {
    /// Create a new set of user settings with the defaults
    pub fn new() -> Self {
        Settings {
            theme: Theme::System
        }
    }
}