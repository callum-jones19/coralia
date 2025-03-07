import { listen } from "@tauri-apps/api/event";
import { CSSProperties, memo, useEffect, useMemo, useState } from "react";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types/types";
import { areEqual, FixedSizeList } from "react-window";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import QueueListItem from "./QueueListItem";
import { QueueUpdatePayload } from "../../types/apiTypes";

interface ListData {
  songs: Song[];
  currentPlayingId: number | null;
}

interface RowProps {
  data: ListData;
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  const song = data.songs[index];

  return (
    <>
      <div
        style={style}
      >
        <QueueListItem
          song={song}
          currentlyPlayingId={null}
          index={index}
        />
      </div>
    </>
  );
}, areEqual);
Row.displayName = "SongRow";

export default function QueueList() {
  const [isViewingQueue, setIsViewingQueue] = useState<boolean>(true);

  const [queue, setQueue] = useState<Song[]>([]);
  const [prevQueue, setPrevQueue] = useState<Song[]>([]);

  const combinedList = useMemo(() => {
    const res = prevQueue.concat(queue);
    return res;
  }, [prevQueue, queue]);

  useEffect(() => {
    getPlayerState()
      .then(cachedState => {
        console.log(cachedState);
        setQueue(cachedState.songsQueue);
        setPrevQueue(cachedState.prevSongsQueue);
      })
      .catch(e => console.error(e));

    const unlistenQueue = listen<QueueUpdatePayload>(
      "queue-change",
      e => {
        const newQueue = e.payload.newQueue;
        const newPrev = e.payload.newPrevious;
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
          className={`${isViewingQueue ? "font-bold border-b-2 border-solid border-neutral-200" : ""} flex-grow`}
          disabled={isViewingQueue}
        >
          Queue
        </button>
        <button
          onClick={() => setIsViewingQueue(false)}
          className={`${!isViewingQueue ? "font-bold  border-b-2 border-solid border-neutral-200" : ""} flex-grow`}
          disabled={!isViewingQueue}
        >
          Playing History
        </button>
      </div>
      {isViewingQueue
        && (
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && <i>Empty queue</i>}
            {queue.length > 0 &&
              <ReactVirtualizedAutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    height={height}
                    width={width}
                    itemData={{ songs: queue, currentPlayingId: currentlyPlayingId }}
                    itemCount={queue.length}
                    itemSize={44}
                    overscanCount={5}
                  >
                    {Row}
                  </FixedSizeList>
                )}
              </ReactVirtualizedAutoSizer>
            }
          </div>
        )}
      {!isViewingQueue
        && (
          <div className="h-full w-full overflow-auto flex flex-col gap-2">
            {queue.length === 0 && prevQueue.length === 0 && (
              <i>No Playing History</i>
            )}
            <ReactVirtualizedAutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemData={{ songs: combinedList, currentPlayingId: currentlyPlayingId }}
                  itemCount={combinedList.length}
                  itemSize={44}
                  overscanCount={5}
                >
                  {Row}
                </FixedSizeList>
              )}
            </ReactVirtualizedAutoSizer>
          </div>
        )}
    </div>
  );
}
