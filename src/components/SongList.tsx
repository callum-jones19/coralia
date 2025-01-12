import { CSSProperties, memo, useEffect, useState } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { getLibrarySongs, getPlayerState } from "../api/importer";
import { Song } from "../types";
import SongListItem from "./SongListItem";
import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";

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
  const song = data.songs[index];

  return (
    <div
      style={style}
      // className="[&_*]:outline-green-300 [&_*]:outline [&_*]:outline-2"
    >
      <SongListItem
        song={song}
        colored={index % 2 === 0}
        currentlyPlayingId={data.currentlyPlayingId}
        showImage
      />
    </div>
  );
}, areEqual);
Row.displayName = "SongRow";

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    getLibrarySongs()
      .then(libSongs => {
        setSongs(libSongs);
      })
      .catch(e => console.error(e));

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
    }

  }, []);

  const data: SongListData = {
    currentlyPlayingId: queue[0] ? queue[0].id : undefined,
    songs: songs
  }

  return (
    <>
      {songs.length > 0 && (
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemCount={songs.length}
              itemSize={60}
              width={width}
              itemData={data}
              overscanCount={5}
            >
              {Row}
            </FixedSizeList>
          )}
        </ReactVirtualizedAutoSizer>
      )}
      {songs.length === 0 && (
        <div className="h-full w-full flex flex-col justify-center">
          <p className="w-fit ml-auto mr-auto">
            <i>Song library empty...</i>
          </p>
        </div>
      )}
    </>
  );
}
