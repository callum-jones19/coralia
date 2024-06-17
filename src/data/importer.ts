import { invoke } from "@tauri-apps/api";
import { BaseDirectory, FileEntry, FsDirOptions, readDir } from "@tauri-apps/api/fs"
import { MusicTags, Song } from "./types";


/**
 * Recursively scan from a root file entry, and return a list of paths to every
 * sub-file contained within it that has no children of its own
 * @param rootFile
 * @returns
 */
const filesInDirTree = (rootFile: FileEntry): string[] => {
  // Base case - we find a file, we just return that path
  if (!rootFile.children) {
    return [rootFile.path];
  }

  // This is a folder, so we need to scan its subfolders
  let res: string[] = [];
  rootFile.children.forEach(childFile => {
    const tmp = filesInDirTree(childFile);
    res = res.concat(tmp);
  });
  return res;
}

/**
 * Scan a folder recursively for any music files within it.
 */
export const scanFolder = (rootDir: string) => {

  const readOptions: FsDirOptions = {
    dir: BaseDirectory.Home,
    recursive: true,
  };

  return readDir(rootDir, readOptions)
    .then(childDirs => childDirs.reduce(
      (accumulator, currVal) => accumulator.concat(filesInDirTree(currVal)),
      [] as string[]
    ))
    .catch(() => [] as string[]);
}

export const readTagsOnFile = (filePath: string) => {
  return invoke<MusicTags>('read_music_metadata', { filepath: filePath })
    .then(response => {
      const musicData: Song = {
        filePath: filePath,
        tags: response,
      };

      return musicData;
    }).catch(err => {
      console.log("Error occurred while reading metadata of file. More info:");
      console.log(err);
      return null;
    })
}

export const readTagsOnFiles = (filePaths: string[]) => {
  const scannedSongPromises = filePaths
    .reduce(
      (accumulator, currVal) => accumulator.concat(readTagsOnFile(currVal)),
      [] as Promise<Song | null>[]
    );

  return scannedSongPromises;
}

export const scanLibrary = () => {
  return scanFolder("Music")
    .then(filePaths => readTagsOnFiles(filePaths))
    .then(data => Promise.all(data))
    .then(data => Promise.resolve(data.filter(t => t !== null) as Song[]))
    .catch(err => Promise.reject(err));
}
