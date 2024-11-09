import { useEffect, useState } from "react";
import { clearAndPlayBackend, enqueueSongBackend, pausePlayer, playPlayer, setVolumeBackend, skipOneSong } from "../api/commands";
import { Song } from "../types";
import { listen } from "@tauri-apps/api/event";

export const useAudio = () => {

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    listen('song-end', () => {
      console.log('Song ended!');
    }).catch(e => console.error(e));

    listen('is-paused', (event) => {
      console.log(event);
    }).catch(e => console.error(e));

    listen('volume-change', (event) => {
      console.log(event);
    }).catch(e => console.error(e));
  }, [queue]);


  const skipSong = () => {
    skipOneSong();
  }

  const updateIsPaused = (paused: boolean) => {
    setIsPaused(paused);
    if (paused) {
      pausePlayer();
    } else {
      playPlayer();
    }
  };

  const updateVolume = (newVol: number) => {
    setVolume(newVol);
    setVolumeBackend(newVol);
  }

  const enqueueSong = (newSong: Song) => {
    enqueueSongBackend(newSong);
  }

  const changeCurrentSong = (newSong: Song) => {
    clearAndPlayBackend(newSong);
  };

  return {
    isPaused,
    updateIsPaused,
    skipSong,
    updateVolume,
    volume,
    currentSong,
    changeCurrentSong,
    enqueueSong,
    queue
  };
};
