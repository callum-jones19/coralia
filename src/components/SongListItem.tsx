import { useState } from "react";

export interface SongListItemProps {
  albumName: string;
  artistName: string;
  songName: string;
  onClick: () => void;
}

export default function SongListItem ({ albumName, artistName, songName, onClick }: SongListItemProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className={isHovering ? "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 bg-gray-100 items-center" : "flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 items-center"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={songName}>{songName}</p> */}
      <div className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink flex flex-row items-center">
        <button className="mr-2 bg-gray-300 p-2 pt-1 pb-1 rounded-md" onClick={onClick}>Play</button>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={songName}>{songName}</p>
      </div>
      <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={albumName}>{albumName}</p>
      <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={artistName}>{artistName}</p>
    </div>
  )
}