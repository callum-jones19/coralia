use core::panic;
use std::{
    collections::HashMap,
    fs::{self, read_dir, File},
    io::{BufReader, BufWriter},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

use crate::utils::program_cache_dir;

use super::{album::Album, artwork::Artwork, song::Song};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResults {
    pub albums: Vec<Album>,
    pub songs: Vec<Song>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExportedLibrary {
    pub root_dirs: Vec<PathBuf>,
    pub songs: Vec<Song>,
    pub albums: Vec<Album>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Library {
    pub root_dirs: Vec<PathBuf>,
    pub songs: HashMap<usize, Song>,
    pub albums: HashMap<usize, Album>,
}

impl Library {
    pub fn new_empty() -> Self {
        let empty_songs = HashMap::new();
        let empty_albums = HashMap::new();
        Library {
            root_dirs: Vec::new(),
            songs: empty_songs,
            albums: empty_albums,
        }
    }

    pub fn get_library_from_cache() -> Option<Self> {
        let mut library_cached_path = program_cache_dir().unwrap();
        library_cached_path.push("cached_library");
        let tmp = File::open(library_cached_path);
        match tmp {
            Ok(lib_file) => {
                let reader = BufReader::new(lib_file);
                let cached_lib = serde_json::from_reader(reader).unwrap();
                Some(cached_lib)
            }
            Err(_) => None,
        }
    }

    fn wipe_cache(&self) -> Result<(), String> {
        let base_program_dir = program_cache_dir().unwrap();
        let mut library_cache_path = base_program_dir.clone();
        library_cache_path.push("cached_library");
        let remove_cache_res = fs::remove_file(library_cache_path);
        if let Err(e) = remove_cache_res {
            return Err(e.to_string());
        }

        let mut art_cache = base_program_dir;
        art_cache.push("AlbumArtwork");
        let remove_art_res = fs::remove_dir_all(art_cache);
        if let Err(e) = remove_art_res {
            return Err(e.to_string());
        }

        Ok(())
    }

    /// Clear the library of all data, and wipe all data cached to the disk
    pub fn clear_library(&mut self) {
        self.root_dirs.clear();
        self.songs.clear();
        self.albums.clear();
        self.wipe_cache().unwrap();
    }

    pub fn add_new_folders(&mut self, mut folders: Vec<PathBuf>) {
        self.root_dirs.append(&mut folders);
    }

    /// Given the root directory of this library, scan it recursively for songs,
    // and then update the library to reflect this.
    pub fn scan_library_songs(&mut self, app_handle: &AppHandle) {
        let mut all_lib_songs: Vec<Song> = Vec::new();

        for d in &self.root_dirs {
            // Get all paths in this directory
            let paths_try = read_dir(d);
            let paths = match paths_try {
                Ok(p) => p,
                Err(e) => panic!(
                    "Encountered error while scanning root library directory. Error: {}",
                    e
                ),
            };

            // Loop over every file in this directory
            let mut dir_songs = scan_songs_recursively(paths, &app_handle);
            all_lib_songs.append(&mut dir_songs);
        }

        let mut res = HashMap::new();
        for song in all_lib_songs {
            res.insert(song.id, song);
        }
        self.songs = res;
    }

    pub fn scan_library_albums(&mut self, app_handle: &AppHandle) {
        let mut albums: HashMap<usize, Album> = HashMap::new();

        for song in self.songs.values_mut() {
            // Is this song a part of any already existing albums?
            let mut found_matching_album = false;
            for album in albums.values_mut() {
                if album.should_contain_song(song) {
                    album.add_song(song);
                    found_matching_album = true;
                }
            }

            if !found_matching_album {
                // No existing albums for this song, so make a new one for it and add
                // it to the list
                let new_album = Album::create_from_song(song).expect(
                    "Song did not have necessary album metadata to create a new album for it",
                );
                albums.insert(new_album.id, new_album);
            }
        }

        for album in albums.values_mut() {
            let artwork = match album.album_songs.first() {
                Some(first_song_id) => {
                    let song = self.songs.get(first_song_id).unwrap();
                    Artwork::new(song)
                }
                None => panic!("No songs in album {}", album.title),
            };

            album.artwork = artwork.clone();

            if let Some(a) = artwork {
                for album_song_id in &album.album_songs {
                    let s = self.songs.get_mut(album_song_id).unwrap();
                    s.artwork = Some(a.clone());
                }
            }
        }

        self.albums = albums;
    }

    pub fn save_library_to_cache(&self) {
        println!("Saving library to cache");
        let mut library_cached_path = program_cache_dir().unwrap();
        library_cached_path.push("cached_library");
        let cached_lib_f = File::create(library_cached_path).unwrap();
        let out_stream = BufWriter::new(cached_lib_f);
        serde_json::to_writer(out_stream, self).unwrap();
    }

    pub fn get_all_songs_unordered(&self) -> Vec<Song> {
        self.songs.clone().into_values().collect()
    }

    pub fn get_all_songs_sorted(&self) -> Vec<Song> {
        let mut ordered_songs: Vec<Song> = self.songs.clone().into_values().collect();
        ordered_songs.sort_by(|a, b| match a.tags.album.cmp(&b.tags.album) {
            std::cmp::Ordering::Less => std::cmp::Ordering::Less,
            std::cmp::Ordering::Equal => a.tags.track_number.cmp(&b.tags.track_number),
            std::cmp::Ordering::Greater => std::cmp::Ordering::Greater,
        });
        ordered_songs
    }

    pub fn get_all_albums_sorted(&self) -> Vec<Album> {
        let mut ordered_albums: Vec<Album> = self.albums.clone().into_values().collect();
        ordered_albums.sort_by(|a, b| a.title.cmp(&b.title));
        ordered_albums
    }

    pub fn search(&self, search_str: &String) -> SearchResults {
        let albums: Vec<Album> = self
            .albums
            .iter()
            .filter(|(_, album)| {
                let title_match = album
                    .title
                    .to_lowercase()
                    .contains(&search_str.to_lowercase());

                let artist_match = album
                    .album_artist
                    .to_lowercase()
                    .contains(&search_str.to_lowercase());

                title_match || artist_match
            })
            .map(|(_, album)| album.clone())
            .collect();

        let songs: Vec<Song> = self
            .songs
            .iter()
            .filter(|(_, song)| {
                let title_match = song
                    .tags
                    .title
                    .to_lowercase()
                    .contains(&search_str.to_lowercase());

                let artist_match = match &song.tags.artist {
                    Some(artist) => artist.to_lowercase().contains(&search_str.to_lowercase()),
                    None => false,
                };

                let album_match = match &song.tags.album {
                    Some(album) => album.to_lowercase().contains(&search_str.to_lowercase()),
                    None => todo!(),
                };

                title_match || artist_match || album_match
            })
            .map(|(_, song)| song.clone())
            .collect();

        SearchResults { albums, songs }
    }
}

#[derive(Serialize, Clone)]
pub struct ScanSongEvent {
    song_title: String,
}

fn scan_songs_recursively(paths: fs::ReadDir, app_handle: &AppHandle) -> Vec<Song> {
    let mut folder_songs: Vec<Song> = Vec::new();

    for path in paths {
        let direntry = match path {
            Ok(d) => d,
            Err(e) => panic!("Encountered error while scanning DirEntry. Error {}", e),
        };

        // If it is a file, and a music file, add it to our scanned songs list
        // Otherwise, recursively scan the next folder
        if direntry.file_type().unwrap().is_dir() {
            // Recurse
            let recurse_paths = match read_dir(direntry.path()) {
                Ok(p) => p,
                Err(_) => todo!(),
            };
            let mut sub_songs = scan_songs_recursively(recurse_paths, &app_handle);
            folder_songs.append(&mut sub_songs);
        } else {
            // Try to add to library
            let try_song = Song::new_from_file(&direntry.path());
            let new_song = match try_song {
                Ok(s) => s,
                Err(_) => continue,
            };
            let payload = ScanSongEvent {
                song_title: new_song.clone().tags.title,
            };
            app_handle.emit_all("scan_new_song_to_lib", payload);
            folder_songs.push(new_song);
        }
    }

    folder_songs
}
