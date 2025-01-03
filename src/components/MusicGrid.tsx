import { useEffect, useState } from "react";
import MusicGridAlbum from "./MusicGridAlbum";
import { Album } from "../types";
import { getLibraryAlbums } from "../api/importer";

export default function MusicGrid() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    getLibraryAlbums()
      .then(data => setAlbums(data))
      .catch(e => console.error(e))
  }, []);

  return (
    <>
      {albums.length > 0 && <div className="w-full h-full grid gap-4 bg-slate-50 p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 overflow-auto">
        {albums.map(album => {
          return (
            <MusicGridAlbum
              key={album.albumArtist + album.title}
              title={album.title}
              artist={album.albumArtist}
            />
          );
        })}
      </div>}
      {albums.length === 0 &&
        <div className="h-full w-full flex flex-col justify-center">
        <p className="w-fit ml-auto mr-auto">
          <i>Song library empty...</i>
        </p>
    </div>
      }
    </>
  );
}
