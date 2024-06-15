import { MutableRefObject, SyntheticEvent, useCallback, useRef, useState } from "react";

export interface MusicTags {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface SongData {
  tags: MusicTags;
  filePath: string;
}

export const useAudio = (soundRef: MutableRefObject<HTMLAudioElement | null>) => {
  const INIT_VOL = 0.1;

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

  // TODO consider why this needs to be a useCallback to avoid a looping
  // useEffect call in the MusicFooter file
  const toggleAudioPlaying = useCallback(() => {
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
      soundRef.current.play();
    } else {
      soundRef.current.pause();
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