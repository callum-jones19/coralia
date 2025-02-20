import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types";
import QueueListItem from "./QueueListItem";
import BackgroundCard from "../UI/BackgroundCard";

export default function QueueBar() {
  const [isViewingQueue, setIsViewingQueue] = useState<boolean>(true);
  const [queue, setQueue] = useState<Song[]>([]);
  const [prevQueue, setPrevQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  const currentlyPlayingId = queue.length > 0 ? queue[0].id : null;

  useEffect(() => {
    getPlayerState()
      .then(cachedState => {
        console.log(cachedState);
        setQueue(cachedState.songsQueue);
        setPrevQueue(cachedState.prevSongsQueue);
      })
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Song[],Duration]>("queue-change", e => {
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
    <BackgroundCard className="hidden lg:block basis-60 h-full flex-grow-0 flex-shrink-0 overflow-hidden p-2">
      <div className="h-full flex flex-col gap-3 justify-between">
        <button
          onClick={() => setIsViewingQueue(!isViewingQueue)}
          className="text-start font-bold rounded-md flex flex-row gap-2 items-center"
        >

          {isViewingQueue ? 'Queue' : 'Playing History'}
        </button>
        {isViewingQueue &&
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && <i>Empty queue</i>}
            {queue.map((song, index) => (
              <QueueListItem key={index} song={song} index={index} currentlyPlayingId={currentlyPlayingId} />
              ))
            }
          </div>
        }
        {!isViewingQueue &&
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && prevQueue.length === 0 && <i>No Playing History</i>}
            {prevQueue.map((song, index) => (
              <QueueListItem key={index} song={song} index={index} currentlyPlayingId={currentlyPlayingId} />
              ))
            }
            {queue.map((song, index) => (
              <QueueListItem key={index} song={song} index={index + prevQueue.length} currentlyPlayingId={currentlyPlayingId} />
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
    </BackgroundCard>
  );
}
