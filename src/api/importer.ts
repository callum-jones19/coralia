import { invoke } from "@tauri-apps/api";
import { CachedPlayerState, Song } from "../types";

export const getLibrarySongs = async () => {
  return invoke<Song[]>("get_library_songs", {});
};

export const getPlayerState = async () => {
  return invoke<CachedPlayerState>("get_player_state", {});
};
