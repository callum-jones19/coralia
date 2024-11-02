import { invoke } from "@tauri-apps/api"
import { Song } from "../types"

export const enqueue_song = (song: Song) => {
  invoke('enqueue_song', { song: song })
    .then(() => console.log('queued new song'))
    .catch(e => console.error(e));
}