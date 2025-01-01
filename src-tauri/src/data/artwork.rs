use core::panic;
use std::{
    fs::{create_dir_all, File},
    io::{self, Error},
    path::{Path, PathBuf},
};

use image::{ImageFormat, ImageReader};
use serde::{Deserialize, Serialize};

use super::{album::Album, song::Song};

struct FolderArt {
    path: PathBuf,
    image_format: ImageFormat,
}

/// Get the path of the album art that sits in the song and album folders as
/// separate image files, if it exists
fn find_folder_art(song_path: &Path) -> Option<FolderArt> {
    let art_file_names = vec![
        "folder", "Folder", "cover", "Cover", "front", "Front", "artwork", "Artwork",
    ];

    let mut song_folder_path = PathBuf::from(song_path);
    song_folder_path.pop();

    // Try each possible art file name in the list and return the first
    // found artwork
    for art_f_name in art_file_names {
        let jpg_file_name = String::from(art_f_name) + ".jpg";
        let png_file_name = String::from(art_f_name) + ".png";
        let jpg_path = Path::new(&jpg_file_name);
        let png_path = Path::new(&png_file_name);

        let mut jpg_full_path = PathBuf::from(&song_folder_path);
        jpg_full_path.push(jpg_path);

        let mut png_full_path = PathBuf::from(&song_folder_path);
        png_full_path.push(png_path);

        println!("Jpg path: {:?}", jpg_full_path.clone());
        println!("Png path: {:?}", png_full_path.clone());

        // Check if a jpg cover exists
        // FIXME exists is error prone
        if jpg_full_path.exists() {
            return Some(FolderArt {
                path: jpg_full_path.to_owned(),
                image_format: ImageFormat::Jpeg,
            });
        } else if png_full_path.exists() {
            return Some(FolderArt {
                path: png_full_path.to_owned(),
                image_format: ImageFormat::Png,
            });
        }
    }

    // No art was found in the song's folder
    None
}

fn create_art_folder_if_missing() {
    match dirs::cache_dir() {
        Some(mut cache) => {
            cache.push("kleo");
            cache.push("AlbumArtwork");
            if !cache.exists() {
                create_dir_all(cache).unwrap();
            }
        }
        None => panic!("No cache folder exists"),
    }
}

fn get_album_art_folder() -> Result<PathBuf, String> {
    create_art_folder_if_missing();

    match dirs::cache_dir() {
        Some(mut cache) => {
            cache.push("kleo");
            cache.push("AlbumArtwork");
            Ok(cache)
        }
        None => Err(String::from("Could not find system cache folder")),
    }
}

/// Represents the artwork we expect to possibly see associated with a music file
/// By default prefers folder_album_art as default, and uses embedded artwork as
/// the fallback
///
/// TODO In future, we will have the user define which artwork they would prefer
/// to use as the default
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Artwork {
    full_res_art: PathBuf,
    thumb_art: PathBuf,
    art_400: PathBuf,
}

impl Artwork {
    pub fn new(song: &Song) -> Result<Self, Error> {
        let try_folder_art = find_folder_art(&song.file_path);

        let artwork = match try_folder_art {
            Some(folder_art) => {
                let img = image::open(folder_art.path).unwrap();

                let mut cached_img_path = get_album_art_folder().unwrap();
                // FIXME unwrap
                // let cached_art_name = String::from(song.tags.album.as_ref().unwrap())
                //     + &song.tags.artist.as_ref().unwrap().
                //     + ".jpg";
                let normalised_album_name: String = song
                    .tags
                    .album
                    .as_ref()
                    .unwrap()
                    .clone()
                    .chars()
                    .filter(|c| c.is_alphabetic())
                    .collect();
                let normalised_artist_name: String = song
                    .tags
                    .artist
                    .as_ref()
                    .unwrap()
                    .clone()
                    .chars()
                    .filter(|c| c.is_alphabetic())
                    .collect();
                let cached_art_name = normalised_album_name + &normalised_artist_name + ".jpg";

                cached_img_path.push(cached_art_name);

                // Write to the cached art, if it doesn't already exist
                if !cached_img_path.exists() {
                    println!(
                        "Writing image file for song '{}' to '{:?}'",
                        &song.tags.title,
                        cached_img_path.clone()
                    );
                    let img_file_full_res = &mut File::create(cached_img_path.clone()).unwrap();
                    img.write_to(w, img.)
                    match folder_art.image_format {
                        ImageFormat::Jpeg => {
                            img.write_to(img_file_full_res, ImageFormat::Jpeg).unwrap()
                        }
                        ImageFormat::Png => {
                            img.write_to(img_file_full_res, ImageFormat::Png).unwrap();
                        }
                        _ => panic!("Folder art format not handled!"),
                    }
                }

                Artwork {
                    full_res_art: cached_img_path,
                    thumb_art: PathBuf::from("tmp"),
                    art_400: PathBuf::from("tmp"),
                }
            }
            None => {
                return Err(Error::new(
                    std::io::ErrorKind::NotFound,
                    String::from("Art file not found"),
                ))
            }
        };

        Ok(artwork)
    }
}
