use std::{
    collections::VecDeque,
    sync::mpsc::{Receiver, Sender},
    time::Duration,
};

use log::info;
use serde::Serialize;
use souvlaki::{MediaControls, MediaMetadata, MediaPosition};

use crate::data::song::Song;

struct EventHandler {
    event_tx: Sender<()>,
    event_rx: Receiver<()>,
}

impl EventHandler {
    pub fn emit_song_end(&self, new_queue: VecDeque<Song>, new_previous: Vec<Song>) {
        info!("Player Events: song ended.");
    }

    pub fn emit_player_play(
        &self,
        current_playback_pos: Duration,
        media_controls: &mut MediaControls,
    ) {
        info!("Player Events: sink playback started.");

        media_controls
            .set_playback(souvlaki::MediaPlayback::Playing {
                progress: Some(MediaPosition(current_playback_pos)),
            })
            .unwrap();
    }

    pub fn emit_player_pause(
        &self,
        current_playback_pos: Duration,
        media_controls: &mut MediaControls,
    ) {
        info!("Player Events: sink playback started.");

        media_controls
            .set_playback(souvlaki::MediaPlayback::Paused {
                progress: Some(MediaPosition(current_playback_pos)),
            })
            .unwrap();
    }

    pub fn emit_queue_update(
        &self,
        new_queue: VecDeque<Song>,
        new_previous: Vec<Song>,
        current_playback_pos: Duration,
        media_controls: &mut MediaControls,
    ) {
        info!(
            "Player Events: song queue updated. {:?}",
            current_playback_pos
        );

        if let Some(current_song) = new_queue.front() {
            let cover_url_opt = current_song.artwork.as_ref();

            let cover_url = match cover_url_opt {
                Some(art) => {
                    let t = String::from("file://")
                        + &art.art_400.clone().into_os_string().into_string().unwrap();
                    Some(t)
                }
                None => None,
            };

            media_controls
                .set_metadata(MediaMetadata {
                    album: current_song.tags.album.as_deref(),
                    title: Some(&current_song.tags.title),
                    artist: current_song.tags.artist.as_deref(),
                    duration: Some(*current_song.properties.get_duration()),
                    cover_url: cover_url.as_deref(),
                })
                .unwrap();
        }
    }
}
