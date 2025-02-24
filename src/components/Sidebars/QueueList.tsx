import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { getPlayerState } from "../../api/importer";
import { Duration, Song } from "../../types";
import QueueListItem from "./QueueListItem";
import { Repeat } from "react-feather";

export default function QueueList() {
  const [isViewingQueue, setIsViewingQueue] = useState<boolean>(true);

  const [queue, setQueue] = useState<Song[]>([]);
  const [prevQueue, setPrevQueue] = useState<Song[]>([]);

  useEffect(() => {
    getPlayerState()
      .then(cachedState => {
        console.log(cachedState);
        setQueue(cachedState.songsQueue);
        setPrevQueue(cachedState.prevSongsQueue);
      })
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Song[], Duration]>(
      "queue-change",
      e => {
        const newQueue = e.payload[0];
        const newPrev = e.payload[1];
        setQueue(newQueue);
        setPrevQueue(newPrev);
      },
    );

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);
  const currentlyPlayingId = queue.length > 0 ? queue[0].id : null;

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        className="text-start flex justify-between gap-2 items-center mb-2 w-full"
      >
        <button
          onClick={() => setIsViewingQueue(true)}
          className={`${isViewingQueue ? "font-bold" : ""}`}
          disabled={isViewingQueue}
        >
          Queue
        </button>
        <button
          onClick={() => setIsViewingQueue(false)}
          className={`${!isViewingQueue ? "font-bold" : ""}`}
          disabled={!isViewingQueue}
        >
          Playing History
        </button>
      </div>
      {isViewingQueue
        && (
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && <i>Empty queue</i>}
            {queue.map((song, index) => (
              <QueueListItem
                removable
                key={index}
                song={song}
                index={index}
                currentlyPlayingId={currentlyPlayingId}
              />
            ))}
          </div>
        )}
      {!isViewingQueue
        && (
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && prevQueue.length === 0 && (
              <i>No Playing History</i>
            )}
            {prevQueue.map((song, index) => (
              <QueueListItem
                key={index}
                song={song}
                index={index}
                currentlyPlayingId={currentlyPlayingId}
              />
            ))}
            {queue.map((song, index) => (
              <QueueListItem
                removable
                key={index}
                song={song}
                index={index + prevQueue.length}
                currentlyPlayingId={currentlyPlayingId}
              />
            ))}
          </div>
        )}
    </div>
  );
}
