import { invoke } from "@tauri-apps/api";
import { TauriSongResponse, tauriSongToInternalSong } from "./types";

export const filter_songs_by_title = async (title_filter: string) => {
  return invoke<TauriSongResponse[]>("filter_songs_by_title", {
    titleFilter: title_filter,
  })
    .then(songs => songs.map(song => tauriSongToInternalSong(song)))
    .catch(err => Promise.reject(err));
};

export const get_all_songs = async () => {
  return invoke<TauriSongResponse[]>("get_all_songs", {})
    .then(songs => songs.map(song => tauriSongToInternalSong(song)))
    .catch(err => Promise.reject(err));
};

export const get_queue = async () => {
  return invoke<TauriSongResponse[]>("get_queue", {})
    .then(songs => songs.map(song => tauriSongToInternalSong(song)))
    .catch(err => Promise.reject(err))
};

export const addToBackendQueue = async (song_to_add_path: string) => {
  return invoke<TauriSongResponse[]>("add_to_queue", {
    songToAddPath: song_to_add_path
  })
    .then(newQueue => newQueue.map(song => tauriSongToInternalSong(song)))
    .catch(err => Promise.reject(err));
};

export const popBackendQueue = async () => {
  return invoke<TauriSongResponse | undefined>("queue_pop", {})
    .then(maybe_song => {
      if (maybe_song) {
        return tauriSongToInternalSong(maybe_song)
      } else {
        return Promise.reject("Tmp");
      }
    })
    .catch(err => Promise.reject(err));
};

export const clearBackendQueue = async () => {
  return invoke("clear_queue", {})
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err));
}
