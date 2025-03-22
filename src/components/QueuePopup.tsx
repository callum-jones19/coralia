import { useRef, useState } from "react";
import { List } from "react-feather";
import QueueList from "./Sidebars/QueueList";

export default function QueuePopup() {
  const blurTimeout = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="relative"
      onBlur={() => {
        blurTimeout.current = window.setTimeout(() => {
          setIsOpen(false);
        }, 0);
      }}
      onFocus={() => {
        if (blurTimeout.current) {
          window.clearTimeout(blurTimeout.current);
        }
      }}
    >
      <button
        className="h-full w-full flex flex-row items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        title="Queue"
      >
        <List />
      </button>
      {isOpen
        && (
          <div autoFocus className="absolute z-20 bottom-10 right-0 h-96 w-60 rounded-md bg-white shadow-md dark:bg-neutral-900 p-4">
            <QueueList />
          </div>
        )}
    </div>
  );
}
