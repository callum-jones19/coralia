use std::{collections::VecDeque, time::Duration};

use log::info;
use serde::Serialize;
use tauri::{AppHandle, Emitter};

use crate::data::song::Song;

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PlayEventData {
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
struct PlayerPlayPayload {
    playback_position: Duration,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PlayerPausePayload {
    playback_position: Duration,
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
    handle.emit("song-end", &new_queue.front()).unwrap();
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
    let payload = PlayEventData {
        paused: false,
        position: current_playback_pos,
    };
    handle.emit::<PlayEventData>("is-paused", payload).unwrap();
}

pub fn emit_player_pause(current_playback_pos: Duration, handle: &AppHandle) {
    info!("Player Events: sink playback started.");
    let payload = PlayEventData {
        paused: true,
        position: current_playback_pos,
    };
    handle.emit::<PlayEventData>("is-paused", payload).unwrap();
}

pub fn queue_update(
    new_queue: VecDeque<Song>,
    new_previous: Vec<Song>,
    current_playback_pos: Duration,
    handle: &AppHandle,
) {
    info!(
        "Player Events: song queue updated. {:?}",
        current_playback_pos
    );
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
