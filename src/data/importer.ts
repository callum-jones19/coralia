import { invoke } from "@tauri-apps/api";
import { TauriCollectionResponse, TauriSongResponse, tauriCollectionToCollection, tauriSongToInternalSong } from "./types";

export const load_or_generate_collection = async () => {
  return invoke<TauriCollectionResponse>("load_or_create_collection", {
    rootDir: "C:/Users/Callum/Music/albums",
  })
    .then(collection => tauriCollectionToCollection(collection))
    .catch(err => Promise.reject(err));
};

export const filter_songs_by_title = async (title_filter: string, collection: TauriCollectionResponse) => {
  return invoke<TauriSongResponse[]>("filter_songs_by_title", {
    collection,
    titleFilter: title_filter
  })
    .then(songs => songs.map(song => tauriSongToInternalSong(song)))
    .catch(err => Promise.reject(err));
};
