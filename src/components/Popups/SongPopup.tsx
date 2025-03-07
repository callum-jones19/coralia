import { FastForward, Play, PlusCircle } from "react-feather";
import { Song } from "../../types/types";
import { addToQueueNext, clearAndPlayBackend, enqueueSongBackend } from "../../api/commands";

export interface SongPopupProps {
  song: Song;
}

export default function SongPopup({ song }: SongPopupProps) {
  return (
    <>
      <div
        className="h-fit w-52 bg-neutral-100 dark:bg-neutral-900 dark:text-white font-normal shadow-md rounded-md text-black p-1"
        onClick={e => {
          e.stopPropagation();
        }}
        onDoubleClick={e => e.stopPropagation()}
      >
        <div className="h-full w-full flex flex-col">
          <button
            className="flex gap-3 items-center hover:bg-neutral-200 hover:dark:bg-neutral-800 p-2 rounded-t-md"
            onClick={e => {
              clearAndPlayBackend(song)
                .then(() => e.currentTarget.blur())
                .catch(e => console.error(e));
            }}
            autoFocus
          >
            <Play className="dark:text-neutral-400" />
            Play now
          </button>
          <button
            className="flex gap-3 items-center hover:bg-neutral-200 hover:dark:bg-neutral-800 p-2"
            onClick={e => {
              addToQueueNext(song);
              e.currentTarget.blur();
            }}
          >
            <PlusCircle className="dark:text-neutral-400" />
            Queue next
          </button>
          <button
            className="flex gap-3 items-center hover:bg-neutral-200 hover:dark:bg-neutral-800 p-2 rounded-b-md"
            onClick={e => {
              enqueueSongBackend(song);
              e.currentTarget.blur();
            }}
          >
            <FastForward className="dark:text-neutral-400" />
            Queue end
          </button>
        </div>
      </div>
    </>
  )
}
