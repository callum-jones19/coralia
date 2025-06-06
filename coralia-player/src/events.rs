use std::{
    collections::VecDeque,
    sync::mpsc::{Receiver, Sender, channel},
    time::Duration,
};

use log::info;
use serde::Serialize;
use souvlaki::{MediaControls, MediaMetadata, MediaPosition};

use crate::data::song::Song;

pub enum CoraliaEvent {
    PlayerPlay,
    PlayerPause,
    SongEnd,
    QueueUpdate,
}

pub struct EventHandler {
    event_tx: Sender<CoraliaEvent>,
    event_rx: Receiver<CoraliaEvent>,
}

impl EventHandler {
    pub fn new() -> Self {
        let (tx, rx) = channel::<CoraliaEvent>();
        EventHandler {
            event_rx: rx,
            event_tx: tx,
        }
    }

    pub fn new_sender(&self) -> Sender<CoraliaEvent> {
        self.event_tx.clone()
    }

    pub fn await_event(&self) -> CoraliaEvent {
        let event = self.event_rx.recv().unwrap();
        match event {
            CoraliaEvent::PlayerPlay => self.handle_player_play(),
            CoraliaEvent::PlayerPause => self.handle_player_pause(),
            CoraliaEvent::SongEnd => self.handle_song_end(),
            CoraliaEvent::QueueUpdate => self.handle_queue_update(),
        };

        event
    }

    fn handle_player_play(&self) {
        println!("Player play");
    }

    fn handle_player_pause(&self) {
        println!("Player pause");
    }

    fn handle_song_end(&self) {
        println!("Song end");
    }

    fn handle_queue_update(&self) {
        println!("Queue update");
    }
}
