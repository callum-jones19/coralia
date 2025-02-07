import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { CSSProperties, memo, useEffect, useState } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { getPlayerState } from "../api/importer";
import { Song } from "../types";
import SongListHeader from "./SongListHeader";
import SongListItem from "./SongListItem";

interface SongListData {
  songs: Song[];
  currentlyPlayingId: number | undefined;
}

interface RowProps {
  data: SongListData;
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  const song = data.songs[index - 1];

  if (index === 0) {
    return (
      <>
        <div style={style}>
          <SongListHeader />
        </div>
      </>
    );
  }

  return (
    <div
      style={style}
      // className="[&_*]:outline-green-300 [&_*]:outline [&_*]:outline-2"
    >
      <SongListItem
        song={song}
        colored={false}
        currentlyPlayingId={data.currentlyPlayingId}
        showImage
      />
    </div>
  );
}, areEqual);
Row.displayName = "SongRow";

export interface SongListProps {
  songs: Song[];
  emptyString?: string;
}

export default function SongList({ songs, emptyString }: SongListProps) {
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      console.log("queue changed");

      const newQueue = e.payload[0];
      setQueue(newQueue);
    });

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const data: SongListData = {
    currentlyPlayingId: queue[0] ? queue[0].id : undefined,
    songs: songs,
  };

  return (
    <div className="basis-1/2 flex-grow h-full flex flex-col">
      {songs.length > 0 && (
          <div className="basis-full relative">
          <ReactVirtualizedAutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemData={data}
                itemCount={songs.length + 1}
                itemSize={60}
                overscanCount={5}
              >
                {Row}
              </FixedSizeList>
            )}
          </ReactVirtualizedAutoSizer>
        </div>
      )}
      {songs.length === 0 && (
        <div className="h-full w-full flex flex-col justify-center">
          <p className="w-fit ml-auto mr-auto">
            {!emptyString && <i>Song library empty...</i>}
            {emptyString && <i>{emptyString}</i>}
          </p>
        </div>
      )}
    </div>
  );
}
