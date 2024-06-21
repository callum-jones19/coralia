import { useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAudio } from "./hooks/AudioPlayer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    updateMetadata,
    musicTags,
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
  } = useAudio(audioRef);

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
                musicTags={musicTags}
                updateMetadata={updateMetadata}
                startPlaying={startPlaying}
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
