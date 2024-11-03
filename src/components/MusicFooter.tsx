import { ChangeEvent, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "react-feather";

export interface MusicFooterProps {
  onUpdatePause: (isPaused: boolean) => void;
  isPaused: boolean;
  onClickSkip: () => void;
}

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter({ isPaused, onUpdatePause, onClickSkip }: MusicFooterProps) {
  const [seekPos, setSeekPos] = useState<number>(0);
  // FIXME
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // const songPosMins = useMemo(() => {
  //   const mins = Math.floor(songPos / 60).toString().padStart(2, "0");
  //   return mins;
  // }, [songPos]);

  // const songPosSecs = useMemo(() => {
  //   const secs = Math.floor(songPos % 60).toString().padStart(2, "0");
  //   return secs;
  // }, [songPos]);

  // const seekPosMins = useMemo(() => {
  //   const mins = Math.floor(seekPos / 60).toString().padStart(2, "0");
  //   return mins;
  // }, [seekPos]);

  // const seekPosSecs = useMemo(() => {
  //   const secs = Math.floor(seekPos % 60).toString().padStart(2, "0");
  //   return secs;
  // }, [seekPos]);

  // const durationMins = useMemo(() => {
  //   const mins = Math.floor(songDuration / 60).toString().padStart(2, "0");
  //   return mins;
  // }, [songDuration]);

  // const durationSecs = useMemo(() => {
  //   const secs = Math.floor(songDuration % 60).toString().padStart(2, "0");
  //   return secs;
  // }, [songDuration]);

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
              onClick={onClickSkip}
            >
              <SkipForward className="m-auto h-1/2 w-1/2" />
            </button>
          </div>
          <div id="music-info" className="flex flex-col text-white text-center">
            <p className="font-bold">TODO</p>
            <p className="font-light">TODO</p>
          </div>
          <div id="volume" className="flex flex-row gap-2 items-center">
            <Volume2 color="white"/>
            <input
              id="volume-slider"
              type="range"
              readOnly
              // value={volume}
              step={0.01}
              max={1}
              // onChange={(e: ChangeEvent<HTMLInputElement>) => {
              //   const newVol = parseFloat(e.target.value);
              //   setVolume(newVol);
              // }}
            />
          </div>
        </div>
        {/* <div className="flex flex-row mr-10 ml-10">
          {!isSeeking && (
            <p className="text-white">{songPosMins}:{songPosSecs}</p>
          )}
          {isSeeking && (
            <p className="text-white">{seekPosMins}:{seekPosSecs}</p>
          )}
          <input
            id="seekbar-range"
            className="w-full ml-5 mr-5 bg-transparent"
            type="range"
            readOnly
            value={(seekPos && isSeeking) ? seekPos : songPos}
            max={Number.isNaN(songDuration) ? 0 : songDuration}
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
        </div> */}
      </div>
    </div>
  );
}
