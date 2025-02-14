import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { getLibraryAlbums, getLibrarySongs } from "./api/importer";
import AlbumView from "./components/Library/AlbumView";
import { AlbumContextProvider, SongsContextProvider } from "./Contexts";
import FullscreenScreen from "./screens/FullscreenScreen";
import LibraryPage from "./screens/LibraryPage";
import OnboardingScreen from "./screens/OnboardingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { Album, Library, SearchResults, Song } from "./types";
import SearchView from "./components/Library/SearchView";
import { listen } from "@tauri-apps/api/event";
import SongsView from "./components/Library/SongsView";
import AlbumsView from "./components/Library/AlbumsView";

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const [searchRes, setSearchRes] = useState<SearchResults | null>(null);

  useEffect(() => {
    // Watch for any updates to the library while the app is running
    const unlistenLibrary = listen<Library>("library_update", e => {
      setAlbums(e.payload.albums);
      setSongs(e.payload.songs);
    })
    .catch(e => console.error(e));

    // Fetch the library on initial load.
    getLibrarySongs()
      .then(libSongs => {
        setSongs(libSongs);
      })
      .catch(e => console.error(e));

    getLibraryAlbums()
      .then(libAlbums => setAlbums(libAlbums))
      .catch(e => console.error(e));

    return () => {
      unlistenLibrary
        .then(f => f)
        .catch(e => console.error(e));
    }
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
                  element={<SongsView songs={songs} />}
                />
                <Route
                  path="albums"
                  element={<AlbumsView albums={albums} />}
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
