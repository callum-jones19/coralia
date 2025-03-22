use std::{collections::VecDeque, time::Duration};

use log::info;
use serde::Serialize;
use souvlaki::{MediaControls, MediaMetadata};
use tauri::{AppHandle, Emitter};

use crate::data::song::Song;

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PlayEventPayload {
    paused: bool,
    position: Duration,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct SongEndPayload {
    new_queue: VecDeque<Song>,
    new_previous: Vec<Song>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct QueueUpdatePayload {
    new_queue: VecDeque<Song>,
    new_previous: Vec<Song>,
    playback_position: Duration,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct QueueLengthChangePayload {
    new_queue_length: usize,
    new_previous_length: usize,
}

pub fn emit_song_end(new_queue: VecDeque<Song>, new_previous: Vec<Song>, handle: &AppHandle) {
    info!("Player Events: song ended.");
    handle
        .emit::<QueueLengthChangePayload>(
            "queue-length-change",
            QueueLengthChangePayload {
                new_queue_length: new_queue.len(),
                new_previous_length: new_previous.len(),
            },
        )
        .unwrap();
    handle
        .emit::<SongEndPayload>(
            "song-end",
            SongEndPayload {
                new_queue: new_queue.clone(),
                new_previous: new_previous.clone(),
            },
        )
        .unwrap();
    handle
        .emit::<QueueUpdatePayload>(
            "queue-change",
            QueueUpdatePayload {
                new_queue,
                new_previous,
                playback_position: Duration::ZERO,
            },
        )
        .unwrap();
}

pub fn emit_player_play(current_playback_pos: Duration, handle: &AppHandle) {
    info!("Player Events: sink playback started.");
    let payload = PlayEventPayload {
        paused: false,
        position: current_playback_pos,
    };
    handle
        .emit::<PlayEventPayload>("is-paused", payload)
        .unwrap();
}

pub fn emit_player_pause(current_playback_pos: Duration, handle: &AppHandle) {
    info!("Player Events: sink playback started.");
    let payload = PlayEventPayload {
        paused: true,
        position: current_playback_pos,
    };
    handle
        .emit::<PlayEventPayload>("is-paused", payload)
        .unwrap();
}

pub fn emit_queue_update(
    new_queue: VecDeque<Song>,
    new_previous: Vec<Song>,
    current_playback_pos: Duration,
    handle: &AppHandle,
    media_controls: &mut MediaControls,
) {
    info!(
        "Player Events: song queue updated. {:?}",
        current_playback_pos
    );

    match new_queue.front() {
        Some(current_song) => {
            let cover_url = current_song
                .artwork
                .as_ref()
                .unwrap()
                .art_400
                .clone()
                .into_os_string()
                .into_string()
                .unwrap();
            println!("Cover url: {:?}", cover_url);

            media_controls
                .set_metadata(MediaMetadata {
                    album: current_song.tags.album.as_deref(),
                    title: Some(&current_song.tags.title),
                    artist: current_song.tags.artist.as_deref(),
                    duration: Some(current_song.properties.get_duration().clone()),
                    cover_url: Some((String::from("file://") + &cover_url).as_str()),
                    ..Default::default()
                })
                .unwrap();
        }
        None => {}
    }

    handle
        .emit::<QueueLengthChangePayload>(
            "queue-length-change",
            QueueLengthChangePayload {
                new_queue_length: new_queue.len(),
                new_previous_length: new_previous.len(),
            },
        )
        .unwrap();

    // We want to send both the queue, but also the playback info
    // of the current song.
    handle
        .emit::<QueueUpdatePayload>(
            "queue-change",
            QueueUpdatePayload {
                new_queue,
                new_previous,
                playback_position: current_playback_pos,
            },
        )
        .unwrap();
}
