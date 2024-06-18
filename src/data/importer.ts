import { invoke } from "@tauri-apps/api";
import { Song } from "./types";

export const import_song_library = async () => {
  return invoke<Song[]>('scan_folder', { rootDir: 'C:/Users/Callum/Music/albums' })
    .then(songs => songs)
    .catch(err => Promise.reject(err));
}