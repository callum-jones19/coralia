// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    path::PathBuf,
    sync::{
        mpsc::{channel, Receiver, Sender},
        Arc, Mutex,
    },
    time::Duration,
};

use data::{
    album::Album,
    library::{ExportedLibrary, Library, SearchResults},
    settings::Settings,
    song::Song,
};
use events::{emit_player_pause, emit_player_play, emit_queue_update};
use log::info;
use player::audio::{CachedPlayerState, Player};
use serde::{Deserialize, Serialize};
use souvlaki::{MediaControls, PlatformConfig};
use tauri::{AppHandle, Emitter, Manager, State, WebviewWindow};

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
                },
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
                        },
                        player::audio::PlayingState::Paused => {
                            emit_player_pause(player.get_playback_position(), handle, &mut controls);
                        },
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
                info!("Player Command Handler: Received request to seek the current audio source to {}.", &duration.as_secs());
                match player.seek_current_song(duration) {
                    Ok(_) => println!("Seeking song"),
                    Err(_) => println!("Unable to seek current song"),
                };
            }
            PlayerCommand::RemoveAtIndex(skip_index) => {
                info!("Player Command Handler: Received request to remove song from queue at index {}.", skip_index);
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

/// An enum of possible events that we may want to send out of the player
/// thread for major events that could occur within the Player structure.
fn main() {
    env_logger::init();

    let tauri_context = tauri::generate_context!();

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
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .setup(move |app| {
            let handle = app.app_handle().to_owned();

            let window = app.get_webview_window("main").unwrap();

            info!("Starting async tokio thread to hold the audio player");
            let player_handle = handle.clone();
            tauri::async_runtime::spawn(async move {
                create_and_run_audio_player(
                    player_cmd_rx,
                    internal_cmd_tx,
                    &player_handle,
                    &window,
                );
            });

            init_settings.apply(&handle);

            Ok(())
        })
        .manage(Mutex::new(AppState {
            command_tx: player_cmd_tx,
            library: music_library,
            settings,
        }))
        .manage(Mutex::new(LibraryState {
            current_status: LibraryStatus::NotScanning,
        }))
        .invoke_handler(tauri::generate_handler![
            add_library_directories,
            add_to_queue_end,
            clear_queue_and_play,
            play,
            pause,
            set_volume,
            skip_current_song,
            get_library_songs,
            get_library_albums,
            seek_current_song,
            remove_song_from_queue,
            get_player_state,
            load_library_from_cache,
            get_library_songs_sorted,
            clear_library_and_cache,
            get_album_songs,
            get_album,
            enqueue_songs,
            clear_queue,
            search_library,
            get_songs,
            get_albums,
            get_library_state,
            add_to_queue_next,
            skip_back,
            shuffle_queue,
            get_app_settings,
            set_app_theme
        ])
        .run(tauri_context)
        .expect("Error while running tauri application!");
}

fn export_library(library: &Library, app_handle: &AppHandle) -> Result<(), tauri::Error> {
    let export_library = ExportedLibrary {
        albums: library.get_all_albums_sorted(),
        root_dirs: library.root_dirs.clone(),
        songs: library.get_all_songs_sorted().clone(),
    };

    app_handle.emit("library_update", export_library)
}

// ============================== Commands =====================================
#[tauri::command]
async fn add_library_directories(
    app_state: State<'_, Mutex<AppState>>,
    library_state: State<'_, Mutex<LibraryState>>,
    app_handle: AppHandle,
    root_dirs: Vec<PathBuf>,
) -> Result<(), tauri::Error> {
    // Begin loading sequence
    let mut state = app_state.lock().unwrap();
    {
        let mut library_state = library_state.lock().unwrap();
        library_state.current_status = LibraryStatus::Loading;
        app_handle.emit::<LibraryStatus>("library_status_change", LibraryStatus::Loading)?
    }
    state.library.add_new_folders(root_dirs);

    // Begin scanning songs
    info!("Beginning scan of selected library songs");
    {
        let mut library_state = library_state.lock().unwrap();
        library_state.current_status = LibraryStatus::ScanningSongs;
        app_handle.emit::<LibraryStatus>("library_status_change", LibraryStatus::ScanningSongs)?
    }
    state.library.scan_library_songs();

    // Begin indexing albums
    info!("Beginning indexing of scanned songs into albums");
    {
        let mut library_state = library_state.lock().unwrap();
        library_state.current_status = LibraryStatus::IndexingAlbums;
        app_handle.emit::<LibraryStatus>("library_status_change", LibraryStatus::IndexingAlbums)?
    }
    state.library.scan_library_albums();

    // Begin caching artwork
    info!("Beginning caching of album art");
    {
        let mut library_state = library_state.lock().unwrap();
        library_state.current_status = LibraryStatus::CachingArtwork;
        app_handle.emit::<LibraryStatus>("library_status_change", LibraryStatus::CachingArtwork)?
    }
    state.library.cache_library_artwork();
    state.library.save_library_to_cache();

    // Mark as completed
    info!("Completed scanning library.");
    {
        let mut library_state = library_state.lock().unwrap();
        library_state.current_status = LibraryStatus::NotScanning;
        app_handle.emit::<LibraryStatus>("library_status_change", LibraryStatus::NotScanning)?
    }

    export_library(&state.library, &app_handle)
}

#[tauri::command]
async fn clear_library_and_cache(
    state_mutex: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
) -> Result<(), tauri::Error> {
    let mut state = state_mutex.lock().unwrap();
    state.library.clear_library();
    let (tx, rx) = channel();
    state.command_tx.send(PlayerCommand::Clear(tx)).unwrap();

    rx.recv().unwrap();
    export_library(&state.library, &app_handle)
}

#[tauri::command]
async fn load_library_from_cache(state_mutex: State<'_, Mutex<AppState>>) -> Result<bool, ()> {
    let mut state = state_mutex.lock().unwrap();
    let lib = Library::get_library_from_cache();
    match lib {
        Some(saved_lib) => {
            state.library = saved_lib;
            Ok(true)
        }
        None => Ok(false),
    }
}

#[tauri::command]
async fn add_to_queue_end(state_mutex: State<'_, Mutex<AppState>>, song: Song) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::AddSongToQueueEnd(Box::new(song)))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn add_to_queue_next(state_mutex: State<'_, Mutex<AppState>>, song: Song) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::AddToQueueNext(Box::new(song)))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn skip_back(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::GoBackOne).unwrap();
    Ok(())
}

