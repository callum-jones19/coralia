import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { ChevronsRight, Play } from "react-feather";
import { clearAndPlayBackend, enqueueSongBackend } from "../api/commands";
import { Song } from "../types";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
}

export default function SongListItem(
  { song, colored, currentlyPlayingId }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <div
      className={`flex flex-col h-full ${
        isPlaying ? "bg-green-400" : colored ? "bg-neutral-100" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="hover:bg-neutral-300 p-2 flex flex-row gap-2 flex-shrink items-center flex-grow">
        <img
          loading="lazy"
          src={imgUrl}
          width={35}
          height={35}
          alt="thumb art"
          className="rounded-sm"
        />
        <div className="basis-1/12 flex flex-row justify-center flex-shrink-[2] outline-green-800 outline-2 outline">
          {!isHovering
            && (
              <p className="w-fit">
                {song.tags.trackNumber ? song.tags.trackNumber : "N/A"}.
              </p>
            )}
          {isHovering
            && (
              <div className="flex flex-row gap-1">
                <button
                  className="p-2 bg-neutral-800 rounded-full"
                  onClick={() => clearAndPlayBackend(song)}
                >
                  <Play size="1em" color="white" />
                </button>
                <button
                  className="p-2 rounded-full"
                  onClick={() => enqueueSongBackend(song)}
                >
                  <ChevronsRight color="black" size="1em" />
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
    </div>
  );
}
