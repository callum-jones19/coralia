import { ChangeEvent, useEffect, useState } from "react";
import { Maximize2, Volume1, Volume2, VolumeX } from "react-feather";
import { setVolumeBackend } from "../api/commands";
import { getPlayerState } from "../api/importer";
import { Link } from "react-router";

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
      {volume >= 50 && <Volume2 color="white" />}
      {volume < 50 && volume > 0 && <Volume1 color="white" />}
      {volume === 0 && <VolumeX color="white" />}
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
      <Link to={"/fullscreen"} className="flex-grow-0">
        <Maximize2 size="1em" />
      </Link>
    </div>
  );
}
