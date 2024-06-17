import { BaseDirectory, FileEntry, FsDirOptions, readDir } from "@tauri-apps/api/fs"


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

  const dirPromise = readDir(rootDir, readOptions);

  const scannedFilePaths = dirPromise
    .then(data => {
      let compiledFiles: string[] = [];
      data.forEach(childDir => {
        const subFiles = filesInDirTree(childDir);
        compiledFiles = compiledFiles.concat(subFiles);
      });
      return compiledFiles;
    })
    .catch(err => {
      console.log('Failed to read given directory. More info:');
      console.log(err);
      const emptyStringList: string[] = [];
      return emptyStringList;
    });

  return scannedFilePaths;
}
