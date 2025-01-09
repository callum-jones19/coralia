import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Play, Volume2 } from "react-feather";
import { clearAndPlayBackend } from "../api/commands";
import { Song } from "../types";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
}

export default function SongListItem(
  { song, colored, currentlyPlayingId,showImage }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <li
      className={`flex flex-col h-14 rounded-md ${
        isPlaying ? "bg-green-800" : colored ? "bg-neutral-900" : "bg-transparent"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="hover:bg-neutral-800 p-2 flex flex-row gap-2 flex-shrink items-center flex-grow rounded-md">
        {showImage && <img
          loading="lazy"
          src={imgUrl}
          width={35}
          height={35}
          alt="thumb art"
          className="rounded-sm"
        />}
        <div className="basis-1/12 flex flex-row justify-center flex-shrink-[2]">
          {!isHovering && !isPlaying
            && (
              <p className="w-fit">
                {song.tags.trackNumber ? song.tags.trackNumber : "N/A"}.
              </p>
            )}
          {!isHovering && isPlaying
            && (
              <Volume2 />
            )}
          {isHovering
            && (
              <div className="flex flex-row gap-1">
                <button
                  className="p-3 bg-neutral-800 rounded-full"
                  onClick={() => clearAndPlayBackend(song)}
                >
                  <Play size="1em" color="white" />
                </button>
              </div>
            )}
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
    </li>
  );
}
