import MusicFooter from "./MusicFooter";
import MusicGrid from "./MusicGrid";
import SideBar from "./SideBar";

export default function HomeScreen () {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-grow">
        <SideBar />
        <MusicGrid />
      </div>
      <MusicFooter />
    </div>
  );
}