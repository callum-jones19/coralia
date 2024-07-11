import { invoke } from "@tauri-apps/api";
import {
  TauriAlbumResponse,
  tauriAlbumToInternalAlbum,
  TauriSongResponse,
  tauriSongToInternalSong,
} from "./types";

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

export const get_all_albums = async () => {
  return invoke<TauriAlbumResponse[]>("get_all_albums", {})
    .then(albums => albums.map(album => tauriAlbumToInternalAlbum(album)))
    .catch(err => Promise.reject(err));
};
