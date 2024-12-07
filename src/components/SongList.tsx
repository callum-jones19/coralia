import { CSSProperties, memo, useEffect, useState } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { getLibrarySongs } from "../api/importer";
import { Song } from "../types";
import SongListItem from "./SongListItem";

interface RowProps {
  data: Song[];
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  const song = data[index];

  return (
    <div style={style}>
      <SongListItem song={song} colored={index % 2 === 0} />
    </div>
  );
}, areEqual);
Row.displayName = 'SongRow';

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getLibrarySongs()
      .then(libSongs => setSongs(libSongs))
      .catch(e => console.error(e));
  });

  return (
    <>
      {songs.length > 0 && (
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemCount={songs.length}
              itemSize={53}
              width={width}
              itemData={songs}
              overscanCount={5}
            >
              {Row}
            </FixedSizeList>
          )}
        </ReactVirtualizedAutoSizer>
      )}
    </>
  );
}
