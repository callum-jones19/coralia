import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Volume1, Volume2, VolumeX } from "react-feather";
import { setVolumeBackend } from "../../api/commands";
import { getPlayerState } from "../../api/importer";

export default function VolumeController() {
  const [volume, setVolume] = useState<number>(23);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const blurTimeout = useRef<number | null>(null);

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
    <div
      id="volume"
      className="flex flex-row gap-2 items-center p-1 relative"
    >
      <button
        onClick={() => setIsClicked(!isClicked)}
        className="block lg:hidden"
        title={`Volume: ${volume}%`}
      >
        {volume >= 50 && <Volume2 />}
        {volume < 50 && volume > 0 && <Volume1 />}
        {volume === 0 && <VolumeX />}
      </button>
      <div className="hidden lg:block">
        {volume >= 50 && <Volume2 />}
        {volume < 50 && volume > 0 && <Volume1 />}
        {volume === 0 && <VolumeX />}
      </div>
      {isClicked
        && (
          <div
            className="lg:hidden bg-white shadow-md dark:bg-neutral-900 h-fit w-fit absolute bottom-10 right-1 flex flex-row justify-center p-2 rounded-md"
            onBlur={() => {
              blurTimeout.current = window.setTimeout(() => {
                setIsClicked(false);
              }, 0);
            }}
            onFocus={() => {
              if (blurTimeout.current) {
                window.clearTimeout(blurTimeout.current);
              }
            }}
          >
            <input
              id="volume-slider-popup"
              type="range"
              value={volume}
              readOnly
              autoFocus
              step={1}
              max={100}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                setVolumeBackend(newVol).catch(e => console.error(e));
              }}
              className="p-1"
            />
          </div>
        )}
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
          setVolumeBackend(newVol).catch(e => console.error(e));
        }}
        className="hidden lg:block"
      />
    </div>
  );
}
