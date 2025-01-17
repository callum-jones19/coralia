import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPlayerState } from "../api/importer";
import { listen } from "@tauri-apps/api/event";
import { Song } from "../types";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Home } from "react-feather";
import Seekbar from "../components/Seekbar";
import SongInfoFooter from "../components/SongInfoFooter";
import PlayButtons from "../components/PlayButtons";
import { useImage } from "react-image";

export default function FullscreenScreen() {
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      const newQueue = e.payload[0];
      setQueue(newQueue);
    });

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const imgSrc = queue[0]?.artwork ? convertFileSrc(queue[0].artwork.fullResArt) : undefined;

  return (
    <>
      <div className="w-full h-full flex flex-col bg-neutral-800 text-white p-5">
        <div className="w-full flex flex-row justify-start">
          <Link to="/home">
            <Home />
          </Link>
        </div>
        <div
          className="flex-grow flex flex-col gap-10 items-cente min-h-0"
        >
          <div className="basis-1/2 w-full overflow-hidden flex-grow p-10">
            <img src={imgSrc} className="rounded-lg shadow-lg h-full m-auto object-contain" />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-full overflow-auto">
            <SongInfoFooter currentSong={queue[0]}/>
            <PlayButtons />
            <Seekbar />
          </div>
        </div>
      </div>
    </>
  )
}
