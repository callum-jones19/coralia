import MusicFooter from "../components/MusicFooter";
import MusicGrid from "../components/MusicGrid";
import SideBar from "../components/SideBar";

// FIXME consolidate music data into a single
export interface HomeScreenProps {
  changeAudioSrc: (newSrc: string) => void;
  toggleAudioPlaying: () => void;
  setSongPos: (newPos: number) => void;
  songPos: number;
  isPlaying: boolean;
  songDuration: number;
  volume: number;
  setVolume: (newVol: number) => void;
}

export default function HomeScreen ({ toggleAudioPlaying, isPlaying, setSongPos, setVolume, songDuration, songPos, volume, changeAudioSrc }: HomeScreenProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-grow h-1 flex-shrink">
        <SideBar />
        <MusicGrid changeAudioSrc={changeAudioSrc} />
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