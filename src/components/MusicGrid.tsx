import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Album } from "../data/types";
import MusicGridAlbum from "./MusicGridAlbum";

export interface MusicGridProps {
  albums: Album[];
}

export default function MusicGrid({ albums }: MusicGridProps) {

  return (
    <div className="w-full h-full grid gap-4 bg-slate-50 p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 overflow-auto">
      {albums.map(album => {
        // FIXME should be an option/undefined-able
        const albumArtSrc = convertFileSrc(album.cached_artwork_uri);

        return (
          <MusicGridAlbum
            key={album.album_artist + album.title}
            artSrc={albumArtSrc}
            title={album.title}
            artist={album.album_artist}
          />
        );
      })}
    </div>
  );
}
