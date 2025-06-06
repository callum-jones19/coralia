use crate::{events::EventHandler, player::Player};

mod events;
mod player;

pub struct PlayerManager {
    player: Player,
    event_handler: EventHandler,
}

impl PlayerManager {
    pub fn new() -> Self {
        let event_handler = EventHandler::new();
        let player = Player::new(event_handler.new_sender());

        PlayerManager {
            player,
            event_handler,
        }
    }
}
