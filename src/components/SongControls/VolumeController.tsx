import { ChangeEvent, useEffect, useState } from "react";
import { Volume1, Volume2, VolumeX } from "react-feather";
import { getPlayerState } from "../../api/importer";
import { setVolumeBackend } from "../../api/commands";

export default function VolumeController() {
  const [volume, setVolume] = useState<number>(23);
  const [isClicked, setIsClicked] = useState<boolean>(false);


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
    <div id="volume" className="flex flex-row gap-2 items-center p-1 relative">
      <button
        onClick={() => setIsClicked(!isClicked)}
        onBlur={() => setIsClicked(false)}
        className="block md:hidden"
      >
        {volume >= 50 && <Volume2 />}
        {volume < 50 && volume > 0 && <Volume1 />}
        {volume === 0 && <VolumeX />}
      </button>
      <div className="hidden md:block">
        {volume >= 50 && <Volume2 />}
        {volume < 50 && volume > 0 && <Volume1 />}
        {volume === 0 && <VolumeX />}
      </div>
      {isClicked &&
        <div className="bg-neutral-900 h-40 w-full absolute bottom-10 right-1 flex flex-row justify-center p-2 rounded-md">
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
            style={{ writingMode: 'sideways-lr' }}
          />
        </div>
      }
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
        className="hidden md:block"
      />
    </div>
  );
}
