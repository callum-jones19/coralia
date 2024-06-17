import { MutableRefObject, SyntheticEvent, useCallback, useRef, useState } from "react";
import { MusicTags } from "../data/types";

export const useAudio = (soundRef: MutableRefObject<HTMLAudioElement | null>) => {
  const INIT_VOL = 0.3;

  const intervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number>(0);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(INIT_VOL);
  const [musicTags, setMusicTags] = useState<MusicTags | null>(null);

  const updateMetadata = (newMusicTags: MusicTags) => {
    setMusicTags(newMusicTags);
  };

  const handleDurationChange = (e: SyntheticEvent<HTMLAudioElement>) => {
    setSongDuration(e.currentTarget.duration);
  };

  const handleLoadedData = () => {
    if (!soundRef.current) return;
    soundRef.current.volume = volume;
  };

  const startPlaying = () => {
    if (!soundRef.current) return;

    soundRef.current.play()
      .then(() => {
        setIsPlaying(true);
        if (intervalRef.current === null) {
          intervalRef.current = window.setInterval(() => {
            if (!soundRef.current) return;
            setSongPos(soundRef.current.currentTime);
          }, 100);
        }
      })
      .catch(err => console.log(err));

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

  const toggleAudioPlaying = useCallback(() => {
    if (!soundRef.current) return;
    if (soundRef.current.paused) {
      soundRef.current.play()
        .then(() => {
          setIsPlaying(true);

          intervalRef.current = window.setInterval(() => {
            if (!soundRef.current) return;
            setSongPos(soundRef.current.currentTime);
          }, 100);
        })
        .catch(err => console.log(err));
    } else {
      soundRef.current.pause();
      setIsPlaying(false);

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [soundRef]);

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

    if (isPlaying) {
      startPlaying();
    } else {
      stopPlaying();
    }
  }

  return {
    updateMetadata,
    musicTags,
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