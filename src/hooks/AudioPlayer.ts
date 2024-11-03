import { useState } from "react";
import { pausePlayer, playPlayer, setVolumeBackend, skipOneSong } from "../api/commands";

export const useAudio = () => {

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [songDuration, setSongDuration] = useState<number | undefined>(undefined);

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

  const updateSongDuration = (newDuration: number | undefined) => {
    setSongDuration(newDuration);
  }

  return {
    isPaused,
    updateIsPaused,
    skipSong,
    updateVolume,
    volume,
    updateSongDuration,
    songDuration,
  };
};
