import { useEffect, useMemo, useState } from "react";
import { clearAndPlayBackend, enqueueSongBackend, pausePlayer, playPlayer } from "../api/commands";
import { Song } from "../types";
import { listen } from "@tauri-apps/api/event";

export const useAudio = () => {

  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [queue, setQueue] = useState<Song[]>([]);

  const currentSong = useMemo(() => queue.length !== 0 ? queue[0] : null, [queue]);

  useEffect(() => {
    const unlistenEnd = listen<Song[]>('song-end', (e) => {
      console.log('Song ended!');

      // When a song ends, the backend send through the new queue, with the
      // currently playing song at the head.
      const newQueue = e.payload;
      setQueue(newQueue);
    }).catch(e => console.error(e));

    const unlistenQueue = listen<Song[]>('queue-change', e => {
      console.log('queue changed');

      const newQueue = e.payload;
      setQueue(newQueue);
    })

    const unlistenPause = listen<boolean>('is-paused', (e) => {
      const isPaused = e.payload;
      console.log(`pause state changed to ${isPaused}`)
      setIsPaused(isPaused);
    }).catch(e => console.error(e));

    const unlistenVolume = listen('volume-change', (event) => {
      console.log(event);
    }).catch(e => console.error(e));

    return () => {
      unlistenEnd.then(f => f).catch(e => console.log(e));
      unlistenPause.then(f => f).catch(e => console.log(e));
      unlistenVolume.then(f => f).catch(e => console.log(e));
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const updateIsPaused = (paused: boolean) => {
    if (paused) {
      pausePlayer();
    } else {
      playPlayer();
    }
  };

  const enqueueSong = (newSong: Song) => {
    enqueueSongBackend(newSong);
  }

  const changeCurrentSong = (newSong: Song) => {
    clearAndPlayBackend(newSong);
  };

  return {
    isPaused,
    updateIsPaused,
    currentSong,
    changeCurrentSong,
    enqueueSong,
    queue
  };
};
