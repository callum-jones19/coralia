import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "react-feather";
import { pausePlayer, playPlayer, skipOneSong } from "../api/commands";

export default function PlayButtons() {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [queueLen, setQueueLen] = useState<number>(0);

  useEffect(() => {
    const unlistenPause = listen<boolean>("is-paused", (e) => {
      const isPaused = e.payload;
      console.log(`pause state changed to ${isPaused}`);
      setIsPaused(isPaused);
    }).catch(e => console.error(e));

    const unlistenQueueLen = listen<number>("queue-length-change", (e) => {
      const newQueueLen = e.payload;
      console.log(`New queue length: ${newQueueLen}`);
      setQueueLen(newQueueLen);
    }).catch(e => console.error(e));

    const unlistenSongEnd = listen<number>("song-end-queue-length", e => {
      const newQueueLen = e.payload;
      console.log(`New queue length: ${newQueueLen}`);
      setQueueLen(newQueueLen);
    })

    return () => {
      unlistenPause.then(f => f).catch(e => console.log(e));
      unlistenQueueLen.then(f => f).catch(e => console.log(e));
      unlistenSongEnd.then(f => f).catch(e => console.log(e));
    };
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
          className="bg-white mr-3 font-bold rounded-full aspect-square h-10 disabled:bg-gray-500"
          disabled={queueLen === 0 ? true : false}
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
          className="bg-white mr-3 font-bold rounded-full aspect-square h-10 disabled:bg-gray-500"
          disabled={queueLen <= 0 ? true : false}
          onClick={() => skipOneSong()}
        >
          <SkipForward className="m-auto h-1/2 w-1/2" />
        </button>
      </div>
    </>
  );
}