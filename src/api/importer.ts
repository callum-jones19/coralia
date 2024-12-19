import { invoke } from "@tauri-apps/api";
import { Album, CachedPlayerState, Song } from "../types";

export const getLibrarySongs = async () => {
  return invoke<Song[]>("get_library_songs", {});
};

export const getLibraryAlbums = async () => {
  return invoke<Album[]>("get_library_albums", {});
};

export const getPlayerState = async () => {
  return invoke<CachedPlayerState>("get_player_state", {});
};