#[tauri::command]
async fn enqueue_songs(
    state_mutex: State<'_, Mutex<AppState>>,
    songs: Vec<Song>,
) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    let (tx, rx) = channel::<()>();
    state
        .command_tx
        .send(PlayerCommand::AddSongsToQueueEnd(songs, tx))
        .unwrap();

    // Sleep until the songs are added to the queue
    // This means the frontend can use .then() to actually wait for when the
    // songs have been added to the queue.
    rx.recv().unwrap();
    Ok(())
}

#[tauri::command]
async fn clear_queue_and_play(
    state_mutex: State<'_, Mutex<AppState>>,
    song: Song,
) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::EmptyAndPlay(Box::new(song)))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn clear_queue(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    let (tx, rx) = channel::<()>();
    state.command_tx.send(PlayerCommand::Clear(tx)).unwrap();

    // Wait for the queue to be cleared
    rx.recv().unwrap();
    Ok(())
}

#[tauri::command]
async fn play(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Play).unwrap();
    Ok(())
}

#[tauri::command]
async fn pause(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Pause).unwrap();
    Ok(())
}

#[tauri::command]
async fn set_volume(state_mutex: State<'_, Mutex<AppState>>, new_volume: u8) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::SetVolume(new_volume))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn skip_current_song(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::SkipOne).unwrap();
    Ok(())
}

#[tauri::command]
async fn remove_song_from_queue(
    state_mutex: State<'_, Mutex<AppState>>,
    skip_index: usize,
) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::RemoveAtIndex(skip_index))
        .unwrap();
    Ok(())
}

#[tauri::command]
async fn seek_current_song(
    state_mutex: State<'_, Mutex<AppState>>,
    seek_duration: Duration,
) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state
        .command_tx
        .send(PlayerCommand::TrySeek(seek_duration))
        .unwrap();

    Ok(())
}

#[tauri::command]
async fn shuffle_queue(state_mutex: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let state = state_mutex.lock().unwrap();
    state.command_tx.send(PlayerCommand::Shuffle).unwrap();

    Ok(())
}

