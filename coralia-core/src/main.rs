use std::io;

use coralia_gui::start_gui;
use coralia_player::PlayerState;

#[tokio::main]
async fn main() {
    // Initialise the GUI
    tokio::task::spawn(async {
        // Initialise the backend state
        let player_state = PlayerState::new();
    });

    start_gui();
    loop {
        // Handle clicked events
        todo!()
    }
}
