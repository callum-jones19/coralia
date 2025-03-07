/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useContext } from "react";
import { Album, Song } from "./types/types";

export const AlbumContext = createContext<Album[] | null>(null);
export const SongContext = createContext<Song[] | null>(null);

export const useAlbums = () => {
  const albums = useContext(AlbumContext);

  if (!albums) {
    throw new Error(
      "No album context provider could be found for this consumer",
    );
  }

  return albums;
};

export const useSongs = () => {
  const songs = useContext(SongContext);

  if (!songs) {
    throw new Error(
      "No album context provider could be found for this consumer",
    );
  }

  return songs;
};

export interface AlbumContextProviderProps {
  albums: Album[];
}

export const AlbumContextProvider = (
  { albums, children }: PropsWithChildren<AlbumContextProviderProps>,
) => {
  return (
    <AlbumContext.Provider value={albums}>
      {children}
    </AlbumContext.Provider>
  );
};

export interface SongsContextProviderProps {
  songs: Song[];
}

export const SongsContextProvider = (
  { songs, children }: PropsWithChildren<SongsContextProviderProps>,
) => {
  return (
    <SongContext.Provider value={songs}>
      {children}
    </SongContext.Provider>
  );
};
