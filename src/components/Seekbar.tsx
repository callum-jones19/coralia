import { listen } from "@tauri-apps/api/event";
import { useEffect, useMemo, useRef, useState } from "react";
import { seekCurrentSong } from "../api/commands";
import { getPlayerState } from "../api/importer";
import { Duration, Song, SongInfo } from "../types";

export default function Seekbar() {
  const songPosIntervalId = useRef<number | null>(null);

  const [seekPos, setSeekPos] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    const unlistenSongChange = listen<Song | undefined>(
      "currently-playing-update",
      e => {
        const newCurrentSong = e.payload;
        if (newCurrentSong) {
          setCurrentSong(newCurrentSong);
        } else {
          setCurrentSong(null);
        }
        setSongPos(0);
      },
    );

    getPlayerState()
      .then(playerState => {
        setSongPos(
          playerState.currentSongPos.secs
            + (playerState.currentSongPos.nanos / 1000000000),
        );
      })
      .catch(e => console.error(e));

    const eventPauseRes = listen<SongInfo>("is-paused", (e) => {
      const { paused, position } = e.payload;
      // Remove an interval that already existed.
      if (songPosIntervalId.current) {
        window.clearInterval(songPosIntervalId.current);
      }

      const posInFractionSeconds = position.secs
        + (position.nanos / 1000000000);
      setSongPos(posInFractionSeconds);

      if (paused) {
        // Stop the seekbar interval
        if (songPosIntervalId.current) {
          console.log("clear interval");
          window.clearInterval(songPosIntervalId.current);
        }
        setSongPos(posInFractionSeconds);
      } else {
        // Start the seekbar interval
        setSongPos(() => posInFractionSeconds);
        songPosIntervalId.current = window.setInterval(() => {
          setSongPos(oldPos => {
            return oldPos ? oldPos + 1 : 1;
          });
        }, 1000);
      }
    })
      .catch(e => console.error(e));

    return () => {
      unlistenSongChange
        .then(f => f)
        .catch(e => console.log(e));
      eventPauseRes
        .then(f => f)
        .catch(e => console.log(e));
    };
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
        // disabled={!songDuration || Number.isNaN(songDuration)}
        readOnly
        value={!songPos ? 0 : isSeeking ? seekPos : songPos}
        max={!songDuration || Number.isNaN(songDuration) ? 0 : songDuration}
        onMouseDown={() => setIsSeeking(true)}
        onChange={(e) => {
          const tmp = parseFloat(e.target.value);
          setSeekPos(tmp);
        }}
        onMouseUp={() => {
          if (seekPos !== null) {
            const seekSecs = Math.floor(seekPos);
            const seekNanoseconds = Math.floor(
              (seekPos - seekSecs) * 1000000000,
            );

            const seekDuration: Duration = {
              nanos: seekNanoseconds,
              secs: seekSecs,
            };

            seekCurrentSong(seekDuration);
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
  );
}
