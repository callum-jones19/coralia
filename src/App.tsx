import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import { useAudio } from "./hooks/AudioPlayer";
import { useRef } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    toggleAudioPlaying,
    // changeAudioSrc,
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
        src="/music/black_dress.mp3"
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
                toggleAudioPlaying={toggleAudioPlaying}
                isPlaying={isPlaying}
                setSongPos={updateProgress}
                setVolume={updateVolume}
                songDuration={songDuration}
                songPos={songPos}
                volume={volume}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

