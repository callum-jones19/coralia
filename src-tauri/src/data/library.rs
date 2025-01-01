use core::panic;
use std::{
    fs::{self, read_dir},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

use super::{album::Album, artwork::Artwork, song::Song};

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

    for album in &mut albums {
        let artwork = match album.album_songs.first() {
            Some(first_song) => Artwork::new(first_song).unwrap(),
            None => panic!("No songs in album {}", album.title),
        };

        for song in &mut album.album_songs {
            song.artwork = Some(artwork.clone());
        }
    }

    albums
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Library {
    pub root_dirs: Vec<PathBuf>,
    songs: Vec<Song>,
    pub albums: Vec<Album>,
}

impl Library {
    pub fn new_empty() -> Self {
        let empty_songs: Vec<Song> = Vec::new();
        let empty_albums: Vec<Album> = Vec::new();
        let new_lib = Library {
            root_dirs: Vec::new(),
            songs: empty_songs,
            albums: empty_albums,
        };

        new_lib
    }

    // pub fn new(root_dir: &Path) -> Self {
    //     let empty_songs: Vec<Song> = Vec::new();
    //     let empty_albums: Vec<Album> = Vec::new();
    //     let mut new_lib = Library {
    //         root_dirs: vec![root_dir.into()],
    //         songs: empty_songs,
    //         albums: empty_albums,
    //     };

    //     new_lib.scan_library_songs();
    //     new_lib.scan_library_albums();

    //     new_lib
    // }

    // pub fn add_new_folder(&mut self, folder_dir: PathBuf) {
    //     self.root_dirs.push(folder_dir);
    // }

    pub fn add_new_folders(&mut self, mut folders: Vec<PathBuf>) {
        self.root_dirs.append(&mut folders);
    }

    /// Given the root directory of this library, scan it recursively for songs,
    // and then update the library's song vec to reflect this.
    pub fn scan_library_songs(&mut self) {
        let mut all_lib_songs = Vec::new();

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

        self.songs = all_lib_songs;
    }

    pub fn scan_library_albums(&mut self) {
        let lib_albums = albums_from_songs(&self.songs);
        self.albums = lib_albums;
    }

    pub fn get_all_songs(&self) -> Vec<Song> {
        self.songs.clone()
    }

    pub fn get_all_albums(&self) -> Vec<Album> {
        self.albums.clone()
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
