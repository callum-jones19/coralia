import { ChangeEvent, useEffect, useRef, useState } from "react";
import Seekbar from "./Seekbar";

export default function MusicFooter() {
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const [songDuration, setSongDuration] = useState<number>(330);
  const [songPos, setSongPos] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);



  /**
   * When the audio player is connected (or changed)
   */
  useEffect(() => {
    if (audioPlayer.current === null) return;

    setIsPlaying(!audioPlayer.current.paused);
    setSongPos(audioPlayer.current.currentTime);
  }, [audioPlayer]);

  const toggleSong = () => {
    if (audioPlayer.current === null) return;
    console.log('test');

    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
      console.log(1);
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="bg-gray-700 basis-36">
      <div className="flex flex-col justify-center h-full gap-3">
        <div className="flex flex-row mr-10 ml-10 justify-center">
          <button className="bg-white mr-3 p-2 font-bold">&lt;</button>
          <button
            className="bg-white p-2 pr-4 pl-4 font-bold"
            onClick={toggleSong}
          >P</button>
          <button className="bg-white ml-3 p-2 font-bold">&gt;</button>
        </div>
        <div className="flex flex-row mr-10 ml-10">
          <audio
            src="/music/protocol.mp3"
            ref={audioPlayer}
            controls
          />
          <p className="text-white">0:00</p>
          <input
            className="w-full ml-5 mr-5 bg-transparent "
            type="range"
            readOnly
            value={songPos}
            max={songDuration}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);
              const newSongPos = parseFloat(e.target.value);
              setSongPos(newSongPos);
            }}
          />
          <p className="text-white">{songDuration}</p>
        </div>
      </div>
    </div>
  )
}