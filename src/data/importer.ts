import { BaseDirectory, FsDirOptions, readDir } from "@tauri-apps/api/fs"
import { homeDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

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
    })
    .catch(err => {
      console.log(err);
    });
}

export const playSongFromURI = (onUriLoad: (uri: string) => void) => {
  const appDataDirPath = homeDir();
  const filePath = appDataDirPath.then(dir => join(dir, 'Music/albums/Justice/Hyperdrama/03 Justice & RIMON - Afterimage.mp3'));
  filePath.then(fileSrc => {
    const newSrc = convertFileSrc(fileSrc);
    onUriLoad(newSrc);
  })
    .catch(err => {
      console.log(err);
    });
}