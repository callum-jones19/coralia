import { Outlet } from "react-router";
import MusicFooter from "../components/MusicFooter";
import QueueBar from "../components/QueueBar";
import MenuBar from "../components/MenuBar";

export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-50">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <MenuBar />
        <Outlet />
        <QueueBar />
      </div>
      <MusicFooter />
    </div>
  );
}
