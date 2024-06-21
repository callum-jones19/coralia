import { invoke } from "@tauri-apps/api";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import { TauriCollectionResponse, tauriCollectionToCollection } from "./types";

export const load_or_generate_collection = async () => {
  readDir("Music", { dir: BaseDirectory.Home, recursive: true })
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return invoke<TauriCollectionResponse>("load_or_create_collection", {
    rootDir: "C:/Users/Callum/Music/albums",
  })
    .then(collection => tauriCollectionToCollection(collection))
    .catch(err => Promise.reject(err));
};
