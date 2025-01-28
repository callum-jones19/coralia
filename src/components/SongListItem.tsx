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
  { song, colored, currentlyPlayingId, showImage }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <div
      className={`h-full rounded-md  ${
        isPlaying
          ? "bg-green-800"
          : isHovering
          ? "bg-neutral-700"
          : colored
          ? "bg-neutral-900"
          : "bg-neutral-900"
      } flex flex-row items-center gap-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="basis-1/5 flex flex-row justify-start items-center pl-2">
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
              <Play color="white" />
            </button>
          )}
      </div>
      <div className="basis-1/5 flex-grow overflow-hidden text-nowrap text-ellipsis flex flex-row items-center gap-1">
        <p
          className="basis-1/5flex-grow overflow-hidden text-nowrap text-ellipsis"
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
  );
}
