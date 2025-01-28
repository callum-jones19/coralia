import { invoke } from "@tauri-apps/api";
import { Album, CachedPlayerState, Song } from "../types";

export const getAlbumSongs = async (albumId: number) => {
  return invoke<Song[]>("get_album_songs", { albumId: albumId })
    .then(data => data)
    .catch(e => console.error(e));
};

export const getAlbum = async (albumId: number) => {
  return invoke<Album>("get_album", { albumId: albumId })
    .then(data => data)
    .catch(e => console.error(e));
};

export const getLibrarySongs = async () => {
  return invoke<Song[]>("get_library_songs_sorted", {});
};

export const getLibraryAlbums = async () => {
  return invoke<Album[]>("get_library_albums", {});
};

export const getPlayerState = async () => {
  return invoke<CachedPlayerState>("get_player_state", {});
};

export const readLibFromCache = () => {
  const res = invoke<boolean>("load_library_from_cache")
    .then(result => result)
    .catch(e => console.error(e));

  return res;
};
