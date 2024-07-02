use std::collections::HashSet;

use serde::{Deserialize, Serialize};

use crate::{album::Album, data::get_file_paths_in_dir, song::Song};

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    scanned_songs: Vec<Song>,
    collection_folders: Vec<String>,
}

impl Collection {
    pub fn new_from_root_dirs(root_dirs: Vec<String>) -> Self {
        let mut all_songs: Vec<Song> = vec![];

        for root_dir in &root_dirs {
            let files = get_file_paths_in_dir(&root_dir);
            for file_path in files {
                let song_res = Song::from_file(file_path);
                if let Ok(song) = song_res {
                    all_songs.push(song);
                }
            }
        }

        Collection {
            scanned_songs: all_songs,
            collection_folders: root_dirs,
        }
    }

    pub fn filter_songs_by_name_ignore_case(&self, song_name: String) -> Vec<Song> {
        let filtered_songs: &Vec<Song> = &self
            .scanned_songs
            .iter()
            .filter(|f| {
                f.tags
                    .title
                    .to_lowercase()
                    .contains(&song_name.to_lowercase())
            })
            .cloned()
            .collect();

        filtered_songs.to_owned()
    }

    pub fn filter_songs_by_album_ignore_case(&self, song_name: String) -> Vec<Song> {
        let filtered_songs: &Vec<Song> = &self
            .scanned_songs
            .iter()
            .filter(|f| f.tags.album == song_name)
            .cloned()
            .collect();

        filtered_songs.to_owned()
    }

    // TODO cache this in RAM
    pub fn get_all_albums(&self) -> Vec<Album> {
        // FIXME this won't work if two albums exist with the same name but
        // different artists
        let mut res: Vec<Album> = vec![];
        let mut seen_album_names: HashSet<String> = HashSet::new();
        for song in &self.scanned_songs {
            if !seen_album_names.contains(&song.tags.album) {
                seen_album_names.insert(song.tags.album.clone());
                let new_album = Album::new(song.tags.album.clone(), song.tags.cached_artwork_uri.clone().unwrap(), song.tags.album_artist.clone());
                res.push(new_album);
            }
        }

        // Sort alphabetically because why not
        res.sort_by(|a, b| a.title.cmp(&b.title));

        res
    }

    pub fn get_all_songs(&self) -> &Vec<Song> {
        &self.scanned_songs
    }
}
