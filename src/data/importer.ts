import { invoke } from "@tauri-apps/api";
import { TauriCollectionResponse, tauriCollectionToCollection } from "./types";

export const load_or_generate_collection = async () => {
  return invoke<TauriCollectionResponse>("load_or_create_collection", {
    rootDir: "C:/Users/Callum/Music/albums",
  })
    .then(collection => tauriCollectionToCollection(collection))
    .catch(err => Promise.reject(err));
};
