import { CSSProperties, memo, useEffect, useState } from "react";
import { getLibraryAlbums } from "../api/importer";
import { Album } from "../types";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import MusicGridAlbum from "./MusicGridAlbum";
import { areEqual, FixedSizeGrid } from "react-window";


interface RowProps {
  data: Album[];
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
}
const ALBUMS_PER_ROW = 6;

const Cell = memo(({ data, columnIndex, rowIndex, style }: RowProps) => {

  console.log(data);
  const albumIndex = (rowIndex * ALBUMS_PER_ROW) + columnIndex;
  const album = data[albumIndex];

  return (
    <div style={style}>
      <MusicGridAlbum album={album} />
    </div>
  );
}, areEqual);
Cell.displayName = "AlbumRow";

export default function MusicGrid() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    getLibraryAlbums()
      .then(data => setAlbums(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <>
      {albums.length > 0 &&
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <FixedSizeGrid
              columnCount={ALBUMS_PER_ROW}
              rowCount={albums.length / ALBUMS_PER_ROW}
              height={height}
              width={width}
              columnWidth={(width / ALBUMS_PER_ROW) - 3}
              rowHeight={(width / ALBUMS_PER_ROW) + 55}
              itemData={albums}
              overscanRowCount={1}
            >
              {Cell}
            </FixedSizeGrid>
          )}
        </ReactVirtualizedAutoSizer>
      }
      {albums.length === 0 &&
        <div className="h-full w-full flex flex-col justify-center">
          <p className="w-fit ml-auto mr-auto">
            <i>No albums detected...</i>
          </p>
        </div>
      }
    </>
  );
}
