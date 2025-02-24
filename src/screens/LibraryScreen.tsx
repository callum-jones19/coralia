import LibraryBody from "../components/Library/LibraryBody";
import MenuBar from "../components/Sidebars/MenuBar";
import MusicFooter from "../components/Sidebars/MusicFooter";
import QueueBar from "../components/Sidebars/QueueBar";
import { SearchResults } from "../types";

export interface LibraryScreenProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function LibraryScreen({ onSearch }: LibraryScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white text-black gap-2 p-2 dark:bg-neutral-900">
      <div className="flex flex-row flex-grow h-1 flex-shrink gap-2">
        <MenuBar onSearch={onSearch} />
        <LibraryBody />
        <QueueBar />
      </div>
      <MusicFooter />
    </div>
  );
}
