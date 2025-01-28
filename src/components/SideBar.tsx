import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Song } from "../types";
import { Duration } from "@tauri-apps/api/http";
import { getPlayerState } from "../api/importer";
import QueueListItem from "./QueueListItem";

export default function SideBar() {
  const [queue, setQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

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
    <div className="basis-1/12 bg-neutral-800 h-full pr-2 pl-2">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <h2 className="font-bold">Queue</h2>
        <li className="flex flex-col gap-3 flex-grow overflow-auto">
          {queue.length === 0 && <ul>Empty queue</ul>}
          {queue.map((song, index) => <QueueListItem key={index} song={song} index={index} />)}
        </li>
        <Link to="/home" className="bg-neutral-700 rounded-sm text-center">
          Songs
        </Link>
        <Link to="/home/albums" className="bg-neutral-700 rounded-sm text-center">
          Albums
        </Link>
        <Link to="/settings" className="bg-neutral-700 rounded-sm text-center">
          Settings
        </Link>
        <div className="flex flex-col gap-3">
          {imgSrc && (
            <img
              alt="Currently playing song album art"
              src={imgSrc}
              className="w-full aspect-square rounded-lg hover:cursor-pointer"
              onClick={() => {
                const navRes = navigate(`album/${queue[0].album}`);
                if (navRes) {
                  navRes.catch(e => console.error(e));
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