// ============================= Senders =======================================
#[tauri::command]
async fn get_library_state(
    state_mutex: State<'_, Mutex<LibraryState>>,
) -> Result<LibraryStatus, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.current_status.clone())
}

#[tauri::command]
async fn get_library_songs(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_songs_unordered())
}

#[tauri::command]
async fn get_library_songs_sorted(
    state_mutex: State<'_, Mutex<AppState>>,
) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.library.get_all_songs_sorted())
}

#[tauri::command]
async fn get_album_songs(
    state_mutex: State<'_, Mutex<AppState>>,
    album_id: usize,
) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();
    let album = match state.library.albums.get(&album_id) {
        Some(album) => album,
        None => return Err(()),
    };
    let song_ids = &album.album_songs;
    let songs: Result<Vec<Song>, ()> = song_ids
        .iter()
        .map(|song_id| match state.library.songs.get(song_id) {
            Some(song) => Ok(song.clone()),
            None => Err(()),
        })
        .collect();

    match songs {
        Ok(mut songs) => {
            songs.sort_by(|a, b| a.tags.track_number.cmp(&b.tags.track_number));
            Ok(songs)
        }
        Err(_) => Err(()),
    }
}

#[tauri::command]
async fn get_album(state_mutex: State<'_, Mutex<AppState>>, album_id: usize) -> Result<Album, ()> {
    let state = state_mutex.lock().unwrap();
    match state.library.albums.get(&album_id) {
        Some(album) => Ok(album.clone()),
        None => Err(()),
    }
}

#[tauri::command]
async fn get_albums(
    state_mutex: State<'_, Mutex<AppState>>,
    album_ids: Vec<usize>,
) -> Result<Vec<Album>, ()> {
    let state = state_mutex.lock().unwrap();

    let mut found_albums = Vec::new();
    for aid in album_ids {
        let found_album = match state.library.albums.get(&aid) {
            Some(album) => album,
            None => return Err(()),
        };
        found_albums.push(found_album.clone());
    }

    Ok(found_albums)
}

#[tauri::command]
async fn get_songs(
    state_mutex: State<'_, Mutex<AppState>>,
    song_ids: Vec<usize>,
) -> Result<Vec<Song>, ()> {
    let state = state_mutex.lock().unwrap();

    let mut found_songs = Vec::new();
    for aid in song_ids {
        let found_song = match state.library.songs.get(&aid) {
            Some(song) => song,
            None => return Err(()),
        };
        found_songs.push(found_song.clone());
    }

    Ok(found_songs)
}

#[tauri::command]
async fn get_library_albums(state_mutex: State<'_, Mutex<AppState>>) -> Result<Vec<Album>, ()> {
    let state = state_mutex.lock().unwrap();
    let mut albums = state.library.get_all_albums_sorted().clone();
    albums.sort_by(|a, b| a.title.to_lowercase().cmp(&b.title.to_lowercase()));
    Ok(albums)
}

#[tauri::command]
async fn get_player_state(
    state_mutex: State<'_, Mutex<AppState>>,
) -> Result<CachedPlayerState, ()> {
    let state = state_mutex.lock().unwrap();

    let (rx, tx): (Sender<CachedPlayerState>, Receiver<CachedPlayerState>) = channel();
    let _ = state.command_tx.send(PlayerCommand::GetPlayerState(rx));

    // Sleep on the response
    let updated_state = tx.recv().unwrap();

    Ok(updated_state)
}

#[tauri::command]
async fn search_library(
    state_mutex: State<'_, Mutex<AppState>>,
    query: String,
) -> Result<SearchResults, ()> {
    let state = state_mutex.lock().unwrap();
    let search_res = state.library.search(&query);

    Ok(search_res)
}

#[tauri::command]
async fn get_app_settings(state_mutex: State<'_, Mutex<AppState>>) -> Result<Settings, ()> {
    let state = state_mutex.lock().unwrap();
    Ok(state.settings.clone())
}

#[tauri::command]
async fn set_app_theme(
    state_mutex: State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
    new_theme: Option<tauri::Theme>,
) -> Result<(), ()> {
    println!("{:?}", new_theme);
    let mut state = state_mutex.lock().unwrap();
    app_handle.set_theme(new_theme);
    state.settings.update_theme(new_theme);
    state.settings.write_to_file().unwrap();
    app_handle.set_theme(new_theme);

    Ok(())
}
