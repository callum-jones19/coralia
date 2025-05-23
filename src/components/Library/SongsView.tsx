import { listen } from "@tauri-apps/api/event";
import { CSSProperties, memo, useEffect, useState } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types/types";
import SongListHeader from "../SongListHeader";
import SongListHeaderDense from "../SongListHeaderDense";
import SongListItem from "../SongListItem";
  import { enqueueSongsBackend } from "../../api/commands";
import { QueueUpdatePayload } from "../../types/apiTypes";

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
        <div style={style} className="hidden sm:block">
          <SongListHeader />
        </div>
        <div style={style} className="block sm:hidden">
          <SongListHeaderDense />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={style}
      >
        <SongListItem
          song={song}
          colored={false}
          currentlyPlayingId={data.currentlyPlayingId}
          showImage
          onPlaySong={() => {
            const nextSongs = data.songs.slice(index);
            console.log('Adding next songs to queue');
            console.log(nextSongs);

            enqueueSongsBackend(nextSongs).catch(e => console.error(e));
          }}
        />
      </div>
    </>
  );
}, areEqual);
Row.displayName = "SongRow";

export interface SongsViewProps {
  songs: Song[];
  emptyString?: string;
}

export default function SongsView({ songs, emptyString }: SongsViewProps) {
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    getPlayerState()
      .then(cachedState => setQueue(cachedState.songsQueue))
      .catch(e => console.error(e));

    const unlistenQueue = listen<QueueUpdatePayload>("queue-change", e => {
      console.log("queue changed");

      const newQueue = e.payload.newQueue;
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
