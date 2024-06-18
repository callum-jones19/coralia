import { convertFileSrc } from "@tauri-apps/api/tauri";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { useState } from "react";
import { MusicTags, Song } from "../data/types";
import { import_song_library } from "../data/importer";

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
  startPlaying: () => void;
}

export default function HomeScreen ({ toggleAudioPlaying, isPlaying, setSongPos, setVolume, songDuration, songPos, volume, changeAudioSrc, musicTags, updateMetadata, startPlaying }: HomeScreenProps) {
  const [songList, setSongList] = useState<Song[]>([]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar />
        {/* <MusicGrid changeAudioSrc={changeAudioSrc} /> */}
        <div className="basis-full flex-grow-0 min-w-0 relative">
          <button
            className="bg-blue-800 p-4 absolute bottom-4 right-8 rounded-lg text-blue-50 font-bold shadow-md shadow-green-950"
            onClick={() => {
              // Empty the scanned song list if it is not empty
              setSongList(() => []);
              import_song_library()
                .then(songs => setSongList(() => songs))
                .catch(err => console.log(err));
            }}
          >
            Scan
          </button>
          <SongList songList={songList} onSongClick={s => {
            updateMetadata(s.tags);
            const newSrc = convertFileSrc(s.filePath);
            changeAudioSrc(newSrc);
            startPlaying();
          }} />
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