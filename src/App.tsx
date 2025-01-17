import { BrowserRouter, Route, Routes } from "react-router";
import MusicGrid from "./components/MusicGrid";
import SongList from "./components/SongList";
import LibraryPage from "./screens/LibraryPage";
import OnboardingScreen from "./screens/OnboardingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AlbumView from "./components/AlbumView";
import FullscreenScreen from "./screens/FullscreenScreen";
import { useEffect, useState } from "react";
import { Album, Song } from "./types";
import { getLibraryAlbums, getLibrarySongs } from "./api/importer";
import { AlbumContextProvider, SongsContextProvider } from "./Contexts";

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getLibrarySongs()
      .then(libSongs => {
        setSongs(libSongs);
      })
      .catch(e => console.error(e));

      getLibraryAlbums()
        .then(libAlbums => setAlbums(libAlbums))
        .catch(e => console.error(e));
  }, []);

  return (
    <>
      <SongsContextProvider songs={songs}>
        <AlbumContextProvider albums={albums}>
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
              <Route
                path="album/:albumId"
                element={<AlbumView />}
              />
            </Route>
            <Route path="fullscreen" element={<FullscreenScreen />} />
            <Route
              path="/settings"
              element={<SettingsScreen />}
            />
          </Routes>
        </BrowserRouter>
      </AlbumContextProvider>
      </SongsContextProvider>
    </>
  );
}
