// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    path::{Path, PathBuf},
    sync::{
        Arc, Mutex,
        mpsc::{Receiver, Sender, channel},
    },
    thread,
    time::Duration,
};

use data::{
    album::Album,
    library::{ExportedLibrary, Library, SearchResults},
    settings::Settings,
    song::Song,
};
use log::info;
use player::audio::{CachedPlayerState, Player};
use serde::{Deserialize, Serialize};
use souvlaki::{MediaControls, PlatformConfig};

use crate::data::{music_tags::MusicTags, song::SongProperties};

mod data;
mod events;
mod player;
mod utils;

enum PlayerCommand {
    EmptyAndPlay(Box<Song>),
    AddSongToQueueEnd(Box<Song>),
    AddSongsToQueueEnd(Vec<Song>, Sender<()>),
    AddToQueueNext(Box<Song>),
    Play,
    Pause,
    Toggle,
    SetVolume(u8),
    SkipOne,
    GoBackOne,
    RemoveAtIndex(usize),
    TrySeek(Duration),
    GetPlayerState(Sender<CachedPlayerState>),
    Clear(Sender<()>),
    Shuffle,
}

struct AppState {
    command_tx: Sender<PlayerCommand>,
    library: Library,
    settings: Settings,
}

#[derive(Clone, Serialize, Deserialize)]
enum LibraryStatus {
    Loading,
    ScanningSongs,
    IndexingAlbums,
    CachingArtwork,
    NotScanning,
}

#[derive(Clone, Serialize, Deserialize)]
struct LibraryState {
    current_status: LibraryStatus,
}

