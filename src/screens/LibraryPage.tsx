import LibraryBody from "../components/LibraryBody";
import MenuBar from "../components/MenuBar";
import MusicFooter from "../components/MusicFooter";
import QueueBar from "../components/QueueBar";

export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col bg-white text-black gap-2 p-2">
      <div className="flex flex-row flex-grow h-1 flex-shrink gap-2">
        <MenuBar />
        <LibraryBody />
        <QueueBar />
      </div>
      <MusicFooter />
    </div>
  );
}
