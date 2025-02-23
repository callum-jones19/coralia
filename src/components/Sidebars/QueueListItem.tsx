import { convertFileSrc } from "@tauri-apps/api/core";
import { useState } from "react";
import { Volume1, X } from "react-feather";
import { removeFromQueue } from "../../api/commands";
import { Song } from "../../types";

export interface QueueListItemProps {
  song: Song;
  index: number;
  currentlyPlayingId: number | null;
  removable?: boolean;
}

export default function QueueListItem({ song, index, currentlyPlayingId, removable }: QueueListItemProps) {
  const queueImgSrc = song.artwork?.thumbArt
    ? convertFileSrc(song.artwork?.thumbArt)
    : undefined;
  const [isHovering, setisHovering] = useState<boolean>(false);
  return (
    <div
      key={`${song.filePath}-${index}`}
      className="w-full flex flex-row gap-2 items-center"
      onMouseEnter={() => setisHovering(true)}
      onMouseLeave={() => setisHovering(false)}
    >
      <div className="basis-6 flex-grow-0 flex-shrink-0">
        {index !== undefined
          && ((currentlyPlayingId !== null && currentlyPlayingId !== song.id) || currentlyPlayingId === null)
          &&
          <p>{index + 1}.</p>
        }
        {index !== undefined
          && currentlyPlayingId !== null
          && currentlyPlayingId === song.id
          &&
          <p><Volume1 /></p>
        }
      </div>
      <img
        loading="lazy"
        alt="album art"
        src={queueImgSrc}
        className="w-6 aspect-square rounded-sm"
      />
      <p
        className="text-nowrap overflow-hidden text-ellipsis flex-grow min-w-0"
        title={song.tags.title}
      >
        {song.tags.title}
      </p>
      {isHovering
        && index !== undefined && removable && (
          <button
            className=""
            onClick={() => removeFromQueue(index)}
          >
            <X />
          </button>
        )}
    </div>
  );
}