/*
fn create_and_run_audio_player(
    player_cmd_rx: Receiver<PlayerCommand>,
    player_cmd_tx: Sender<PlayerCommand>,
    handle: &AppHandle,
    window: &WebviewWindow,
) {
    #[cfg(not(target_os = "windows"))]
    let hwnd = None;

    #[cfg(target_os = "windows")]
    let hwnd = {
        // FIXME should this use tauri functions?
        let handle = window.hwnd().unwrap().0;
        Some(handle)
    };

    let config = PlatformConfig {
        dbus_name: "coralia",
        display_name: "coralia",
        hwnd,
    };

    let mut controls = MediaControls::new(config).unwrap();
    controls
        .attach(move |event| {
            // Deal with a media control event being fired
            println!("{:?}", &event);
            match event {
                souvlaki::MediaControlEvent::Play => {
                    player_cmd_tx.send(PlayerCommand::Play).unwrap()
                }
                souvlaki::MediaControlEvent::Pause => {
                    player_cmd_tx.send(PlayerCommand::Pause).unwrap()
                }
                souvlaki::MediaControlEvent::Toggle => {
                    player_cmd_tx.send(PlayerCommand::Toggle).unwrap()
                }
                souvlaki::MediaControlEvent::Next => {
                    player_cmd_tx.send(PlayerCommand::SkipOne).unwrap()
                }
                souvlaki::MediaControlEvent::Previous => {
                    player_cmd_tx.send(PlayerCommand::GoBackOne).unwrap();
                }
                _ => {}
            }
        })
        .unwrap();

    let controls = Arc::new(Mutex::new(controls));

    let player_media_controls = Arc::clone(&controls);
    let mut player = Player::new(handle.clone(), player_media_controls);

    loop {
        let command = player_cmd_rx.recv().unwrap();
        match command {
            PlayerCommand::AddSongToQueueEnd(song) => {
                info!(
                    "Player Command Handler: Received request to enqueue song {} into the player.",
                    &song.tags.title
                );
                player.add_to_queue_end(&song).unwrap();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }
            }
            PlayerCommand::Play => {
                info!("Player Command Handler: Received request to set sink to play.");
                player.play();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_player_play(player.get_playback_position(), handle, &mut controls);
                }
            }
            PlayerCommand::Pause => {
                info!("Player Command Handler: Received request to set sink to pause.");
                player.pause();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_player_pause(player.get_playback_position(), handle, &mut controls);
                }
            }
            PlayerCommand::Toggle => {
                info!("Received request to toggle playing song state");
                let new_playing_state = player.toggle_playing();
                {
                    let mut controls = controls.lock().unwrap();
                    match new_playing_state {
                        player::audio::PlayingState::Playing => {
                            emit_player_play(player.get_playback_position(), handle, &mut controls);
                        }
                        player::audio::PlayingState::Paused => {
                            emit_player_pause(
                                player.get_playback_position(),
                                handle,
                                &mut controls,
                            );
                        }
                    };
                }
            }
            PlayerCommand::SetVolume(vol) => {
                let clamped_vol = if vol > 100 { 100 } else { vol };
                let parsed_vol = f32::from(clamped_vol) / 100.0;
                info!(
                    "Player Command Handler: Received request to set change sink volume to {}.",
                    parsed_vol
                );
                player.change_vol(parsed_vol);
            }
            PlayerCommand::SkipOne => {
                info!("Player Command Handler: Received request to skip current song");
                player.skip_current_song();
                player.play();
                // Leave this out of here for now - this will get emitted when
                // the song ends in the actual sink.
                // TODO think about the race condition this represents. I simply
                // don't have the energy to fundametnally fix it right now because
                // I think it is quite substantial, but essentially I think because
                // the queue is not being updated directly in that skip function
                // but instead when the song comes out of the sink, sometimes
                // the get_queue func will return an out-of-sync set of data.

                // emit_queue_update(
                //     player.get_queue(),
                //     player.get_previous(),
                //     player.get_playback_position(),
                //     handle,
                // );
            }
            PlayerCommand::EmptyAndPlay(song) => {
                info!(
                    "Player Command Handler: Received request to empty sink and play song {}.",
                    &song.tags.title
                );
                player.clear();
                if player.add_to_queue_end(&song).is_ok() {
                    player.play();
                    {
                        let mut controls = controls.lock().unwrap();
                        emit_queue_update(
                            player.get_queue(),
                            player.get_previous(),
                            player.get_playback_position(),
                            handle,
                            &mut controls,
                        );
                    }
                    {
                        let mut controls = controls.lock().unwrap();
                        emit_player_play(player.get_playback_position(), handle, &mut controls);
                    }
                }
            }
            PlayerCommand::TrySeek(duration) => {
                info!(
                    "Player Command Handler: Received request to seek the current audio source to {}.",
                    &duration.as_secs()
                );
                match player.seek_current_song(duration) {
                    Ok(_) => println!("Seeking song"),
                    Err(_) => println!("Unable to seek current song"),
                };
            }
            PlayerCommand::RemoveAtIndex(skip_index) => {
                info!(
                    "Player Command Handler: Received request to remove song from queue at index {}.",
                    skip_index
                );
                match player.remove_song_from_queue(skip_index) {
                    Some(_) => {
                        let mut controls = controls.lock().unwrap();
                        emit_queue_update(
                            player.get_queue(),
                            player.get_previous(),
                            player.get_playback_position(),
                            handle,
                            &mut controls,
                        );
                    }
                    None => todo!(),
                }
            }
            PlayerCommand::GetPlayerState(state_rx) => {
                info!("Player Command Handler: Received request to export the player state.");
                let cached_state = player.get_current_state();
                state_rx.send(cached_state).unwrap();
            }
            PlayerCommand::Clear(tx) => {
                info!("Player Command Handler: Received request to clear the player queue.");
                player.clear();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }

                // Signal that the queue has been cleared
                tx.send(()).unwrap();
            }
            PlayerCommand::AddToQueueNext(song) => {
                info!(
                    "Player Command Handler: Received request to enqueue song {} into the player.",
                    &song.tags.title
                );
                player.add_to_queue_next(&song);
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }
            }
            PlayerCommand::GoBackOne => {
                player.go_back();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }
            }
            PlayerCommand::Shuffle => {
                player.toggle_queue_shuffle();
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }
            }
            PlayerCommand::AddSongsToQueueEnd(songs, tx) => {
                info!("Received request to queue up list of songs");
                for song in songs {
                    player.add_to_queue_end(&song).unwrap();
                }
                {
                    let mut controls = controls.lock().unwrap();
                    emit_queue_update(
                        player.get_queue(),
                        player.get_previous(),
                        player.get_playback_position(),
                        handle,
                        &mut controls,
                    );
                }
                tx.send(()).unwrap();
            }
        }
    }
}
*/

pub fn start_player() {
    env_logger::init();

    // Initialise an empty music library, and setup the player command and the
    // the player events system.
    let music_library = Library::new_empty();

    // Read the settings
    let settings = match Settings::from_file() {
        Ok(f) => {
            info!("Read in existing settings from settings file");
            info!("{:?}", &f);
            f
        }
        Err(_) => {
            // TODO use specific error
            Settings::new()
        }
    };

    let (player_cmd_tx, player_cmd_rx) = channel::<PlayerCommand>();
    let internal_cmd_tx = player_cmd_tx.clone();

    let init_settings = settings.clone();

    let mut player = Player::new();
}
