import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAudio } from "./hooks/AudioPlayer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { load_or_generate_collection } from "./data/importer";
import { Collection, Song } from "./data/types";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    toggleAudioPlaying,
    changeAudioSrc,
    isPlaying,
    songDuration,
    songPos,
    updateProgress,
    updateVolume,
    volume,
    handleDurationChange,
    handleLoadedData,
    startPlaying,
    stopPlaying,
    currSong,
  } = useAudio(audioRef);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  useEffect(() => {
    load_or_generate_collection()
      .then(loaded_collection => {
        setCollection(() => loaded_collection);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        onPlay={startPlaying}
        onPause={stopPlaying}
        onDurationChange={handleDurationChange}
        onLoadedData={handleLoadedData}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                changeAudioSrc={changeAudioSrc}
                toggleAudioPlaying={toggleAudioPlaying}
                isPlaying={isPlaying}
                setSongPos={updateProgress}
                setVolume={updateVolume}
                songDuration={songDuration}
                songPos={songPos}
                volume={volume}
                startPlaying={startPlaying}
                musicTags={currSong ? currSong.tags : null}
                currentSong={currSong}
                displayedSongs={filteredSongs ? filteredSongs : (collection ? collection.songs : [])}
                allSongs={collection ? collection.songs : []}
                onFilterSongs={filteredSongs => setFilteredSongs(filteredSongs)}
              />
            }
          />
          <Route
            path="/settings"
            element={<SettingsScreen />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
