import MusicFooter from "./MusicFooter";
import MusicGrid from "./MusicGrid";

export default function HomeScreen () {
  return (
    <div className="h-full flex flex-col">
      <MusicGrid />
      <MusicFooter />
    </div>
  );
}