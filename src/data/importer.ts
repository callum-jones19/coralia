import { invoke } from "@tauri-apps/api";
import { Song, TauriSongResponse } from "./types";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";

export const import_song_library = async () => {
  readDir('Music', { dir: BaseDirectory.Home, recursive: true })
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return invoke<TauriSongResponse[]>('scan_folder', { rootDir: 'C:/Users/Callum/Music/albums' })
    .then(songs => songs)
    .catch(err => Promise.reject(err));
}