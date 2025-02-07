import { Album, Song } from "../types";
import MusicGrid from "./MusicGrid";
import SongList from "./SongList";

export interface SearchViewProps {
  albums: Album[];
  songs: Song[];
}

export default function SearchView({ albums, songs }: SearchViewProps) {
  return (
    <>
      <div className="h-1/2 flex flex-col gap-2">
        <h2 className="p-2 font-bold text-lg">Songs</h2>
        <SongList songs={songs} />
      </div>
      <div className="h-1/2 flex flex-col gap-2">
        <h2 className="p-2 font-bold text-lg">Albums</h2>
        <MusicGrid albums={albums} />
      </div>
    </>
  );
}