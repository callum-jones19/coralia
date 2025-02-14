import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { Outlet } from "react-router";
import { LibraryStatus } from "../../types";
import BackgroundCard from "../UI/BackgroundCard";

export default function LibraryBody() {
  const [libraryState, setLibraryState] = useState<LibraryStatus | null>(null);

  useEffect(() => {
    const unlistenLibStatusChange = listen<LibraryStatus>("library_status_change", e => {
      console.log(e.payload);
      setLibraryState(e.payload);
    });

    // After registering the listener, we want to do an initial grab of the state
    // This means we will get the state that may have been updated since
    // registering the listener already
    invoke<LibraryStatus>("get_library_state", {})
      .then(d => {
        setLibraryState(d);
        console.log(d);
      })
      .catch(e => console.error(e));

    return () => {
      unlistenLibStatusChange.then(f => f).catch(e => console.error(e));
    }
  }, []);

  return (
    <>
      {libraryState !== null &&
        <BackgroundCard className="basis-1/2 min-w-0 flex-grow rounded-md h-full">
          {libraryState === 'NotScanning' && <Outlet />}
          {libraryState !== 'NotScanning' &&
            <>
              <div className="h-full w-full flex flex-col justify-center gap-4 items-center">
                <Loader className="animate-spin" />
                {libraryState === 'ScanningSongs' && <p>Scanning library songs...</p>}
                {libraryState === 'IndexingAlbums' && <p>Indexing library albums...</p>}
                {libraryState === 'CachingArtwork' && <p>Caching library artwork...</p>}
              </div>
            </>
          }
        </BackgroundCard>
      }
    </>
  );
}
