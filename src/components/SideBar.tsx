import { Link } from "react-router-dom";
import { Song } from "../data/types";

export interface SideBarProps {
  queueSongs: Song[];
}

export default function SideBar({ queueSongs }: SideBarProps) {
  return (
    <div className="w-56 bg-gray-950 h-full flex-grow-0 flex-shrink-0">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <li className="flex flex-col gap-3 text-white flex-grow overflow-auto">
          {queueSongs.length === 0 && <ul>Empty queue</ul>}
          {queueSongs.map((song, index) => (
            <ul key={`${song.filePath}-${index}`}>{song.tags.title}</ul>
          ))}
        </li>
        <Link
          className="bg-white ml-2 mr-2 p-1 text-center rounded-sm"
          to={"/settings"}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}
