import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "react-feather";
import { pausePlayer, playPlayer, skipOneSong } from "../api/commands";

export default function PlayButtons() {
  const [isPaused, setIsPaused] = useState<boolean>(true);

  useEffect(() => {
    const unlistenPause = listen<boolean>("is-paused", (e) => {
      const isPaused = e.payload;
      console.log(`pause state changed to ${isPaused}`);
      setIsPaused(isPaused);
    }).catch(e => console.error(e));

    unlistenPause.then(f => f).catch(e => console.log(e));
  }, []);

  return (
    <>
      <div id="play-controls" className="flex flex-row items-center">
        <button
          className="bg-white mr-3 font-bold rounded-full aspect-square h-10 disabled:bg-gray-500"
          disabled
          onClick={() => {
            // todo
          }}
        >
          <SkipBack className="m-auto h-1/2 w-1/2" />
        </button>
        <button
          className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
          onClick={() => {
            if (isPaused) {
              playPlayer();
            } else {
              pausePlayer();
            }
          }}
        >
          {isPaused && <Play className="m-auto h-1/2 w-1/2" />}
          {!isPaused && <Pause className="m-auto h-1/2 w-1/2" />}
        </button>
        <button
          className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
          onClick={() => skipOneSong()}
        >
          <SkipForward className="m-auto h-1/2 w-1/2" />
        </button>
      </div>
    </>
  );
}