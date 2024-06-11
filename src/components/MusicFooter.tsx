import { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from "react";

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

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter({ songDuration, currSongArtist, currSongName, toggleAudioPlaying, setSongPos, isPlaying, volume, setVolume, songPos }: MusicFooterProps) {
  const [seekPos, setSeekPos] = useState<number>(0);
  // FIXME
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  /**
   * Setup global keybinds for the bar
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === ' ') {
        toggleAudioPlaying();
      }
    }

    console.log('test');
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    }
  }, [toggleAudioPlaying]);

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
    <div className="bg-gray-950 basis-16 flex-shrink-0 pt-3 pb-3">
      <div className="flex flex-col justify-center h-full gap-2">
        <audio onDurationChange={(e: SyntheticEvent<HTMLAudioElement, Event>) => {
          console.log(e);
        }} />
        <div className="flex flex-row mr-10 ml-10 justify-between">
          <div id="play-controls" className="flex flex-row items-center">
            <button
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
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
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
              onClick={() => {
                toggleAudioPlaying();
              }}
            >
              {!isPlaying && <p>⏵︎</p>}
              {isPlaying && <p>⏸︎</p>}
            </button>
            <button
              className="bg-white mr-3 font-bold rounded-full aspect-square h-10"
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
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="self-center">
              <path d="M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              id="volume-slider"
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
        </div>
      </div>
    </div>
  )
}