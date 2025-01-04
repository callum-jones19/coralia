import { useEffect, useState } from "react";
import { getLibraryAlbums } from "../api/importer";
import { Album } from "../types";
import MusicGridAlbum from "./MusicGridAlbum";

export default function MusicGrid() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    getLibraryAlbums()
      .then(data => setAlbums(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <>
      {albums.length > 0 && (
        <div className="w-full h-full grid gap-4 bg-slate-50 p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 overflow-auto">
          {albums.map(album => {
            return (
              <MusicGridAlbum
                key={album.id}
                album={album}
              />
            );
          })}
        </div>
      )}
      {albums.length === 0
        && (
          <div className="h-full w-full flex flex-col justify-center">
            <p className="w-fit ml-auto mr-auto">
              <i>Song library empty...</i>
            </p>
          </div>
        )}
    </>
  );
}
