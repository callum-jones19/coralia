// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


mod app;
mod collection;

fn main() {
    // let app = App::new(vec![String::from("C:/Users/Callum/Music/")]);
}
