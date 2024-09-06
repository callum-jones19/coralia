use std::{borrow::Borrow, fs, path::Path};

use crate::music::{
    album::{self, Album},
    song::Song,
};

fn albums_from_songs(songs: &Vec<Song>) -> Vec<Album> {
    let mut albums: Vec<Album> = Vec::new();

    for song in songs {
        // Is this song a part of any already existing albums?
        for album in &mut albums {
            let add_attempt = album.try_add_song(song);
            match add_attempt {
                Ok(_) => break,
                Err(_) => continue,
            }
        }
    }

    albums
}

#[derive(Debug)]
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

        let albums: Vec<Album> = albums_from_songs(&songs);

        Library {
            root_dir: root_dir.into(),
            songs,
            albums,
        }
    }
}
