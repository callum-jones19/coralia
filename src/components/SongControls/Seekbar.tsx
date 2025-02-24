import { listen } from "@tauri-apps/api/event";
import { useEffect, useMemo, useRef, useState } from "react";
import { seekCurrentSong } from "../../api/commands";
import { getPlayerState } from "../../api/importer";
import { Duration, Song, SongInfo } from "../../types";

export default function Seekbar() {
  const songPosIntervalId = useRef<number | null>(null);

  const [seekPos, setSeekPos] = useState<number | null>(null);
  const [songPos, setSongPos] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const updateTimeoutMs = 100;

  const updateSeekbarPos = (position: Duration, paused: boolean) => {
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
          return oldPos !== null
            ? oldPos + (updateTimeoutMs / 1000)
            : (updateTimeoutMs / 1000);
        });
      }, updateTimeoutMs);
    }
  };

  useEffect(() => {
    const eventPauseRes = listen<SongInfo>("is-paused", (e) => {
      const { paused, position } = e.payload;
      // Remove an interval that already existed.
      updateSeekbarPos(position, paused);
    })
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Song[], Duration]>(
      "queue-change",
      e => {
        const newQueue = e.payload[0];
        const syncedSongPos = e.payload[2];
        const newCurrSong = newQueue[0];
        if (newCurrSong) {
          setCurrentSong(newQueue[0]);
        } else {
          setCurrentSong(null);
        }
        console.log(syncedSongPos);
        console.log(syncedSongPos.secs + (syncedSongPos.nanos / 1000000000));
        setSongPos(syncedSongPos.secs + (syncedSongPos.nanos / 1000000000));
      },
    );

    getPlayerState()
      .then(playerState => {
        console.log(playerState);
        setSongPos(
          playerState.currentSongPos.secs
            + (playerState.currentSongPos.nanos / 1000000000),
        );
        if (playerState.songsQueue.length > 0) {
          setCurrentSong(playerState.songsQueue[0]);
        }

        if (!playerState.isPaused && playerState.songsQueue.length > 0) {
          updateSeekbarPos(playerState.currentSongPos, playerState.isPaused);
        }
      })
      .catch(e => console.error(e));

    return () => {
      eventPauseRes
        .then(f => f)
        .catch(e => console.log(e));
      unlistenQueue
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
    if (seekPos) {
      const mins = Math.floor(seekPos / 60).toString().padStart(2, "0");
      return mins;
    } else {
      return null;
    }
  }, [seekPos]);

  const seekPosSecs = useMemo(() => {
    if (seekPos) {
      const secs = Math.floor(seekPos % 60).toString().padStart(2, "0");
      return secs;
    } else {
      return null;
    }
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
    <div className="flex flex-row items-center w-full">
      {!(seekPosMins && seekPosSecs) && (
        <p className="w-16">
          {songPosMins ? songPosMins : "00"}:{songPosSecs
            ? songPosSecs
            : "00"}
        </p>
      )}
      {seekPosMins && seekPosSecs && (
        <p className="w-16">
          {seekPosMins}:{seekPosSecs}
        </p>
      )}
      <input
        id="seekbar-range"
        className="w-full flex-grow"
        type="range"
        disabled={currentSong === null}
        readOnly
        value={!songPos ? 0 : seekPos ? seekPos : songPos}
        max={!songDuration || Number.isNaN(songDuration) ? 0 : songDuration}
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
          setSeekPos(null);
        }}
      />
      <p className="w-16 text-end">
        {durationMins ? durationMins : "00"}:{durationSecs
          ? durationSecs
          : "00"}
      </p>
    </div>
  );
}
