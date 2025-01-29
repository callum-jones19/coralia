import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Minimize2 } from "react-feather";
import { Link, useNavigate } from "react-router";
import { getPlayerState } from "../api/importer";
import PlayButtons from "../components/PlayButtons";
import Seekbar from "../components/Seekbar";
import SongInfoFooter from "../components/SongInfoFooter";
import VolumeController from "../components/VolumeController";
import { Song } from "../types";

export default function FullscreenScreen() {
  const [queue, setQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      const newQueue = e.payload[0];
      setQueue(newQueue);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "Escape") {
        const res = navigate("/home");
        appWindow.setFullscreen(false).catch(e => console.error(e));
        if (res) {
          res.catch(e => console.error(e));
        }
      }
    };

    // Setup keybinds
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const imgSrc = queue[0]?.artwork
    ? convertFileSrc(queue[0].artwork.fullResArt)
    : undefined;

  return (
    <>
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-neutral-100 to-white p-5">
        <div className="flex-grow flex flex-col gap-2 items-cente min-h-0">
          <div className="basis-1/2 w-full overflow-hidden flex-grow p-6">
            <img
              src={imgSrc}
              className="rounded-lg drop-shadow-md h-full m-auto object-contain"
            />
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
                <Link
                  to={"/home"}
                  onClick={() => {
                    appWindow.setFullscreen(false).catch(e => console.error(e));
                  }}
                >
                  <Minimize2 size="1em" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
