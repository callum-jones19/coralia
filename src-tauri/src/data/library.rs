use core::panic;
use std::{
    fs::{self, read_dir},
    path::Path,
};

use serde::{Deserialize, Serialize};

use super::{album::Album, song::Song};

fn albums_from_songs(songs: &Vec<Song>) -> Vec<Album> {
    let mut albums: Vec<Album> = Vec::new();

    for song in songs {
        // Is this song a part of any already existing albums?
        let mut found_matching_album = false;
        for album in &mut albums {
            if album.should_contain_song(song) {
                let _ = album.try_add_song(song);
                found_matching_album = true;
            }
        }

        if !found_matching_album {
            // No existing albums for this song, so make a new one for it and add
            // it to the list
            let new_album = Album::create_from_song(song)
                .expect("Song did not have necessary album metadata to create a new album for it");
            albums.push(new_album);
        }
    }

    albums
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Library {
    pub root_dir: Box<Path>,
    pub songs: Vec<Song>,
    pub albums: Vec<Album>,
}

impl Library {
    pub fn new(root_dir: &Path) -> Self {
        let empty_songs: Vec<Song> = Vec::new();
        let empty_albums: Vec<Album> = Vec::new();
        let mut new_lib = Library {
            root_dir: root_dir.into(),
            songs: empty_songs,
            albums: empty_albums,
        };

        new_lib.scan_library_songs();
        new_lib.scan_library_albums();

        new_lib
    }

    /// Given the root directory of this library, scan it recursively for songs,
    // and then update the library's song vec to reflect this.
    pub fn scan_library_songs(&mut self) {
        // Get all paths in this directory
        let paths_try = read_dir(&self.root_dir);
        let paths = match paths_try {
            Ok(p) => p,
            Err(e) => panic!(
                "Encountered error while scanning root library directory. Error: {}",
                e
            ),
        };

        // Loop over every file in this directory
        let lib_songs = scan_songs_recursively(paths);
        self.songs = lib_songs;
    }

    pub fn scan_library_albums(&mut self) {
        let lib_albums = albums_from_songs(&self.songs);
        self.albums = lib_albums;
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
