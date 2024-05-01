import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Seekbar() {
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

    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="flex flex-row mr-10 ml-10">
      <audio
        src="/music/protocol.mp3"
        ref={audioPlayer}
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
  );
}