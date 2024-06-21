import { Song } from "../data/types";
import SongListItem from "./SongListItem";

export interface SongListProps {
  songList: Song[];
  onSongClick: (song: Song) => void;
  currPlayingSong: Song | null;
}

export default function SongList({ songList, onSongClick, currPlayingSong }: SongListProps) {
  return (
    <div className="flex flex-col h-full w-full basis-full overflow-auto">
      <div
        className={"flex-grow-0 p-2 flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2"}
      >
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Song Name
        </p>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Artist Name
        </p>
        <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink">
          Album Name
        </p>
      </div>
      {songList.map(song => (
        <>
          <SongListItem
            key={song.filePath}
            songName={song.tags.title}
            albumName={song.tags.album}
            artistName={song.tags.artist}
            onClick={() => onSongClick(song)}
            isPlaying={currPlayingSong ? currPlayingSong.filePath === song.filePath : false}
          />
        </>
      ))}
    </div>
  );
}
