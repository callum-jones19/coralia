import { useState } from "react";
import { pausePlayer, playPlayer, setVolumeBackend, skipOneSong } from "../api/commands";

export const useAudio = () => {

  const [isPaused, setIsPaused] = useState<boolean>(false);
  // FIXME
  const [volume, setVolume] = useState<number>(1);

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

  return {
    isPaused,
    updateIsPaused,
    skipSong,
    updateVolume,
    volume
  };
};
