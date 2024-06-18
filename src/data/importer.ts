import { invoke } from "@tauri-apps/api";
import { Song } from "./types";

export const import_song_library = () => {
  invoke<Song[]>('scan_folder', { rootDir: 'C:/Users/Callum/Music/albums' })
    .then(songs => console.log(songs))
    .catch(err => console.log(err));
}