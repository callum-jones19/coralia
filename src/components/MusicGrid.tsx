import { Album } from "../types";
import MusicGridAlbum from "./MusicGridAlbum";

export interface MusicGridProps {
  albums: Album[];
}

export default function MusicGrid({ albums }: MusicGridProps) {
  return (
    <div className="w-full h-full grid gap-4 bg-slate-50 p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 overflow-auto">
      {albums.map(album => {
        return (
          <MusicGridAlbum
            key={album.albumArtist + album.title}
            artSrc={album.artwork}
            title={album.title}
            artist={album.albumArtist}
          />
        );
      })}
    </div>
  );
}
