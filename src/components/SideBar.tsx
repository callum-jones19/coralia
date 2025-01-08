import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Volume1 } from "react-feather";
import { Link } from "react-router";
import { Song } from "../types";
import { Duration } from "@tauri-apps/api/http";

export default function SideBar() {
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      const newQueue = e.payload[0];
      setQueue(newQueue);
    });

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const imgSrc = queue[0]?.artwork?.art400
    ? convertFileSrc(queue[0]?.artwork?.art400)
    : undefined;

  return (
    <div className="w-72 bg-neutral-800 h-full flex-grow-0 flex-shrink-0 pr-2 pl-2">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <li className="flex flex-col gap-3 text-white flex-grow overflow-auto">
          {queue.length === 0 && <ul>Empty queue</ul>}
          {queue.map((song, index) => {
            const queueImgSrc = song.artwork?.thumbArt
              ? convertFileSrc(song.artwork?.thumbArt)
              : undefined;
            return (
              <ul
                key={`${song.filePath}-${index}`}
                className="flex flex-row gap-2 w-full items-center"
              >
                {index === 0 && <Volume1 size="1em" />}
                {index !== 0 && <p>{index}.</p>}
                <img
                  alt="album art"
                  src={queueImgSrc}
                  className="w-6 aspect-square"
                />
                <p>{song.tags.title}</p>
              </ul>
            );
          })}
        </li>
        <Link to="/home" className="bg-white rounded-sm text-center">
          Songs
        </Link>
        <Link to="/home/albums" className="bg-white rounded-sm text-center">
          Albums
        </Link>
        <div className="flex flex-col gap-3">
          {imgSrc && (
            <img
              alt="Currently playing song album art"
              src={imgSrc}
              className="w-full aspect-square rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
