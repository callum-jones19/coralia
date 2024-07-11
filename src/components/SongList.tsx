import { Song } from "../data/types";
import SongListItem from "./SongListItem";

export interface SongListProps {
  songList: Song[];
  onSongClick: (song: Song) => void;
  onUpdateQueue: (newSong: Song) => void;
  currPlayingSong: Song | null;
}

export default function SongList(
  { songList, onSongClick, currPlayingSong, onUpdateQueue }: SongListProps,
) {
  return (
    <div className="flex flex-col h-full w-full basis-full overflow-auto scroll-smooth">
      <div className="flex-grow-0 p-2 basis-auto flex flex-row gap-2 flex-shrink border-b-gray-900 border-b-2 text-white font-bold bg-gray-900">
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
      {songList.map((song, index) => (
        <SongListItem
          key={song.filePath}
          song={song}
          onClick={() => {
            onSongClick(song);
            for (let i = index + 1; i < songList.length; i++) {
              console.log(i);
              console.log(songList[i]);
              if (songList[i] !== undefined) {
                onUpdateQueue(songList[i]);
              }
            }
          }}
          isPlaying={currPlayingSong
            ? currPlayingSong.filePath === song.filePath
            : false}
          onDoubleClick={() => onUpdateQueue(song)}
        />
      ))}
    </div>
  );
}
