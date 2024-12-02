import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAudio } from "./hooks/AudioPlayer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const {
    currentSong,
    changeCurrentSong,
    enqueueSong,
    queue,
  } = useAudio();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                onEnqueueSong={enqueueSong}
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
