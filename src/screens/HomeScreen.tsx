import MusicFooter from "../components/MusicFooter";
import MusicGrid from "../components/MusicGrid";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { playSongFromAbsPath, scanFolder } from "../data/importer";

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
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar />
        {/* <MusicGrid changeAudioSrc={changeAudioSrc} /> */}
        <div className="basis-full flex-grow-0 min-w-0 relative">
          <button
            className="bg-blue-800 p-4 absolute bottom-4 right-8 rounded-lg text-blue-50 font-bold shadow-md shadow-green-950"
            onClick={() => scanFolder('Music')}
          >
            Scan
          </button>
          <button
            className="bg-blue-800 p-4 absolute bottom-20 right-8 rounded-lg text-blue-50 font-bold shadow-md shadow-green-950"
            onClick={() => {
              playSongFromAbsPath('C:/Users/Callum/Music/MusicBee/Artist Pictures/Thumb/Alice Phoebe Lou.jpg')
                .then(data => {
                  if (!data) return;

                  console.log(data);
                  changeAudioSrc(data);
                })
                .catch(data => console.error(data));
            }}
          >
            Load Test Song
          </button>
          <SongList />
        </div>
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