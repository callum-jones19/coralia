use core::panic;
use std::{
    collections::HashMap,
    fs::{self, read_dir},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

use super::{album::Album, artwork::Artwork, song::Song};

#[derive(Debug, Serialize, Deserialize)]
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

    pub fn add_new_folders(&mut self, mut folders: Vec<PathBuf>) {
        self.root_dirs.append(&mut folders);
    }

    /// Given the root directory of this library, scan it recursively for songs,
    // and then update the library to reflect this.
    pub fn scan_library_songs(&mut self) {
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
            let mut dir_songs = scan_songs_recursively(paths);
            all_lib_songs.append(&mut dir_songs);
        }

        let mut res = HashMap::new();
        for song in all_lib_songs {
            res.insert(song.id, song);
        }
        self.songs = res;
    }

    pub fn scan_library_albums(&mut self) {
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

            match artwork {
                Some(a) => {
                    for album_song_id in &album.album_songs {
                        let s = self.songs.get_mut(&album_song_id).unwrap();
                        s.artwork = Some(a.clone());
                    }
                }
                None => {}
            }
        }

        self.albums = albums;
    }

    pub fn get_all_songs_unordered(&self) -> Vec<Song> {
        self.songs.clone().into_values().collect()
    }

    pub fn get_all_albums(&self) -> Vec<Album> {
        self.albums.clone().into_values().collect()
    }
}

fn scan_songs_recursively(paths: fs::ReadDir) -> Vec<Song> {
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
            let mut sub_songs = scan_songs_recursively(recurse_paths);
            folder_songs.append(&mut sub_songs);
        } else {
            // Try to add to library
            let try_song = Song::new_from_file(&direntry.path());
            let new_song = match try_song {
                Ok(s) => s,
                Err(_) => continue,
            };
            folder_songs.push(new_song);
        }
    }

    folder_songs
}
