import { Outlet } from "react-router";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";

export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-50">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <Outlet />
        <SideBar />
      </div>
      <MusicFooter />
    </div>
  );
}
