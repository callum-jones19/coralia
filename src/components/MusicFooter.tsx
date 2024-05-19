import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";

export interface MusicFooterProps {
  currSongName: string;
  currSongArtist: string;
  toggleAudioPlaying: () => void;
  setSongPos: (newPos: number) => void;
  songPos: number;
  isPlaying: boolean;
  songDuration: number;
  volume: number;
  setVolume: (newVol: number) => void;
}

export default function MusicFooter({ songDuration, currSongArtist, currSongName, toggleAudioPlaying, setSongPos, isPlaying, volume, setVolume, songPos }: MusicFooterProps) {
  const [seekPos, setSeekPos] = useState<number>(0);
  // FIXME
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  const songPosMins = useMemo(() => {
    const mins = Math.floor(songPos / 60).toString().padStart(2, '0');
    return mins;
  }, [songPos]);

  const songPosSecs = useMemo(() => {
    const secs = Math.floor(songPos % 60).toString().padStart(2, '0');
    return secs;
  }, [songPos]);

  const seekPosMins = useMemo(() => {
    const mins = Math.floor(seekPos / 60).toString().padStart(2, '0');
    return mins;
  }, [seekPos]);

  const seekPosSecs = useMemo(() => {
    const secs = Math.floor(seekPos % 60).toString().padStart(2, '0');
    return secs;
  }, [seekPos]);

  const durationMins = useMemo(() => {
    const mins = Math.floor(songDuration / 60).toString().padStart(2, '0');
    return mins;
  }, [songDuration]);

  const durationSecs = useMemo(() => {
    const secs = Math.floor(songDuration % 60).toString().padStart(2, '0');
    return secs;
  }, [songDuration]);


  return (
    <div className="bg-gray-700 basis-36 flex-shrink-0">
      <div className="flex flex-col justify-center h-full gap-3">
        <audio onDurationChange={(e: SyntheticEvent<HTMLAudioElement, Event>) => {
          console.log(e);
        }} />
        <div className="flex flex-row mr-10 ml-10 justify-between">
          <div id="play-controls" className="flex flex-row items-center">
            <button
              className="bg-white mr-3 p-2 font-bold"
              onClick={() => {
                if (songPos < 2) {
                  console.log('go back a song in the queue');
                } else {
                  setSongPos(0);
                }
              }}
            >
              &lt;
            </button>
            <button
              className="bg-white p-2 pr-4 pl-4 font-bold"
              onClick={() => {
                toggleAudioPlaying();
              }}
            >
              {!isPlaying && <p>⏵︎</p>}
              {isPlaying && <p>⏸︎</p>}
            </button>
            <button
              className="bg-white ml-3 p-2 font-bold"
              onClick={() => setSongPos(songDuration)}
            >
              &gt;
            </button>
          </div>
          <div id="music-info" className="flex flex-col text-white text-center">
            <p className="font-bold">{currSongArtist}</p>
            <p className="font-light">{currSongName}</p>
          </div>
          <div id="volume" className="flex flex-row gap-2">
            <p className="self-center">🔊</p>
            <input
              className=""
              type="range"
              readOnly
              value={volume}
              step={0.01}
              max={1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row mr-10 ml-10">
          {!isSeeking && <p className="text-white">{songPosMins}:{songPosSecs}</p>}
          {isSeeking && <p className="text-white">{seekPosMins}:{seekPosSecs}</p>}
          <input
            id="seekbar-range"
            className="w-full ml-5 mr-5 bg-transparent"
            type="range"
            readOnly
            value={(seekPos && isSeeking) ? seekPos : songPos}
            max={songDuration}
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
  )
}