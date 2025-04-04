import { convertFileSrc } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useMemo, useState } from "react";
import { Minimize2 } from "react-feather";
import { Link, useNavigate } from "react-router";
import { getPlayerState } from "../api/importer";
import CurrentSongInfo from "../components/SongControls/CurrentSongInfo";
import PlayButtons from "../components/SongControls/PlayButtons";
import Seekbar from "../components/SongControls/Seekbar";
import VolumeController from "../components/SongControls/VolumeController";
import { Song } from "../types/types";
import { QueueUpdatePayload } from "../types/apiTypes";
const appWindow = getCurrentWebviewWindow();
import fullsizeDefaultImg from "./../assets/no_art_icon_lg.png";

export default function FullscreenScreen() {
  const [queue, setQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

    const unlistenQueue = listen<QueueUpdatePayload>("queue-change", e => {
      const newQueue = e.payload.newQueue;
      setQueue(newQueue);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "Escape") {
        appWindow.setFullscreen(false).catch(e => console.error(e));
        const res = navigate(-1);
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

  const imgSrc = useMemo(() => {
    const currentSong = queue.at(0);

    if (currentSong === undefined) {
      return undefined;
    } else {
      if (currentSong.artwork) {
        return convertFileSrc(currentSong.artwork.fullResArt);
      }  else {
        return fullsizeDefaultImg;
      }
    }
  }, [queue]);
  return (
    <>
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-800 dark:to-neutral-900 dark:text-white p-5">
        <div className="flex-grow flex flex-col gap-2 items-cente min-h-0">
          <div className="basis-1/2 w-full overflow-hidden flex-grow p-6">
            <img
              src={imgSrc}
              className="rounded-lg drop-shadow-md h-full m-auto object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-2/3 m-auto overflow-auto">
            <div className="mb-3">
              <CurrentSongInfo currentSong={queue[0]} />
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
