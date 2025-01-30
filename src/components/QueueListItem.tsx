import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Volume1, X } from "react-feather";
import { removeFromQueue } from "../api/commands";
import { Song } from "../types";

export interface QueueListItem {
  song: Song;
  index: number;
}

export default function QueueListItem({ song, index }: QueueListItem) {
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
        {index === 0 && <Volume1 size="1em" />}
        {index !== 0
          && <p>{index}.</p>}
      </div>
      <img
        loading="lazy"
        alt="album art"
        src={queueImgSrc}
        className="w-6 aspect-square rounded-sm"
      />
      <p
        className="text-nowrap overflow-hidden text-ellipsis"
        title={song.tags.title}
      >
        {song.tags.title}
      </p>
      {isHovering
        && (
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
