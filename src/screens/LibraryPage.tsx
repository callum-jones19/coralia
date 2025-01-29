import MenuBar from "../components/MenuBar";
import MusicFooter from "../components/MusicFooter";
import QueueBar from "../components/QueueBar";
import LibraryBody from "../components/LibraryBody";

export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col bg-neutral-50 text-black">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <MenuBar />
        <LibraryBody />
        <QueueBar />
      </div>
      <MusicFooter />
    </div>
  );
}
