import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "react-feather";
import {
  goBackOneSong,
  pausePlayer,
  playPlayer,
  skipOneSong,
} from "../../api/commands";
import { getPlayerState } from "../../api/importer";
import { SongInfo } from "../../types";

export default function PlayButtons() {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [queueLen, setQueueLen] = useState<number>(0);
  const [prevSongsLen, setPrevSongsLen] = useState<number>(0);

  useEffect(() => {
    const unlistenPause = listen<SongInfo>("is-paused", (e) => {
      const { paused } = e.payload;
      console.log(`Updated1 isPaused to ${paused}`);
      setIsPaused(paused);
    }).catch(e => console.error(e));

    const unlistenQueueLen = listen<[number, number]>(
      "queue-length-change",
      (e) => {
        const newQueueLen = e.payload;
        setQueueLen(newQueueLen[0]);
        setPrevSongsLen(newQueueLen[1]);
      },
    ).catch(e => console.error(e));

    getPlayerState()
      .then(playerState => {
        setQueueLen(playerState.songsQueue.length);
        setPrevSongsLen(playerState.prevSongsQueue.length);
        setIsPaused(playerState.isPaused);
      })
      .catch(e => console.error(e));

    return () => {
      unlistenPause.then(f => f).catch(e => console.log(e));
      unlistenQueueLen.then(f => f).catch(e => console.log(e));
    };
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-1">
        <button
          className="flex rounded-full flex-row justify-center items-center w-8 h-8"
          disabled={prevSongsLen === 0}
          onClick={() => {
            goBackOneSong();
          }}
        >
          <SkipBack
            size="1em"
            className={`${
              prevSongsLen === 0
                ? "text-neutral-400 fill-neutral-400"
                : "text-black fill-black dark:text-white dark:fill-white"
            }`}
          />
        </button>
        <button
          className="flex rounded-full flex-row justify-center items-center w-9 h-9 disabled:bg-transparent hover:bg-neutral-400 hover:dark:bg-neutral-600"
          disabled={queueLen === 0}
          onClick={() => {
            if (isPaused) {
              playPlayer();
            } else {
              pausePlayer();
            }
          }}
        >
          {isPaused
            && (
              <Play
                size="1.2em"
                className={`${
                  queueLen === 0
                    ? "text-neutral-400 fill-neutral-400"
                    : "text-black fill-black dark:text-white dark:fill-white"
                }`}
              />
            )}
          {!isPaused
            && (
              <Pause
                size="1.2em"
                className={`${
                  queueLen === 0
                    ? "text-neutral-400 fill-neutral-400"
                    : "text-black fill-black dark:text-white dark:fill-white"
                }`}
              />
            )}
        </button>
        <button
          className="flex rounded-full flex-row justify-center items-center w-8 h-8"
          disabled={queueLen <= 0}
          onClick={() => skipOneSong()}
        >
          <SkipForward
            size="1em"
            className={`${
              queueLen === 0
                ? "text-neutral-400 fill-neutral-400"
                : "text-black fill-black dark:text-white dark:fill-white"
            }`}
          />
        </button>
      </div>
    </>
  );
}
