import { convertFileSrc } from "@tauri-apps/api/tauri";
import {
  MutableRefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { get_all_albums, get_all_songs } from "../data/importer";
import { Album, Song } from "../data/types";

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

  const [songs, setSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    get_all_songs()
      .then(songs => setSongs(songs))
      .catch(err => console.log(err));

    get_all_albums()
      .then(albums => setAlbums(albums))
      .catch(err => console.log(err));
  }, []);

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

  const addToQueue = (song: Song) => {
    setQueue(oldQueue => [...oldQueue, song]);
  };

  const playNextInQueue = () => {
    if (queue.length === 0) return;
    console.log(queue.toString());
    const newSong = queue[0];
    setQueue(() => queue.slice(1));
    changeAudioSrc(newSong);
    startPlaying();
    // popBackendQueue()
    //   .then(maybeSong => {
    //       changeAudioSrc(maybeSong);
    //       startPlaying();
    //       return get_queue();
    //   })
    //   .then(newQueue => setQueue(() => [...newQueue]))
    //   .then(() => console.log(queue))
    //   .catch(err => console.log(err));
  };

  const clearQueue = () => {
    setQueue(() => []);
    // clearBackendQueue()
    //   .then(() => setQueue([]))
    //   .catch(err => console.log(err));
  };

  const resetQueueAndPlaySong = (song: Song) => {
    setQueue([]);
    changeAudioSrc(song);
    startPlaying();
  };

  const changeAudioSrc = (song: Song) => {
    if (!soundRef.current) return;

    console.log(song);

    soundRef.current.src = convertFileSrc(song.filePath);
    soundRef.current.load();
    setSongPos(0);
    // setSongDuration(soundRef.current.duration);
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
    isPlaying,
    songDuration,
    songPos,
    volume,
    handleDurationChange,
    handleLoadedData,
    startPlaying,
    stopPlaying,
    addToQueue,
    playNextInQueue,
    songs,
    queue,
    clearQueue,
    resetQueueAndPlaySong,
    albums,
  };
};
