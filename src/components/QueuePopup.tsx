import { useState } from "react";
import { List } from "react-feather";

export default function QueuePopup() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        className="h-full w-full flex flex-row items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <List />
      </button>
      {isOpen &&
          <div className="absolute z-10 bottom-10 right-0 h-96 w-60 rounded-md bg-white shadow-md dark:bg-neutral-900">
          </div>
        }
    </div>
  );
}