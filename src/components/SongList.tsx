import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, areEqual } from "react-window";
import { Song } from "../types";
import SongListItem from "./SongListItem";
import { CSSProperties, memo, useEffect, useState } from "react";
import { getLibrarySongs } from "../api/importer";

interface RowProps {
  data: Song[];
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  const song = data[index];
  
  return (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      <SongListItem song={song} />
    </div>
  )
  }, areEqual);


export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getLibrarySongs()
      .then(libSongs => setSongs(libSongs));
  });
  
  return (
    <>
      {songs.length > 0 && <ReactVirtualizedAutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={songs.length}
            itemSize={55}
            width={width}
            itemData={songs}
          >
            {Row}
          </FixedSizeList>
        )}
      </ReactVirtualizedAutoSizer>}
    </>
  );
}
