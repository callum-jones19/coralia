use std::{fs::File, path::Path};

use lofty::{
    file::TaggedFileExt,
    read_from,
    tag::{Accessor, ItemKey, Tag},
};
use serde::{Deserialize, Serialize};

/// Every tag is optional, except for the title. While this isn't strictly
/// speaking mandatory, I will assume that if a file is so poorly tagged that
/// it doesn't even have a title, there's probably not much point including
/// it in the collection at all.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MusicTags {
    pub title: String,
    pub artist: Option<String>,
    pub album_artist: Option<String>,
    pub album: Option<String>,
    pub genre: Option<String>,
    // Maybe rename \/
    pub year: Option<String>,
    pub publiser: Option<String>,
    pub composer: Option<String>,
    pub original_year: Option<String>,
    // pub lyrics: TODO
    pub cached_artwork_uri: Option<String>,
}

impl MusicTags {
    pub fn empty_with_title(song_title: String) -> Self {
        MusicTags {
            title: song_title,
            artist: None,
            album_artist: None,
            album: None,
            genre: None,
            year: None,
            publiser: None,
            composer: None,
            original_year: None,
            cached_artwork_uri: None,
        }
    }

    pub fn new_from_file(music_file: &mut File) -> Result<Self, String> {
        let tagged_file =
            read_from(music_file).expect("Could not read file as a tagged music file");

        // TODO give a match to parse the specific tags types. Gives us strong
        // control over reading
        let tags = if let Some(primary_tag) = tagged_file.primary_tag() {
            primary_tag
        } else if let Some(first_tag) = tagged_file.first_tag() {
            first_tag
        } else {
            return Err(String::from("Could find any valid tags on music file"));
        };

        // Construct the MusicTags data from the file tags
        // FIXME cleanup repeated code
        let song_title = tags.title().unwrap().to_string();
        let mut base_tags = MusicTags::empty_with_title(song_title);
        base_tags.artist = tags.artist().as_deref().map(str::to_string);
        base_tags.album_artist = tags
            .get_string(&ItemKey::AlbumArtist)
            .as_deref()
            .map(str::to_string);
        base_tags.album = tags.album().as_deref().map(str::to_string);
        base_tags.genre = tags.genre().as_deref().map(str::to_string);
        base_tags.year = tags
            .get_string(&ItemKey::ReleaseDate)
            .as_deref()
            .map(str::to_string);
        base_tags.publiser = tags
            .get_string(&ItemKey::Publisher)
            .as_deref()
            .map(str::to_string);
        base_tags.composer = tags
            .get_string(&ItemKey::Composer)
            .as_deref()
            .map(str::to_string);
        base_tags.original_year = tags
            .get_string(&ItemKey::OriginalReleaseDate)
            .as_deref()
            .map(str::to_string);

        Ok(base_tags)
    }

    // pub fn new_from_file(file_path: &Path) -> Self {

    //   todo!()
    // }
}
