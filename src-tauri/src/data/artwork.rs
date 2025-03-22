use core::panic;
use std::{
    fs::{self, create_dir_all, File},
    io::BufWriter,
    path::{Path, PathBuf},
};

use fast_image_resize::{images::Image, IntoImageView, ResizeAlg, ResizeOptions, Resizer};
use image::{
    codecs::{jpeg::JpegEncoder, png::PngEncoder},
    ImageEncoder, ImageFormat, ImageReader,
};
use serde::{Deserialize, Serialize};

use super::song::Song;

/// Get the path of the album art that sits in the song and album folders as
/// separate image files, if it exists
fn find_folder_art(song_path: &Path) -> Option<PathBuf> {
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

        // Check if a jpg cover exists
        // FIXME exists is error prone
        if jpg_full_path.exists() {
            return Some(jpg_full_path.to_owned());
        } else if png_full_path.exists() {
            return Some(png_full_path.to_owned());
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
    pub full_res_art: PathBuf,
    pub thumb_art: PathBuf,
    pub art_400: PathBuf,
}

impl Artwork {
    pub fn new(song: &Song) -> Option<Self> {
        println!("============================================");
        println!(
            "Generating album art for {}",
            song.tags.album.as_ref().unwrap()
        );
        let try_folder_art = find_folder_art(&song.file_path);

        let artwork = match try_folder_art {
            Some(folder_art) => {
                let mut img = ImageReader::open(&folder_art).unwrap();
                let img_format = img.format().unwrap();

                let image_cache_path = get_album_art_folder().unwrap();
                let cached_art_name =
                    song.id.to_string() + "." + folder_art.extension().unwrap().to_str().unwrap();

                let mut thumnail_cached_path = image_cache_path.clone();
                thumnail_cached_path.push("thumnails");
                create_dir_all(&thumnail_cached_path).unwrap();
                thumnail_cached_path.push(&cached_art_name);

                let mut full_cached_path = image_cache_path.clone();
                full_cached_path.push("full");
                create_dir_all(&full_cached_path).unwrap();
                full_cached_path.push(&cached_art_name);

                let mut midsize_cached_path = image_cache_path;
                midsize_cached_path.push("midsize");
                create_dir_all(&midsize_cached_path).unwrap();
                midsize_cached_path.push(&cached_art_name);

                if !full_cached_path.exists() {
                    println!("Generating full-size cached image");
                    fs::copy(&folder_art, &full_cached_path).unwrap();
                }

                if !thumnail_cached_path.exists() || !midsize_cached_path.exists() {
                    println!("Decoding image...");
                    img.no_limits();
                    let decoded_img = img.decode().unwrap();
                    println!("Decoded image");
                    let mut resizer = Resizer::new();

                    if !thumnail_cached_path.exists() {
                        println!("Generating thumbnail cached image");
                        let dest_width = 50;
                        let dest_height = 50;
                        let mut dst_img =
                            Image::new(dest_width, dest_height, decoded_img.pixel_type().unwrap());
                        resizer
                            .resize(
                                &decoded_img,
                                &mut dst_img,
                                &ResizeOptions::new().resize_alg(ResizeAlg::Convolution(
                                    fast_image_resize::FilterType::CatmullRom,
                                )),
                            )
                            .unwrap();

                        let midsize_file = File::create(&thumnail_cached_path).unwrap();
                        let mut result_buf = BufWriter::new(midsize_file);
                        match img_format {
                            ImageFormat::Jpeg => {
                                JpegEncoder::new(&mut result_buf)
                                    .write_image(
                                        dst_img.buffer(),
                                        dest_width,
                                        dest_height,
                                        decoded_img.color().into(),
                                    )
                                    .unwrap();
                            }
                            ImageFormat::Png => {
                                PngEncoder::new(&mut result_buf)
                                    .write_image(
                                        dst_img.buffer(),
                                        dest_width,
                                        dest_height,
                                        decoded_img.color().into(),
                                    )
                                    .unwrap();
                            }
                            _ => todo!(),
                        }
                    }

                    if !midsize_cached_path.exists() {
                        println!("Generating midsize cached image");
                        let dest_width = 400;
                        let dest_height = 400;
                        let mut dst_img =
                            Image::new(dest_width, dest_height, decoded_img.pixel_type().unwrap());
                        resizer
                            .resize(
                                &decoded_img,
                                &mut dst_img,
                                &ResizeOptions::new().resize_alg(ResizeAlg::Convolution(
                                    fast_image_resize::FilterType::CatmullRom,
                                )),
                            )
                            .unwrap();

                        let midsize_file = File::create(&midsize_cached_path).unwrap();
                        let mut result_buf = BufWriter::new(midsize_file);
                        match img_format {
                            ImageFormat::Jpeg => {
                                JpegEncoder::new(&mut result_buf)
                                    .write_image(
                                        dst_img.buffer(),
                                        dest_width,
                                        dest_height,
                                        decoded_img.color().into(),
                                    )
                                    .unwrap();
                            }
                            ImageFormat::Png => {
                                PngEncoder::new(&mut result_buf)
                                    .write_image(
                                        dst_img.buffer(),
                                        dest_width,
                                        dest_height,
                                        decoded_img.color().into(),
                                    )
                                    .unwrap();
                            }
                            _ => todo!(),
                        }
                    }
                }

                Some(Artwork {
                    full_res_art: full_cached_path,
                    thumb_art: thumnail_cached_path,
                    art_400: midsize_cached_path,
                })
            }
            None => None,
        };

        artwork
    }
}
