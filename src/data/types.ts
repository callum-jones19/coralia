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

export const tauriSongToInternalSong = (tauriSong: TauriSongResponse): Song => {
  return {
    filePath: tauriSong.file_path,
    tags: {
      album: tauriSong.tags.album,
      artist: tauriSong.tags.artist,
      encodedCoverArt: tauriSong.tags.encoded_cover_art,
      genre: tauriSong.tags.genre,
      title: tauriSong.tags.title,
    }
  } as Song;
}