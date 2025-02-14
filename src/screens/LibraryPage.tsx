import LibraryBody from "../components/Library/LibraryBody";
import MusicFooter from "../components/MusicFooter";
import MenuBar from "../components/Sidebars/MenuBar";
import QueueBar from "../components/Sidebars/QueueBar";
import { SearchResults } from "../types";

export interface LibraryPageProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function LibraryPage({ onSearch }: LibraryPageProps) {
  return (
    <div className="h-full flex flex-col bg-white text-black gap-2 p-2">
      <div className="flex flex-row flex-grow h-1 flex-shrink gap-2">
        <MenuBar onSearch={onSearch} />
        <LibraryBody />
        <QueueBar />
      </div>
      <MusicFooter />
    </div>
  );
}
