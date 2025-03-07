import { convertFileSrc } from "@tauri-apps/api/core";
import { useState } from "react";
import { Play, Volume2 } from "react-feather";
import { addToQueueNext, clearAndPlayBackend } from "../api/commands";
import { Song } from "../types/types";

export interface SongListItemDenseProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
}

export default function SongListItemDense(
  { song, currentlyPlayingId, showImage }: SongListItemDenseProps,
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
      } flex flex-row items-center gap-4  pr-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={() => addToQueueNext(song)}
    >
      <div className="basis-20 flex flex-row justify-start items-center pl-2">
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
              onClick={() => {
                clearAndPlayBackend(song).catch(e => console.error(e));
              }}
            >
              <Play />
            </button>
          )}
      </div>
      <div className="flex-grow overflow-hidden text-nowrap text-ellipsis flex flex-col gap-1">
        <p
          className="overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.title}
        >
          {song.tags.title}
        </p>
        <p
          className="overflow-hidden text-nowrap text-ellipsis text-neutral-700 dark:text-neutral-400"
          title={song.tags.title}
        >
          <i>{song.tags.artist}</i>
        </p>
      </div>
    </div>
  );
}
