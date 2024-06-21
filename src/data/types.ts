export interface MusicTags {
  title: string;
  artist: string;
  album: string;
  genre: string;
  encodedCoverArt: string;
}

export interface Song {
  filePath: string;
  tags: MusicTags;
}

export interface Collection {
  songs: Song[];
}

export interface TauriMusicTags {
  title: string;
  artist: string;
  album: string;
  genre: string;
  encoded_cover_art: string;
}

export interface TauriSongResponse {
  file_path: string;
  tags: TauriMusicTags;
}

export interface TauriCollectionResponse {
  songs: TauriSongResponse[];
}

export const tauriSongToInternalSong = (tauriSong: TauriSongResponse): Song => {
  return {
    filePath: tauriSong.file_path,
    tags: {
      album: tauriSong.tags.album,
      artist: tauriSong.tags.artist,
      encodedCoverArt: tauriSong.tags.encoded_cover_art,
      genre: tauriSong.tags.genre,
      title: tauriSong.tags.title,
    },
  } as Song;
};

export const tauriCollectionToCollection = (
  tauriCollection: TauriCollectionResponse,
): Collection => {
  const scanned_songs = tauriCollection.songs.map(tauriSong =>
    tauriSongToInternalSong(tauriSong)
  );

  return {
    songs: scanned_songs,
  } as Collection;
};
