use coralia_data::AppData;
use coralia_gui::start_gui;
use coralia_player::PlayerManager;

#[tokio::main]
async fn main() {
    env_logger::init();

    // Initialise the AppData
    let app_data = AppData::init();

    tokio::task::spawn(async move {
        // Initialise the backend state
        let player_state = PlayerManager::new();
    });

    start_gui();
    loop {
        // Handle clicked events
        todo!()
    }
}
