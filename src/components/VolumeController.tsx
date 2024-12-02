import { ChangeEvent, useState } from "react";
import { Volume1, Volume2, VolumeX } from "react-feather";
import { setVolumeBackend } from "../api/commands";

export default function VolumeController() {
  const [volume, setVolume] = useState<number>(1);
  return (
    <div id="volume" className="flex flex-row gap-2 items-center">
      {volume >= 50 && <Volume2 color="white" />}
      {volume < 50 && volume > 0 && <Volume1 color="white" />}
      {volume === 0 && <VolumeX color="white" />}
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
  );
}
