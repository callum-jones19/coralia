use coralia_data::AppData;
use coralia_gui::start_gui;
use coralia_player::PlayerManager;

#[tokio::main]
async fn main() {
    env_logger::init();

    // Initialise the AppData
    let app_data = AppData::init();

    // Initialise the backend player
    let player_state = PlayerManager::new();

    println!("{:?}", app_data);

    start_gui();
}
