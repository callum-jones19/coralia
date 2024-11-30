import { ChangeEvent, useMemo, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "react-feather";
import { Song } from "../types";
import { setVolumeBackend, skipOneSong } from "../api/commands";

export interface MusicFooterProps {
  onUpdatePause: (isPaused: boolean) => void;
  isPaused: boolean;
  currentSong: Song | null;
}

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter({ isPaused, onUpdatePause, currentSong }: MusicFooterProps) {
  // Volume stuff - move later
  const [volume, setVolume] = useState<number>(1);


  const [seekPos, setSeekPos] = useState<number>(0);
  // FIXME
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [songPos, setSongPos] = useState<number | null>(null);

  console.log(currentSong);

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
    <div className="bg-gray-950 basis-16 flex-shrink-0 pt-3 pb-3">
      <div className="flex flex-col justify-center h-full gap-2">
        <div className="flex flex-row mr-10 ml-10 justify-between">
          <div id="play-controls" className="flex flex-row items-center">
            <button
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
              onClick={() => console.log("todo")}
            >
              <SkipBack className="m-auto h-1/2 w-1/2" />
            </button>
            <button
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
              onClick={() => {
                if (isPaused) {
                  onUpdatePause(false);
                } else {
                  onUpdatePause(true);
                }
              }}
            >
              {isPaused && <Play className="m-auto h-1/2 w-1/2" />}
              {!isPaused && <Pause className="m-auto h-1/2 w-1/2" />}
            </button>
            <button
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
              onClick={() => skipOneSong()}
            >
              <SkipForward className="m-auto h-1/2 w-1/2" />
            </button>
          </div>
          <div id="music-info" className="flex flex-col text-white text-center">
            <p className="font-bold">{currentSong ? currentSong.tags.title : "~"}</p>
            <p className="font-light">{currentSong ? currentSong.tags.artist : "~"}</p>
          </div>
          <div id="volume" className="flex flex-row gap-2 items-center">
            {volume >= 50 && <Volume2 color="white"/>}
            {volume < 50 && volume > 0 && <Volume1 color="white"/>}
            {volume === 0 && <VolumeX color="white"/>}
            <input
              id="volume-slider"
              type="range"
              defaultValue={volume}
              step={1}
              max={100}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                setVolumeBackend(newVol);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row mr-10 ml-10">
          {!isSeeking && (
            <p className="text-white">{songPosMins ? songPosMins : "00"}:{songPosSecs ? songPosSecs : "00"}</p>
          )}
          {isSeeking && (
            <p className="text-white">{seekPosMins ? seekPosMins : "00"}:{seekPosSecs ? seekPosSecs : "00"}</p>
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
          <p className="text-white">{durationMins}:{durationSecs}</p>
        </div>
      </div>
    </div>
  );
}
