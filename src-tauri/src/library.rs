use std::path::Path;

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

pub struct Library {
    root_dir: Box<Path>,
    songs: Vec<Song>,
    albums: Vec<Album>,
}

impl Library {
    pub fn new(songs: Vec<Song>) -> Self {
        Library {
            root_dir: Path::new("foo.txt").into(),
            songs: songs.clone(),
            albums: albums_from_songs(&songs),
        }
    }
}
