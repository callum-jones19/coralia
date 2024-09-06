// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use music::music_tags::MusicTags;

mod music;

fn main() {
    let tmp = MusicTags::new_empty_tags(String::from("song_title+tmp"))
        .set_album_artist(String::from("Test"))
        .set_artist(String::from("Test2"));

}
