import { enqueue_song } from "../api/commands";
import { Song } from "../types";
import SongListItem from "./SongListItem";

export interface SongListProps {
  songList: Song[];
  onSongClick: (song: Song) => void;
  onAddToQueue: (newSong: Song) => void;
  currPlayingSong: Song | null;
}

export default function SongList(
  { songList, onSongClick, currPlayingSong, onAddToQueue }: SongListProps,
) {
  return (
    <div className="flex flex-col h-full w-full basis-full overflow-auto scroll-smooth">
      <div
        className="flex-grow-0 p-2 basis-auto flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 text-white font-bold bg-gray-900"
      >
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Song Name
        </p>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Album Name
        </p>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Artist Name
        </p>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Album Artist
        </p>
      </div>
      {songList.map(song => (
        <SongListItem
          key={song.filePath}
          song={song}
          onClick={() => {
            onSongClick(song);
          }}
          isPlaying={currPlayingSong
            ? currPlayingSong.filePath === song.filePath
            : false}
          onDoubleClick={() => onAddToQueue(song)}
        />
      ))}
    </div>
  );
}
