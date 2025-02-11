import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPlayerState } from "../api/importer";
import { Song } from "../types";
import QueueListItem from "./QueueListItem";

export default function QueueBar() {
  const [isViewingQueue, setIsViewingQueue] = useState<boolean>(true);
  const [queue, setQueue] = useState<Song[]>([]);
  const [prevQueue, setPrevQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayerState()
      .then(cachedState => {
        console.log(cachedState);
        setQueue(cachedState.songsQueue);
        setPrevQueue(cachedState.prevSongsQueue);
      })
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Song[],Duration]>("queue-change", e => {
      console.log(e.payload);
      const newQueue = e.payload[0];
      const newPrev = e.payload[1];
      setQueue(newQueue);
      setPrevQueue(newPrev);
    });

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const imgSrc = queue[0]?.artwork?.art400
    ? convertFileSrc(queue[0]?.artwork?.art400)
    : undefined;

  return (
    <div className="basis-52 h-full flex-grow-0 flex-shrink-0 rounded-md bg-neutral-100 p-2 overflow-hidden">
      <div className="h-full flex flex-col gap-3 justify-between">
        <button
          onClick={() => setIsViewingQueue(!isViewingQueue)}
          className="text-start font-bold bg-white p-1 rounded-md pl-2"
        >

          {isViewingQueue ? 'Queue' : 'Playing History'}
        </button>
        {isViewingQueue &&
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && <i>Empty queue</i>}
            {queue.map((song, index) => (
              <QueueListItem key={index} song={song} index={index} />
              ))
            }
          </div>
        }
        {!isViewingQueue &&
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && prevQueue.length === 0 && <i>No Playing History</i>}
            {prevQueue.map((song, index) => (
              <QueueListItem key={index} song={song} />
              ))
            }
            {queue.map((song, index) => (
              <QueueListItem key={index} song={song} index={index} />
              ))
            }
          </div>
        }
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
