import { MutableRefObject, SyntheticEvent, useState } from "react";

export const useAudio = (soundRef: MutableRefObject<HTMLAudioElement | null>) => {
  const INIT_VOL = 0.1;

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

  const toggleAudioPlaying = () => {
    if (!soundRef.current) return;
    if (soundRef.current.paused) {
      soundRef.current.play();
      setIsPlaying(true);
    } else {
      soundRef.current.pause();
      setIsPlaying(false);
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
  }

  const changeAudioSrc = (newSrc: string) => {
    if (!soundRef.current) return;

    soundRef.current.src = newSrc;
    soundRef.current.load()
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
    handleLoadedData
  };
}