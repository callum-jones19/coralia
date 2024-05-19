import MusicFooter from "../components/MusicFooter";
import MusicGrid from "../components/MusicGrid";
import SideBar from "../components/SideBar";

// FIXME consolidate music data into a single
export interface HomeScreenProps {
  toggleAudioPlaying: () => void;
  setSongPos: (newPos: number) => void;
  songPos: number;
  isPlaying: boolean;
  songDuration: number;
  volume: number;
  setVolume: (newVol: number) => void;
}

export default function HomeScreen ({ toggleAudioPlaying, isPlaying, setSongPos, setVolume, songDuration, songPos, volume }: HomeScreenProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-grow h-1 flex-shrink">
        <SideBar />
        <MusicGrid />
      </div>
      <MusicFooter
        currSongArtist="Hotline TNT"
        currSongName="Protocol"
        toggleAudioPlaying={toggleAudioPlaying}
        isPlaying={isPlaying}
        setSongPos={setSongPos}
        setVolume={setVolume}
        songDuration={songDuration}
        songPos={songPos}
        volume={volume}
      />
    </div>
  );
}