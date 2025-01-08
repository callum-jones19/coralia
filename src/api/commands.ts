import { invoke } from "@tauri-apps/api";
import { Duration, Song } from "../types";

export const resetLibraryBackend = () => {
  console.log('test2');
  const tmp = invoke<void>("clear_library_and_cache", {});
  console.log(tmp);
  return tmp;
};


export const addLibraryFolders = (folders: string[]) => {
  invoke("add_library_directories", { rootDirs: folders })
    .then(() => console.log("Added new folders to the library"))
    .catch(e => console.error(e));
};

export const enqueueSongBackend = (song: Song) => {
  invoke("enqueue_song", { song: song })
    .then(() => console.log("queued new song"))
    .catch(e => console.error(e));
};

export const pausePlayer = () => {
  invoke("pause", {})
    .catch(e => console.error(e));
};

export const playPlayer = () => {
  invoke("play", {})
    .catch(e => console.error(e));
};

export const skipOneSong = () => {
  invoke("skip_current_song", {})
    .catch(e => console.error(e));
};

export const removeFromQueue = (queueIndex: number) => {
  invoke("remove_song_from_queue", { skipIndex: queueIndex })
    .catch(e => console.error(e));
};

export const setVolumeBackend = (newVolume: number) => {
  console.log(newVolume);

  invoke("set_volume", { newVolume: newVolume })
    .catch(e => console.error(e));
};

export const clearAndPlayBackend = (song: Song) => {
  invoke("clear_queue_and_play", { song: song })
    .then(() => playPlayer())
    .catch(e => console.error(e));
};

export const seekCurrentSong = (seekAmount: Duration) => {
  invoke("seek_current_song", { seekDuration: seekAmount })
    .catch(e => console.error(e));
};
