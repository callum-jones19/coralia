import { useState } from "react";

export interface SongListItemProps {
  albumName: string;
  artistName: string;
  songName: string;
}

export default function SongListItem ({ albumName, artistName, songName }: SongListItemProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className={isHovering ? "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 bg-gray-100" : "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={songName}>{songName}</p>
      <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={albumName}>{albumName}</p>
      <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={artistName}>{artistName}</p>
    </div>
  )
}