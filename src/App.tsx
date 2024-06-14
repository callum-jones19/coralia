import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import { useAudio } from "./hooks/AudioPlayer";
import { useRef } from "react";
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
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsScreen />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

