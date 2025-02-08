import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { Outlet } from "react-router";

export default function LibraryBody() {
  const [isScanningSongs, setIsScanningSongs] = useState<boolean>(false);
  const [isScanningAlbums, setIsScanningAlbums] = useState<boolean>(false);

  useEffect(() => {
    const unlistenScanSongsBegin = listen("library_song_scan_begin", () => {
      setIsScanningSongs(true);
    });

    const unlistenScanSongsEnd = listen("library_song_scan_end", () => {
      setIsScanningSongs(false);
    });

    const unlistenScanAlbumsBegin = listen("library_album_scan_begin", () => {
      setIsScanningAlbums(true);
    });

    const unlistenScanAlbumsEnd = listen("library_album_scan_end", () => {
      setIsScanningAlbums(false);
    });

    return () => {
      unlistenScanSongsBegin.then(f => f).catch(e => console.error(e));
      unlistenScanSongsEnd.then(f => f).catch(e => console.error(e));
      unlistenScanAlbumsBegin.then(f => f).catch(e => console.error(e));
      unlistenScanAlbumsEnd.then(f => f).catch(e => console.error(e));
    }
  }, []);

  return (
    <>
      <div className="bg-neutral-100 basis-1/2 min-w-0 flex-grow rounded-md h-full">
        {!isScanningAlbums && !isScanningSongs && <Outlet />}
        {(isScanningSongs || isScanningAlbums) &&
          <>
            <div className="h-full w-full flex flex-col justify-center gap-4 items-center">
              <Loader className="animate-spin" />
              {isScanningSongs && <p>Scanning library songs...</p>}
              {isScanningAlbums && <p>Scanning library albums...</p>}
            </div>
          </>
        }
      </div>
    </>
  );
}
