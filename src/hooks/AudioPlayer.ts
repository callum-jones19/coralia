import { useState } from "react";
import { pausePlayer, playPlayer, skipOneSong } from "../api/commands";

export const useAudio = () => {

  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  return {
    isPaused,
    updateIsPaused,
    skipSong
  };
};
