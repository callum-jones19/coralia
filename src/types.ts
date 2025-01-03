export type id = number;

export interface Duration {
  nanos: number;
  secs: number;
}

export interface SongProperties {
  duration: Duration;
}

export interface Song {
  id: number;
  filePath: string;
  tags: MusicTags;
  artwork: Artwork;
  properties: SongProperties;
  album?: number;
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
  cachedEmbeddedArt: string | undefined;
  folderAlbumArt: string | undefined;
}

export interface Album {
  id: number
  title: string;
  albumArtist: string;
  albumSongs: id[];
}

export interface CachedPlayerState {
  songsQueue: Song[];
  currentSongPos: Duration;
  currentVolume: number;
  isPaused: boolean;
}
