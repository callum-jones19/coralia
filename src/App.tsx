import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useAudio } from "./hooks/AudioPlayer";


export default function App() {

  const {
    isPaused,
    updateIsPaused,
    skipSong,
    updateVolume,
    volume,
    currentSong,
    changeCurrentSong,
    enqueueSong,
    queue
  } = useAudio();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                isPaused={isPaused}
                onUpdatePause={updateIsPaused}
                onClickSkip={skipSong}
                onEnqueueSong={enqueueSong}
                onUpdateVolume={updateVolume}
                queue={queue}
                currentSong={currentSong}
                onChangeSong={s => changeCurrentSong(s)}
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
