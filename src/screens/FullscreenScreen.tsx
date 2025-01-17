import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPlayerState } from "../api/importer";
import { listen } from "@tauri-apps/api/event";
import { Song } from "../types";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Minimize2 } from "react-feather";
import Seekbar from "../components/Seekbar";
import SongInfoFooter from "../components/SongInfoFooter";
import PlayButtons from "../components/PlayButtons";
import VolumeController from "../components/VolumeController";
import { appWindow } from "@tauri-apps/api/window";

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
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-neutral-700 to-neutral-900 text-white p-5">
        <div
          className="flex-grow flex flex-col gap-2 items-cente min-h-0"
        >
          <div className="basis-1/2 w-full overflow-hidden flex-grow p-6">
            <img src={imgSrc} className="rounded-lg drop-shadow-md h-full m-auto object-contain" />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-2/3 m-auto overflow-auto">
            <div className="mb-3">
              <SongInfoFooter currentSong={queue[0]} />
            </div>
            <Seekbar />
            <div className="w-full flex flex-row justify-between">
              <div className="basis-0 flex-grow flex flex-row items-center">
                <VolumeController />
              </div>
              <PlayButtons />
              <div className="basis-0 flex-grow flex flex-row justify-end items-center">
                <Link to={"/home"} onClick={() => {
                  appWindow.setFullscreen(false).catch(e => console.error(e))
                }}>
                  <Minimize2 size="1em" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
