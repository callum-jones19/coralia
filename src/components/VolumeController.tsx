import { ChangeEvent, useEffect, useState } from "react";
import { Volume1, Volume2, VolumeX } from "react-feather";
import { setVolumeBackend } from "../api/commands";
import { getPlayerState } from "../api/importer";

export default function VolumeController() {
  const [volume, setVolume] = useState<number>(23);

  useEffect(() => {
    console.log("Loading volume elem");
    getPlayerState()
      .then(playerState => {
        console.log("getting init state for volume");
        console.log(playerState.currentVolume);
        const initVol = Math.floor(playerState.currentVolume * 100);
        console.log(initVol);
        setVolume(initVol);
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div id="volume" className="flex flex-row gap-2 items-center p-1">
      <button>
        {volume >= 50 && <Volume2 />}
        {volume < 50 && volume > 0 && <Volume1 />}
        {volume === 0 && <VolumeX />}
      </button>
      <input
        id="volume-slider"
        type="range"
        value={volume}
        readOnly
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
