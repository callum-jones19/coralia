import { listen } from "@tauri-apps/api/event";
import { useEffect, useMemo, useState } from "react";
import { Song } from "../types";

export default function Seekbar() {
  const [seekPos, setSeekPos] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    const unlistenSongChange = listen<Song | undefined>("currently-playing-update", e => {
      const newCurrentSong = e.payload;
      if (newCurrentSong) {
        console.log(`New song playing: ${newCurrentSong.tags.title}`);
        setCurrentSong(newCurrentSong);
      } else {
        console.log(`New song playing: none`);
        setCurrentSong(null);
      }
    });

    return () => {
      unlistenSongChange.then(f => f).catch(e => console.log(e));
    }
  }, []);

  const songDuration = currentSong?.properties.duration.secs;

  const songPosMins = useMemo(() => {
    if (songPos) {
      const mins = Math.floor(songPos / 60).toString().padStart(2, "0");
      return mins;
    } else {
      return null;
    }
  }, [songPos]);

  const songPosSecs = useMemo(() => {
    if (songPos) {
      const secs = Math.floor(songPos % 60).toString().padStart(2, "0");
      return secs;
    } else {
      return null;
    }
  }, [songPos]);

  const seekPosMins = useMemo(() => {
    const mins = Math.floor(seekPos / 60).toString().padStart(2, "0");
    return mins;
  }, [seekPos]);

  const seekPosSecs = useMemo(() => {
    const secs = Math.floor(seekPos % 60).toString().padStart(2, "0");
    return secs;
  }, [seekPos]);

  const durationMins = useMemo(() => {
    if (songDuration) {
      const mins = Math.floor(songDuration / 60).toString().padStart(2, "0");
      return mins;
    } else {
      return null;
    }
  }, [songDuration]);

  const durationSecs = useMemo(() => {
    if (songDuration) {
      const secs = Math.floor(songDuration % 60).toString().padStart(2, "0");
      return secs;
    } else {
      return null;
    }
  }, [songDuration]);

  return (
    <div className="flex flex-row mr-10 ml-10">
      {!isSeeking && (
        <p className="text-white">
          {songPosMins ? songPosMins : "00"}:{songPosSecs
            ? songPosSecs
            : "00"}
        </p>
      )}
      {isSeeking && (
        <p className="text-white">
          {seekPosMins ? seekPosMins : "00"}:{seekPosSecs
            ? seekPosSecs
            : "00"}
        </p>
      )}
      <input
        id="seekbar-range"
        className="w-full ml-5 mr-5 bg-transparent"
        type="range"
        disabled={!songDuration || Number.isNaN(songDuration)}
        readOnly
        value={!songPos ? 0 : (seekPos && isSeeking) ? seekPos : songPos}
        max={!songDuration || Number.isNaN(songDuration) ? 0 : songDuration}
        onMouseDown={() => setIsSeeking(true)}
        onChange={(e) => {
          const tmp = parseFloat(e.target.value);
          setSeekPos(tmp);
        }}
        onMouseUp={() => {
          if (seekPos !== null) {
            setSongPos(seekPos);
          }
          setIsSeeking(false);
          setSeekPos(0);
        }}
      />
      <p className="text-white">
        {durationMins ? durationMins : "00"}:{durationSecs
          ? durationSecs
          : "00"}
      </p>
    </div>
  )
}