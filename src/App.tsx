import { BrowserRouter, Route, Routes } from "react-router";
import LibraryPage from "./screens/LibraryPage";
import SettingsScreen from "./screens/SettingsScreen";
import SongList from "./components/SongList";
import MusicGrid from "./components/MusicGrid";
import OnboardingScreen from "./screens/OnboardingScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<OnboardingScreen />}
          />
          <Route
            path="home"
            element={<LibraryPage />}
          >
            <Route
              index
              element={<SongList />}
            />
            <Route
              path="albums"
              element={<MusicGrid />}
            />
          </Route>
          <Route
            path="/settings"
            element={<SettingsScreen />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
