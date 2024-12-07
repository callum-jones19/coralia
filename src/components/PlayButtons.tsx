import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "react-feather";
import { pausePlayer, playPlayer, skipOneSong } from "../api/commands";
import { getPlayerState } from "../api/importer";
import { SongInfo } from "../types";

export default function PlayButtons() {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [queueLen, setQueueLen] = useState<number>(0);

  useEffect(() => {
    const unlistenPause = listen<SongInfo>("is-paused", (e) => {
      const { paused } = e.payload;
      console.log(`Updated1 isPaused to ${paused}`);
      setIsPaused(paused);
    }).catch(e => console.error(e));

    const unlistenQueueLen = listen<number>("queue-length-change", (e) => {
      const newQueueLen = e.payload;
      setQueueLen(newQueueLen);
    }).catch(e => console.error(e));

    const unlistenSongEnd = listen<number>("song-end-queue-length", e => {
      const newQueueLen = e.payload;
      setQueueLen(newQueueLen);
    });

    getPlayerState()
      .then(playerState => {
        setQueueLen(playerState.songsQueue.length);
        setIsPaused(playerState.isPaused);
      })
      .catch(e => console.error(e));

    return () => {
      unlistenPause.then(f => f).catch(e => console.log(e));
      unlistenQueueLen.then(f => f).catch(e => console.log(e));
      unlistenSongEnd.then(f => f).catch(e => console.log(e));
    };
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-1">
        <button
          className="flex rounded-full flex-row justify-center items-center w-8 h-8"
          disabled
          onClick={() => {
            // todo
          }}
        >
          <SkipBack fill={`${queueLen === 0 ? 'gray' : 'white'}`} color={`${queueLen === 0 ? 'gray' : 'white'}`} size='1em' />
        </button>
        <button
          className="bg-white flex rounded-full flex-row justify-center items-center w-9 h-9 disabled:bg-gray-500"
          disabled={queueLen === 0}
          onClick={() => {
            if (isPaused) {
              playPlayer();
            } else {
              pausePlayer();
            }
          }}
        >
          {isPaused && <Play fill="black" size='1em' />}
          {!isPaused && <Pause size='1em' fill="black" />}
        </button>
        <button
          className="flex rounded-full flex-row justify-center items-center w-8 h-8"
          disabled={queueLen <= 0}
          onClick={() => skipOneSong()}
        >
          <SkipForward fill={`${queueLen === 0 ? 'gray' : 'white'}`} color={`${queueLen === 0 ? 'gray' : 'white'}`} size='1em' />
        </button>
      </div>
    </>
  );
}
