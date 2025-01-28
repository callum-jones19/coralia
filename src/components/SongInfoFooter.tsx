import { Song } from "../types";

export interface SongInfoFooterProps {
  currentSong: Song | null;
}

export default function SongInfoFooter({ currentSong }: SongInfoFooterProps) {
  return (
    <>
      <div id="music-info" className="flex flex-col text-center">
        <p className="font-bold">
          {currentSong
            ? (currentSong.tags.title ? currentSong.tags.title : "N/A")
            : "~"}
        </p>
        <p className="font-light">
          {currentSong
            ? (currentSong.tags.artist !== null
              ? currentSong.tags.artist
              : "N/A")
            : "~"}
        </p>
      </div>
    </>
  );
}
