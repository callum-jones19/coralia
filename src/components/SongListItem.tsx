import { Song } from "../types";
import { clearAndPlayBackend } from "../api/commands";

export interface SongListItemProps {
  song: Song;
}

export default function SongListItem(
  { song }: SongListItemProps,
) {
  return (
    <div className="flex flex-col h-full border-b-gray-900 border-b-2">
      <div
        className="hover:bg-green-200 p-2 flex flex-row gap-2 flex-shrink items-center flex-grow"
      >
        {/* <p className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink" title={songName}>{songName}</p> */}
        <div className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink flex flex-row items-center gap-1">
          {/* <img loading="lazy" alt="album art" src={tmpSrc} className="h-10 aspect-square"/> */}
          <button
            className="mr-2 bg-gray-300 p-2 pt-1 pb-1 rounded-md"
            onClick={() => {
              clearAndPlayBackend(song);
            }}
          >
            Play
          </button>
          <p
            className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
            title={song.tags.title}
          >
            {song.tags.title}
          </p>
        </div>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
          title={song.tags.album}
        >
          {song.tags.album}
        </p>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
          title={song.tags.artist}
        >
          {song.tags.artist}
        </p>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex-shrink"
          title={song.tags.albumArtist}
        >
          {song.tags.albumArtist}
        </p>
      </div>
    </div>
  );
}
