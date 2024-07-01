import { Link } from "react-router-dom";
import { Song } from "../data/types";
import { convertFileSrc } from "@tauri-apps/api/tauri";

export interface SideBarProps {
  queueSongs: Song[];
  currSongAlbumUri: string | undefined;
}

export default function SideBar({ queueSongs, currSongAlbumUri }: SideBarProps) {
  const tmpSrc = currSongAlbumUri ? convertFileSrc(currSongAlbumUri) : undefined;

  return (
    <div className="w-72 bg-gray-950 h-full flex-grow-0 flex-shrink-0">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <li className="flex flex-col gap-3 text-white flex-grow overflow-auto">
          {queueSongs.length === 0 && <ul>Empty queue</ul>}
          {queueSongs.map((song, index) => (
            <ul key={`${song.filePath}-${index}`}>{song.tags.title}</ul>
          ))}
        </li>
        <div className="flex flex-col">
          {tmpSrc &&
            <img
              alt="Currently playing song album art"
              src={tmpSrc}
              className="w-full aspect-square rounded-md p-2"
            />
          }
          <Link
            className="bg-white ml-2 mr-2 p-1 text-center rounded-sm"
            to={"/settings"}
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
