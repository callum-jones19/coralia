import { Song } from "../../types";

export interface CurrentSongInfoProps {
  currentSong: Song | null;
}

export default function CurrentSongInfo({ currentSong }: CurrentSongInfoProps) {
  return (
    <>
      <div id="music-info" className="flex flex-col text-center flex-grow h-14">
        <p className="font-bold">
          {currentSong
            ? (currentSong.tags.title ? currentSong.tags.title : "N/A")
            : ""}
        </p>
        <p>
          {currentSong
            ? (currentSong.tags.artist !== null
              ? currentSong.tags.artist
              : "N/A")
            : ""}
        </p>
      </div>
    </>
  );
}
