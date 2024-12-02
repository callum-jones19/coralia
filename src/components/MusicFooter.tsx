import { Song } from "../types";
import PlayButtons from "./PlayButtons";
import Seekbar from "./Seekbar";
import VolumeController from "./VolumeController";

export interface MusicFooterProps {
  currentSong: Song | null;
}

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter(
  { currentSong }: MusicFooterProps,
) {
  return (
    <div className="bg-gray-950 basis-16 flex-shrink-0 pt-3 pb-3">
      <div className="flex flex-col justify-center h-full gap-2">
        <div className="flex flex-row mr-10 ml-10 justify-between">
          <PlayButtons />
          <div id="music-info" className="flex flex-col text-white text-center">
            <p className="font-bold">
              {currentSong ? currentSong.tags.title : "~"}
            </p>
            <p className="font-light">
              {currentSong ? currentSong.tags.artist : "~"}
            </p>
          </div>
          <VolumeController />
        </div>
        <Seekbar />
      </div>
    </div>
  );
}
