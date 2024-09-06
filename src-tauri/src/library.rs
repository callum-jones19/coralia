use std::{borrow::Borrow, fs, path::Path};

use serde::{Deserialize, Serialize};

use crate::music::{
    album::{self, Album},
    song::Song,
};

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
            let new_album = Album::create_from_song(song).expect("Song did not have necessary album metadata to create a new album for it");
            albums.push(new_album);
        }
    }

    albums
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Library {
    root_dir: Box<Path>,
    songs: Vec<Song>,
    albums: Vec<Album>,
}

impl Library {
    pub fn new(root_dir: &Path) -> Self {
        let mut songs: Vec<Song> = Vec::new();

        let paths = fs::read_dir(root_dir).unwrap();

        for path in paths {
            let try_song = Song::new_from_file(&path.unwrap().path());

            let new_song = match try_song {
                Ok(song) => song,
                Err(_) => continue,
            };

            songs.push(new_song);
        }

        // FIXME
        let albums: Vec<Album> = albums_from_songs(&songs);

        Library {
            root_dir: root_dir.into(),
            songs,
            albums,
        }
    }
}
