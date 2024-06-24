use crate::{collection::Collection, song::Song};

pub struct App {
    collection: Collection,
}

impl App {
    pub fn new(root_dirs: Vec<String>) -> Self {
        let collection = Collection::new_from_root_dirs(root_dirs);

        App { collection }
    }

    pub fn filter_songs_by_title(&self, song_name: String) -> Vec<Song> {
        self.collection.filter_songs_by_name_ignore_case(song_name)
    }

    pub fn get_all_songs(&self) -> Vec<Song> {
      self.collection.get_all_songs()
    }
}
