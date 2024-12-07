import { Song } from "../types";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
}

export default function SongListItem(
  { song, colored }: SongListItemProps,
) {
  return (
    <div className={`flex flex-col h-full ${colored ? 'bg-neutral-100' : 'bg-white'}`}>
      <div className="hover:bg-neutral-300 p-2 flex flex-row gap-2 flex-shrink items-center flex-grow">
        <p
          className="basis-1/12 ml-2 flex-shrink-[2]"
        >
          1.
        </p>
        <div className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex flex-row items-center gap-1">
          <p
            className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis"
            title={song.tags.title}
          >
            {song.tags.title}
          </p>
        </div>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.album}
        >
          {song.tags.album}
        </p>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.artist}
        >
          {song.tags.artist}
        </p>
        <p
          className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.albumArtist}
        >
          {song.tags.albumArtist}
        </p>
      </div>
    </div>
  );
}
