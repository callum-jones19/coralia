use std::sync::Mutex;

use crate::{collection::Collection, song::Song};

#[derive(Debug)]
pub struct App {
    pub collection: Mutex<Collection>,
}

impl App {
    pub fn new(root_dirs: Vec<String>) -> Self {
        let collection = Collection::new_from_root_dirs(root_dirs);

        println!("{:?}", collection.get_all_albums());

        App {
            collection: Mutex::from(collection),
        }
    }

    pub fn filter_songs_by_title(&self, song_name: String) -> Vec<Song> {
        self.collection
            .lock()
            .unwrap()
            .filter_songs_by_name_ignore_case(song_name)
    }

    pub fn filter_songs_by_album(&self, album: String) -> Vec<Song> {
        self.collection
            .lock()
            .unwrap()
            .filter_songs_by_album_ignore_case(album)
    }

    pub fn get_all_songs(&self) -> Vec<Song> {
        let mut res = self.collection.lock().unwrap().get_all_songs().clone();
        res.sort_by(|a, b| a.tags.album.cmp(&b.tags.album));
        res
    }
}
