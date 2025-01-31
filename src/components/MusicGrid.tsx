import { CSSProperties, memo } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList } from "react-window";
import { useAlbums } from "../Contexts";
import { Album } from "../types";
import MusicGridAlbum from "./MusicGridAlbum";

interface RowData {
  albums: Album[];
  albumsPerRow: number;
}

interface RowProps {
  data: RowData;
  index: number;
  style: CSSProperties;
}

const Row = memo(({ data, index, style }: RowProps) => {
  // const albumIndex = (rowIndex * ALBUMS_PER_ROW) + columnIndex;
  const { albums, albumsPerRow } = data;
  const rowAlbums = albums.slice(index * albumsPerRow, index * albumsPerRow + albumsPerRow);

  return (
    <div style={style}>
      <div id="grid-row" className="h-full w-full flex flex-row justify-between">
        {rowAlbums.map(album => (<MusicGridAlbum key={album.id} album={album} />))}
      </div>
    </div>
  );
}, areEqual);
Row.displayName = "AlbumRow";

export default function MusicGrid() {
  const albums = useAlbums();



  return (
    <div className="basis-1/2 flex-grow h-full flex flex-col">
      {albums.length > 0
        && (
          <ReactVirtualizedAutoSizer>
            {({ height, width }) => {
              console.log(height, width);
              const tileSize = 200;

              const itemsPerRow = Math.floor(width / tileSize);
              console.log(itemsPerRow);

              const tileContainerSize = width / itemsPerRow;
              console.log(tileContainerSize);

              const numberOfRows = albums.length / itemsPerRow;
              const rowData: RowData = {
                albums: albums,
                albumsPerRow: itemsPerRow,
              }
              return (
              <FixedSizeList
                height={height}
                width={width}
                itemData={rowData}
                itemCount={numberOfRows}
                itemSize={tileSize}
              >
                {Row}
              </FixedSizeList>
            )}}
          </ReactVirtualizedAutoSizer>
        )}
      {albums.length === 0
        && (
          <div className="h-full w-full flex flex-col justify-center">
            <p className="w-fit ml-auto mr-auto">
              <i>No albums detected...</i>
            </p>
          </div>
        )}
    </div>
  );
}
