import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import { useAudio } from "./hooks/AudioPlayer";
import { useRef, useState } from "react";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const audioUrls = [
    "/music/black_dress.mp3",
    "/music/bully.mp3",
    "/music/heaven.mp3",
    "/music/protocol.mp3",
    "/music/syrup.mp3",
  ];
  const [currSongIndex, setCurrSongIndex] = useState<number>(0);

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
  } = useAudio(audioRef);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/black_dress.mp3"
        onPlay={startPlaying}
        onEnded={() => {
          let nextIndex = currSongIndex + 1;
          if (nextIndex >= audioUrls.length) {
            nextIndex = 0;
          }
          setCurrSongIndex(nextIndex);
          changeAudioSrc(audioUrls[nextIndex]);
          startPlaying();
        }}
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

