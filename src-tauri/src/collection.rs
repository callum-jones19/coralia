use serde::{Deserialize, Serialize};

use crate::{
    data::get_file_paths_in_dir,
    song::{self, MusicTags, Song},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct SongFolder {
    pub root_dir: String,
    pub songs: Vec<Song>,
}

impl SongFolder {
    pub fn new(root_dir: String) -> Self {
        let tagged_songs: Vec<Song> = get_file_paths_in_dir(&root_dir)
            .iter()
            .map(|file_path| (MusicTags::read_from_file(file_path), file_path))
            .filter(|tags_and_path| tags_and_path.0.is_ok())
            .map(|tags_and_path| Song::new(tags_and_path.1.to_owned(), tags_and_path.0.unwrap()))
            .collect();

        SongFolder {
            root_dir,
            songs: tagged_songs,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    song_folders: Vec<SongFolder>,
}

impl Collection {
    pub fn new_from_root_dirs(root_dirs: Vec<String>) -> Self {
        let song_folders: Vec<SongFolder> = root_dirs
            .into_iter()
            .map(|root_dir| SongFolder::new(root_dir))
            .collect();

        Collection { song_folders }
    }

    pub fn filter_songs_by_name_ignore_case(&self, song_name: String) -> Vec<Song> {
        let mut collected_songs: Vec<Song> = vec![];

        for song_folder in &self.song_folders {
            let mut filtered_songs: Vec<Song> = song_folder
                .songs
                .clone()
                .into_iter()
                .filter(|f| {
                    f.tags
                        .title
                        .to_lowercase()
                        .contains(&song_name.to_lowercase())
                })
                .collect();
            collected_songs.append(&mut filtered_songs);
        }

        collected_songs
    }

    pub fn filter_songs_by_album_ignore_case(&self, song_name: String) -> Vec<Song> {
        let mut collected_songs: Vec<Song> = vec![];

        for song_folder in &self.song_folders {
            let mut filtered_songs: Vec<Song> = song_folder
                .songs
                .clone()
                .into_iter()
                .filter(|f| f.tags.album == song_name)
                .collect();
            collected_songs.append(&mut filtered_songs);
        }

        collected_songs
    }

    pub fn get_all_songs(&self) -> Vec<Song> {
        let mut collected_songs: Vec<Song> = vec![];

        for song_folder in &self.song_folders {
            let mut songs: Vec<Song> = song_folder.songs.clone();
            collected_songs.append(&mut songs);
        }

        collected_songs
    }
}
