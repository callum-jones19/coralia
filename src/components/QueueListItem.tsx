import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Song } from "../types";
import { Volume1, X } from "react-feather";
import { removeFromQueue } from "../api/commands";

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
    <ul
      key={`${song.filePath}-${index}`}
      className="flex flex-row gap-2 w-full items-center"
      onMouseEnter={() => setisHovering(true)}
      onMouseLeave={() => setisHovering(false)}
    >
      <div className="basis-1/12 flex-shrink-0">
        {index === 0 && <Volume1 size="1em" />}
        {index !== 0 &&
          <p>{index}.</p>
        }
      </div>
      <img
        loading="lazy"
        alt="album art"
        src={queueImgSrc}
        className="w-6 aspect-square"
      />
      <p className="overflow-hidden text-nowrap text-ellipsis flex-grow" title={song.tags.title}>{song.tags.title}</p>
      {isHovering &&
        <button
          onClick={() => removeFromQueue(index)}
        >
          <X scale={2} />
        </button>
      }
    </ul>
  );
}