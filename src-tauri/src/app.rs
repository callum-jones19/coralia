use std::sync::Mutex;

use crate::{collection::Collection, song::Song};

#[derive(Debug)]
pub struct App {
    pub collection: Mutex<Collection>,
}

impl App {
    pub fn new(root_dirs: Vec<String>) -> Self {
        let collection = Collection::new_from_root_dirs(root_dirs);

        App { collection: Mutex::from(collection) }
    }

    pub fn filter_songs_by_title(&self, song_name: String) -> Vec<Song> {
        self.collection.lock().unwrap().filter_songs_by_name_ignore_case(song_name)
    }

    pub fn get_all_songs(&self) -> Vec<Song> {
      self.collection.lock().unwrap().get_all_songs().clone()
    }

    pub fn get_queue(&self) -> Vec<Song> {
        self.collection.lock().unwrap().get_queue()
    }

    pub fn add_to_queue(&mut self, song_to_add: String) {
        self.collection.lock().unwrap().add_to_queue(song_to_add)
    }

    pub fn queue_pop(&self) -> Option<Song> {
        self.collection.lock().unwrap().queue_pop()
    }
}
