import { invoke } from "@tauri-apps/api";
import { Song } from "../types";

export const get_library_songs = async () => {
  return invoke<Song[]>("get_library_songs", {});
}
