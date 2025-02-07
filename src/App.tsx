import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { getLibraryAlbums, getLibrarySongs } from "./api/importer";
import AlbumView from "./components/AlbumView";
import MusicGrid from "./components/MusicGrid";
import SongList from "./components/SongList";
import { AlbumContextProvider, SongsContextProvider } from "./Contexts";
import FullscreenScreen from "./screens/FullscreenScreen";
import LibraryPage from "./screens/LibraryPage";
import OnboardingScreen from "./screens/OnboardingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { Album, SearchResults, Song } from "./types";
import SearchView from "./components/SearchView";

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const [searchRes, setSearchRes] = useState<SearchResults | null>(null);

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
                element={<LibraryPage onSearch={searchRes => setSearchRes(searchRes)} />}
              >
                <Route
                  index
                  element={<SongList songs={songs} />}
                />
                <Route
                  path="albums"
                  element={<MusicGrid albums={albums} />}
                />
                <Route
                  path="search"
                  element={
                    <SearchView
                      albums={searchRes ? searchRes.albums : []}
                      songs={searchRes ? searchRes.songs : []}
                    />
                  }
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
