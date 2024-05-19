import { MutableRefObject, SyntheticEvent, useRef, useState } from "react";

export const useAudio = (soundRef: MutableRefObject<HTMLAudioElement | null>) => {
  const INIT_VOL = 0.1;

  const intervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number>(0);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(INIT_VOL);

  const handleDurationChange = (e: SyntheticEvent<HTMLAudioElement>) => {
    setSongDuration(e.currentTarget.duration);
  };

  const handleLoadedData = () => {
    if (!soundRef.current) return;
    setVolume(INIT_VOL);
    soundRef.current.volume = INIT_VOL;
  };

  const startPlaying = () => {
    if (!soundRef.current) return;

    soundRef.current.play();
    setIsPlaying(true);
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        if (!soundRef.current) return;
        setSongPos(soundRef.current.currentTime);
      }, 100);
    }
  }

  const stopPlaying = () => {
    if (!soundRef.current) return;

    soundRef.current.pause();
    setIsPlaying(false);
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const toggleAudioPlaying = () => {
    if (!soundRef.current) return;
    if (soundRef.current.paused) {
      soundRef.current.play();
      setIsPlaying(true);

      intervalRef.current = window.setInterval(() => {
        if (!soundRef.current) return;
        setSongPos(soundRef.current.currentTime);
      }, 100);
    } else {
      soundRef.current.pause();
      setIsPlaying(false);

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  const updateVolume = (newVol: number) => {
    if (!soundRef.current) return;

    soundRef.current.volume = newVol;
    setVolume(newVol);
  }

  const updateProgress = (newProgress: number) => {
    if (!soundRef.current) return;

    soundRef.current.currentTime = newProgress;
    setSongPos(newProgress);
  }

  const changeAudioSrc = (newSrc: string) => {
    if (!soundRef.current) return;

    soundRef.current.src = newSrc;
    soundRef.current.load()
    setSongPos(0);
    setSongDuration(soundRef.current.duration);
  }

  return {
    toggleAudioPlaying,
    updateVolume,
    updateProgress,
    changeAudioSrc,
    isPlaying,
    songDuration,
    songPos,
    volume,
    handleDurationChange,
    handleLoadedData,
    startPlaying,
    stopPlaying,
  };
}