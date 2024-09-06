// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use music::music_tags::MusicTags;

mod music;
mod library;

fn main() {
}
