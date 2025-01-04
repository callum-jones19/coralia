import { BrowserRouter, Route, Routes } from "react-router";
import MusicGrid from "./components/MusicGrid";
import SongList from "./components/SongList";
import LibraryPage from "./screens/LibraryPage";
import OnboardingScreen from "./screens/OnboardingScreen";
import SettingsScreen from "./screens/SettingsScreen";

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
