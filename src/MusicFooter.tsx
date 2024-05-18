import { ChangeEvent, SyntheticEvent } from "react";

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
  /*
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const [songDuration, setSongDuration] = useState<number>(0);
  const [songPos, setSongPos] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const [intermediateSeek, setIntermediateSeek] = useState<number | null>(null);

  const seekbarInterval = useRef<number | null>(null);

  const songPosMins = useMemo(() => {
    const mins = Math.floor(songPos / 60).toString().padStart(2, '0');
    return mins;
  }, [songPos]);

  const songPosSecs = useMemo(() => {
    const secs = Math.floor(songPos % 60).toString().padStart(2, '0');
    return secs;
  }, [songPos]);

  const intermediateSeekMins = useMemo(() => {
    if (intermediateSeek === null) return -1;

    return Math.floor(intermediateSeek / 60).toString().padStart(2, '0');
  }, [intermediateSeek])

  const intermediateSeekSecs = useMemo(() => {
    if (intermediateSeek === null) return -1;

    return Math.floor(intermediateSeek % 60).toString().padStart(2, '0');
  }, [intermediateSeek])

  const durationMins = useMemo(() => {
    const mins = Math.floor(songDuration / 60).toString().padStart(2, '0');
    return mins;
  }, [songDuration]);

  const durationSecs = useMemo(() => {
    const secs = Math.floor(songDuration % 60).toString().padStart(2, '0');
    return secs;
  }, [songDuration]);

  */

  /**
   * When the audio player is connected
  */

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
              onClick={() => setSongPos(0)}
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
          {/* {intermediateSeek === null &&
            <p className="text-white">{songPosMins}:{songPosSecs}</p>
          }
          {intermediateSeek !== null &&
            <p className="text-white">{intermediateSeekMins}:{intermediateSeekSecs}</p>
          } */}
          <input
            className="w-full ml-5 mr-5 bg-transparent"
            type="range"
            readOnly
            value={songPos}
            max={songDuration}
          />
          <p className="text-white">{songDuration}</p>
        </div>
      </div>
    </div>
  )
}