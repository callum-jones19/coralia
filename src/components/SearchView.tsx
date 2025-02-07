import { Album, Song } from "../types";
import MusicGrid from "./MusicGrid";
import SongList from "./SongList";

export interface SearchViewProps {
  albums: Album[];
  songs: Song[];
}

export default function SearchView({ albums, songs }: SearchViewProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="h-1/2 flex flex-col gap-2">
        <h2 className="p-2 font-bold text-lg border-solid border-b-2 border-neutral-300">Songs</h2>
        <SongList songs={songs} emptyString="No matching songs found" />
      </div>
      <div className="h-1/2 flex flex-col gap-2">
        <h2 className="p-2 font-bold text-lg border-solid border-b-2 border-neutral-300">Albums</h2>
        <MusicGrid albums={albums} emptyString="No matching albums found" />
      </div>
    </div>
  );
}