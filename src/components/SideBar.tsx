import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Volume1 } from "react-feather";
import { Link } from "react-router-dom";
import { Song } from "../types";

export interface SideBarProps {
  queueSongs: Song[];
  currSongAlbumUri: string | undefined;
}

export default function SideBar(
  { queueSongs, currSongAlbumUri }: SideBarProps,
) {
  const tmpSrc = currSongAlbumUri
    ? convertFileSrc(currSongAlbumUri)
    : undefined;

  return (
    <div className="w-72 bg-gray-950 h-full flex-grow-0 flex-shrink-0 pr-2 pl-2">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <li className="flex flex-col gap-3 text-white flex-grow overflow-auto">
          {queueSongs.length === 0 && <ul>Empty queue</ul>}
          {queueSongs.map((song, index) => {
            return (
              <ul
                key={`${song.filePath}-${index}`}
                className="flex flex-row gap-2 w-full items-center"
              >
                {index === 0 && <Volume1 size={18} />}
                {index !== 0 && <p>{index}.</p>}
                {/* <img alt="album art" src={tmp} className="w-6 aspect-square" /> */}
                <p>{song.tags.title}</p>
              </ul>
            );
          })}
        </li>
        <div className="flex flex-col gap-3">
          {tmpSrc
            && (
              <img
                alt="Currently playing song album art"
                src={tmpSrc}
                className="w-full aspect-square rounded-lg"
              />
            )}
          <Link
            className="bg-white p-1 text-center rounded-sm"
            to={"/settings"}
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
