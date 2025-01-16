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
      <div className="w-full h-full flex flex-col bg-gradient-to-b bg-neutral-800 text-white p-5 overflow-hidden gap-3">
        <div id="header-row" className="w-full flex flex-row justify-start">
          <Link to="/home">
            <Home />
          </Link>
        </div>
        <div id="main-section" className="flex-grow min-h-0 flex flex-row gap-10">
          {imgSrc && <img alt='fullsize album art' src={imgSrc} className="h-full aspect-square rounded-lg" />}
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <SongInfoFooter currentSong={queue[0]}/>
            <PlayButtons />
            <Seekbar />
          </div>
        </div>
      </div>
    </>
  )
}