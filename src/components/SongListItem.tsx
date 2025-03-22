import { convertFileSrc } from "@tauri-apps/api/core";
import { useRef, useState } from "react";
import { MoreVertical, Play, Volume2 } from "react-feather";
import { clearAndPlayBackend } from "../api/commands";
import { Song } from "../types/types";
import SongPopup from "./Popups/SongPopup";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
  onPlaySong?: () => void;
}

export default function SongListItem(
  { song, currentlyPlayingId, showImage, onPlaySong }: SongListItemProps,
) {
  const blurTimeout = useRef<number | null>(null);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <div
      className={`h-full rounded-md  ${isPlaying
          ? "text-green-700 font-semibold"
          : isHovering
            ? "bg-neutral-400 dark:bg-neutral-700"
            : ""
        } flex flex-row items-center gap-4 relative pr-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={() => {
        clearAndPlayBackend(song).catch(e => console.error(e));
      }}
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
                clearAndPlayBackend(song)
                  .then(() => {
                    if (onPlaySong !== undefined) {
                      onPlaySong();
                    }
                  })
                  .catch(e => console.error(e));
              }}
            >
              <Play />
            </button>
          )}
      </div>
      <div className="hidden sm:flex basis-1/4 flex-grow overflow-hidden text-nowrap text-ellipsis flex-row items-center gap-1">
        <p
          className="basis-1/4flex-grow overflow-hidden text-nowrap text-ellipsis"
          title={song.tags.title}
        >
          {song.tags.title}
        </p>
      </div>
      <div className="sm:hidden flex-grow overflow-hidden text-nowrap text-ellipsis flex gap-1 items-center justify-between">
        <div className="flex flex-col gap-1">
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
      <p
        className="hidden sm:block basis-1/4 flex-grow overflow-hidden text-nowrap text-ellipsis"
        title={song.tags.album}
      >
        {song.tags.album}
      </p>
      <div
        className="hidden sm:flex basis-1/4 flex-grow min-w-0 justify-between relative"
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
