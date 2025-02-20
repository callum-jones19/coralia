import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Play, Volume2 } from "react-feather";
import { addToQueueNext, clearAndPlayBackend  } from "../api/commands";
import { Song } from "../types";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
}

export default function SongListItem(
  { song, currentlyPlayingId, showImage }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <div
      className={`h-full rounded-md  ${
        isPlaying
          ? "text-green-700 font-bold"
          : isHovering
          ? "bg-neutral-400 dark:bg-neutral-700"
          : ""
      } flex flex-row items-center gap-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={() => addToQueueNext(song)}
    >
      <div className="basis-1/4 flex flex-row justify-start items-center pl-2">
        {showImage && (
          <img
            loading="lazy"
            src={imgUrl}
            width={35}
            height={35}
            alt="thumb art"
            className="rounded-sm mr-2"
          />
        )}
        {!isHovering && !isPlaying
          && (
            <p className="w-fit">
              {song.tags.trackNumber ? song.tags.trackNumber : "N/A"}.
            </p>
          )}
        {!isHovering && isPlaying
          && <Volume2 />}
        {isHovering
          && (
            <button
              className="rounded-full text-center"
              onClick={() => clearAndPlayBackend(song)}
            >
              <Play />
            </button>
          )}
      </div>
      <div className="basis-1/4 flex-grow overflow-hidden text-nowrap text-ellipsis flex flex-row items-center gap-1">
        <p
          className="basis-1/4flex-grow overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.title}
        >
          {song.tags.title}
        </p>
      </div>
      <p
        className="basis-1/4 flex-grow overflow-hidden text-nowrap text-ellipsis"
        title={song.tags.album}
      >
        {song.tags.album}
      </p>
      <p
        className="basis-1/4 flex-grow overflow-hidden text-nowrap text-ellipsis"
        title={song.tags.artist}
      >
        {song.tags.artist}
      </p>
    </div>
  );
}
