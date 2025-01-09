import { Outlet } from "react-router";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";

export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar />
        <div
          className="basis-full flex-grow-0 min-w-0 relative overflow-auto bg-neutral-900 text-neutral-50"
        >
          <Outlet />
        </div>
      </div>
      <MusicFooter />
    </div>
  );
}
