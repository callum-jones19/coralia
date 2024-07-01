import { useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAudio } from "./hooks/AudioPlayer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    toggleAudioPlaying,
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
    addToQueue,
    playNextInQueue,
    songs,
    queue,
    resetQueueAndPlaySong,
  } = useAudio(audioRef);

  return (
    <>
      <audio
        ref={audioRef}
        onPlay={startPlaying}
        onPause={stopPlaying}
        onDurationChange={handleDurationChange}
        onLoadedData={handleLoadedData}
        onEnded={playNextInQueue
}
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
                startPlaying={startPlaying}
                musicTags={currSong ? currSong.tags : null}
                currentSong={currSong}
                queue={queue}
                onClickSong={clickedSong => {
                  resetQueueAndPlaySong(clickedSong);
                }}
                onQueueAdd={addToQueue}
                songs={songs}
                onSkipSong={playNextInQueue}
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
