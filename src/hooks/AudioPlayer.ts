import { convertFileSrc } from "@tauri-apps/api/tauri";
import {
  MutableRefObject,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { Song } from "../data/types";

export const useAudio = (
  soundRef: MutableRefObject<HTMLAudioElement | null>,
) => {
  const INIT_VOL = 0.3;

  const intervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number>(0);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(INIT_VOL);
  const [currSong, setCurrSong] = useState<Song | null>(null);

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
      .catch(err => {
        console.log("Failed to play current media. More info:");
        console.log(err);
      });
  };

  const stopPlaying = () => {
    if (!soundRef.current) return;

    soundRef.current.pause();
    setIsPlaying(false);
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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
        .catch(err => {
          console.log(
            "Failed to play currently loaded audio media. More info:",
          );
          console.log(err);
        });
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
  };

  const updateProgress = (newProgress: number) => {
    if (!soundRef.current) return;

    soundRef.current.currentTime = newProgress;
    setSongPos(newProgress);
  };

  const changeAudioSrc = (song: Song) => {
    if (!soundRef.current) return;

    console.log(song);

    soundRef.current.src = convertFileSrc(song.filePath);
    soundRef.current.load();
    setSongPos(0);
    setSongDuration(soundRef.current.duration);
    setCurrSong(song);

    if (isPlaying) {
      startPlaying();
    } else {
      stopPlaying();
    }
  };

  return {
    currSong,
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
};
