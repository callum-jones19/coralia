import { convertFileSrc } from "@tauri-apps/api/core";
import { useRef, useState } from "react";
import { MoreVertical, Play, Volume2 } from "react-feather";
import { clearAndPlayBackend } from "../api/commands";
import { Song } from "../types";
import SongPopup from "./Popups/SongPopup";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
}

export default function SongListItem(
  { song, currentlyPlayingId, showImage }: SongListItemProps,
) {
  const blurTimeout = useRef<number | null>(null);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <div
      className={`h-full rounded-md  ${isPlaying
          ? "text-green-700 font-bold"
          : isHovering
            ? "bg-neutral-400 dark:bg-neutral-700"
            : ""
        } flex flex-row items-center gap-4 relative pr-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={() => clearAndPlayBackend(song)}
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
      <div
        className="basis-1/4 flex-grow min-w-0 flex justify-between relative"
        title={song.tags.artist}
      >
        <p className="overflow-hidden text-nowrap text-ellipsis">{song.tags.artist}</p>
        {isHovering &&
          <button
            onClick={() => setShowPopup(!showPopup)}
            onDoubleClick={e => e.stopPropagation()}
            className="ml-2"
          >
            <MoreVertical />
          </button>
        }
        {showPopup &&
          <div
            className="absolute top-0 right-8 z-30"
            onBlur={() => {

              blurTimeout.current = window.setTimeout(() => {
                setShowPopup(false);
              }, 0);
            }}
            onFocus={() => {
              if (blurTimeout.current) {
                window.clearTimeout(blurTimeout.current);
              }
            }}
          >
            <SongPopup song={song} />
          </div>
        }
      </div>
    </div>
  );
}
