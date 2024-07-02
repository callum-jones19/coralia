export interface MusicTags {
  title: string;
  artist: string;
  album: string;
  album_artist: string;
  genre: string;
  encodedCoverArt: string | undefined;
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
  album_artist: string;
  genre: string;
  cached_artwork_uri: string | undefined;
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
      album_artist: tauriSong.tags.album_artist,
      encodedCoverArt: tauriSong.tags.cached_artwork_uri,
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

export const songsToTauriSongs = (songs: Song[]): TauriSongResponse[] => {
  return songs.map(song => {
    return {
      file_path: song.filePath,
      tags: {
        album: song.tags.album,
        artist: song.tags.artist,
        title: song.tags.title,
        genre: song.tags.genre,
        cached_artwork_uri: song.tags.encodedCoverArt,
      },
    } as TauriSongResponse;
  });
};
