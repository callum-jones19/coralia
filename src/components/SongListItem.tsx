import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Song } from "../data/types";

export interface SongListItemProps {
  song: Song;
  onClick: () => void;
  isPlaying: boolean;
  onDoubleClick: () => void;
}

export default function SongListItem(
  { song, onClick, isPlaying, onDoubleClick }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const tmpSrc = song.tags.encodedCoverArt
    ? convertFileSrc(song.tags.encodedCoverArt)
    : undefined;

  return (
    <div
      className={isHovering
        ? (isPlaying
          ? "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 bg-green-500 items-center"
          : "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 bg-gray-100 items-center")
        : (isPlaying
          ? "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 bg-green-400 items-center"
          : "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 items-center")}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={onDoubleClick}
    >
      {/* <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={songName}>{songName}</p> */}
      <div className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink flex flex-row items-center gap-1">
        <img alt="album art" src={tmpSrc} className="h-10 aspect-square" />
        <button
          className="mr-2 bg-gray-300 p-2 pt-1 pb-1 rounded-md"
          onClick={onClick}
        >
          Play
        </button>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
          title={song.tags.title}
        >
          {song.tags.title}
        </p>
      </div>
      <p
        className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
        title={song.tags.album}
      >
        {song.tags.album}
      </p>
      <p
        className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
        title={song.tags.artist}
      >
        {song.tags.artist}
      </p>
      <p
        className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
        title={song.tags.album_artist}
      >
        {song.tags.album_artist}
      </p>
    </div>
  );
}
