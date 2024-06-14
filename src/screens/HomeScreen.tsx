import { convertFileSrc } from "@tauri-apps/api/tauri";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { scanFolder } from "../data/importer";
import { invoke } from "@tauri-apps/api";
import { MusicTags } from "../hooks/AudioPlayer";
import { useState } from "react";

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
  updateMetadata: (newMetadata: MusicTags) => void;
  musicTags: MusicTags | null;
}

export default function HomeScreen ({ toggleAudioPlaying, isPlaying, setSongPos, setVolume, songDuration, songPos, volume, changeAudioSrc, musicTags, updateMetadata }: HomeScreenProps) {
  const [currentSongPath, setCurrentSongPath] = useState<string | null>(null);

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
            disabled={!currentSongPath}
            className="bg-blue-800 p-4 absolute bottom-20 right-8 rounded-lg text-blue-50 font-bold shadow-md shadow-green-950"
            onClick={() => {
              if (!currentSongPath) return;
              // const musicPath = 'C:/Users/Callum/Music/albums/Arcade Fire/Funeral/09 Rebellion (Lies).mp3';
              const newSrc = convertFileSrc(currentSongPath);

              invoke('read_music_metadata', { filepath: currentSongPath })
                .then(response => {
                  console.log('test');
                  console.log(response);
                  if (response == null) return;

                  const readMusicTags= response as MusicTags;
                  updateMetadata(readMusicTags);
                })
                .catch(err => console.log(err));

              console.log(newSrc);
              changeAudioSrc(newSrc);
            }}
          >
            Load Test Song
          </button>
          <input type="text" onChange={e => setCurrentSongPath(e.target.value)} className="p-3 absolute bottom-40 right-8 w-40 shadow-lg outline-1 outline-double" />
          <SongList />
        </div>
      </div>
      <MusicFooter
        currSongArtist={!musicTags ? "..." : musicTags.artist}
        currSongName={!musicTags ? "..." : musicTags.title}
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