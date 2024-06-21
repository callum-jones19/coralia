import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { load_or_generate_collection } from "../data/importer";
import { Collection, MusicTags } from "../data/types";

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

export default function HomeScreen(
  {
    toggleAudioPlaying,
    isPlaying,
    setSongPos,
    setVolume,
    songDuration,
    songPos,
    volume,
    changeAudioSrc,
    musicTags,
    updateMetadata,
    startPlaying,
  }: HomeScreenProps,
) {
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    load_or_generate_collection()
      .then(loaded_collection => {
        setCollection(() => loaded_collection);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar />
        {/* <MusicGrid changeAudioSrc={changeAudioSrc} /> */}
        <div className="basis-full flex-grow-0 min-w-0 relative">
          <SongList
            songList={collection ? collection.songs : []}
            onSongClick={s => {
              console.log(s);
              updateMetadata(s.tags);
              console.log(s.filePath);
              const newSrc = convertFileSrc(s.filePath);
              console.log(newSrc);
              changeAudioSrc(newSrc);
              startPlaying();
            }}
          />
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
