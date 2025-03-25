import { invoke } from "@tauri-apps/api/core";
import { Duration, Song } from "../types/types";

export const resetLibraryBackend = () => {
  const tmp = invoke<void>("clear_library_and_cache", {});
  return tmp;
};

export const addLibraryFolders = (folders: string[]) => {
  return invoke("add_library_directories", { rootDirs: folders });
};

export const enqueueSongBackend = (song: Song) => {
  return invoke("add_to_queue_end", { song: song });
};

export const addToQueueNext = (song: Song) => {
  return invoke("add_to_queue_next", { song: song });
};

export const enqueueSongsBackend = (songs: Song[]) => {
  return invoke("enqueue_songs", { songs: songs });
};

export const pausePlayer = () => {
  return invoke("pause", {});
};

export const playPlayer = () => {
  return invoke("play", {});
};

export const skipOneSong = () => {
  return invoke("skip_current_song", {});
};

export const goBackOneSong = () => {
  return invoke("skip_back", {});
};

export const removeFromQueue = (queueIndex: number) => {
  return invoke("remove_song_from_queue", { skipIndex: queueIndex })
};

export const setVolumeBackend = (newVolume: number) => {
  return invoke("set_volume", { newVolume: newVolume })
};

export const clearAndPlayBackend = (song: Song) => {
  return invoke<void>("clear_queue_and_play", { song: song });
};

export const seekCurrentSong = (seekAmount: Duration) => {
  return invoke("seek_current_song", { seekDuration: seekAmount })
};
