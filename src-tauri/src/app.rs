use std::sync::Mutex;

use crate::{collection::Collection, song::Song};

#[derive(Debug)]
pub struct App {
    pub collection: Collection,
}

impl App {
    pub fn new(root_dirs: Vec<String>) -> Self {
        let collection = Collection::new_from_root_dirs(root_dirs);

        App {
            collection: collection,
        }
    }
}
