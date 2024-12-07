import { useState } from "react";
import { Song } from "../types";
import { Play } from "react-feather";
import { clearAndPlayBackend } from "../api/commands";
import { useImage } from "react-image";
import { convertFileSrc } from "@tauri-apps/api/tauri";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
}

export default function SongListItem(
  { song, colored }: SongListItemProps,
) {

  const [isHovering, setIsHovering] = useState<boolean>(false);

  const artworkUrl = song.artwork.folderAlbumArt ? convertFileSrc(song.artwork.folderAlbumArt) : '';

  const { src } = useImage({
    srcList: artworkUrl,
    useSuspense: false
  });

  return (
    <div
      className={`flex flex-col h-full ${colored ? 'bg-neutral-100' : 'bg-white'}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="hover:bg-neutral-300 p-2 flex flex-row gap-2 flex-shrink items-center flex-grow">
        <img src={src} width={40} height={40} className="rounded-md" />
        <div
          className="basis-1/12 flex flex-row justify-center flex-shrink-[2]"
        >
          {!isHovering &&
            <p className="w-fit">
              {song.tags.trackNumber ? song.tags.trackNumber : '~'}.
            </p>
          }
          {isHovering &&
            <button
              className="p-2 bg-neutral-800 rounded-full"
              onClick={() => clearAndPlayBackend(song)}
            >
              <Play size='1em' color="white" />
            </button>
          }
        </div>
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
