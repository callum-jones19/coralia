import { BaseDirectory, FileEntry, FsDirOptions, readDir } from "@tauri-apps/api/fs"
import { homeDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

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
  // console.log(res);
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

  const dirPromise = readDir(rootDir, readOptions);

  dirPromise
    .then(data => {
      console.log(data);
      data.forEach(childDir => {
        const subFiles = filesInDirTree(childDir);
        console.log(subFiles);
      })
    })
    .catch(err => {
      console.log(err);
    });
}

export const playSongFromURI = (absPath: string, onUriLoad: (uri: string) => void) => {
  // const appDataDirPath = homeDir();
  // const filePath = appDataDirPath.then(dir => join(dir, 'Music/albums/Justice/Hyperdrama/03 Justice & RIMON - Afterimage.mp3'));

}