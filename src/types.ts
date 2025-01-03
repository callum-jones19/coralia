export interface Library {
  rootDir: string;
  songs: Song[];
  albums: Album[];
}

export interface Duration {
  nanos: number;
  secs: number;
}

export interface SongProperties {
  duration: Duration;
}

export interface Song {
  filePath: string;
  tags: MusicTags;
  artwork?: Artwork;
  properties: SongProperties;
}

export interface SongInfo {
  paused: boolean;
  position: Duration;
}

export interface MusicTags {
  title: string;
  artist: string | undefined;
  albumArtist: string | undefined;
  album: string | undefined;
  genre: string | undefined;
  year: string | undefined;
  publisher: string | undefined;
  composer: string | undefined;
  originalYear: string | undefined;
  diskNumber: number | undefined;
  trackNumber: number | undefined;
}

export interface Artwork {
  fullResArt: string;
  thumbArt: string;
  art400: string;
}

export interface Album {
  title: string;
  albumArtist: string;
  albumSongs: Song[];
}

export interface CachedPlayerState {
  songsQueue: Song[];
  currentSongPos: Duration;
  currentVolume: number;
  isPaused: boolean;
}
