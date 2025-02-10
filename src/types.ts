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
  artwork?: Artwork;
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
  fullResArt: string;
  thumbArt: string;
  art400: string;
}

export interface Album {
  id: number;
  title: string;
  albumArtist: string;
  albumSongs: id[];
  artwork: Artwork | undefined;
}

export interface CachedPlayerState {
  songsQueue: Song[];
  prevSongsQueue: Song[];
  currentSongPos: Duration;
  currentVolume: number;
  isPaused: boolean;
}

export interface SearchResults {
  albums: Album[];
  songs: Song[];
}

export interface Library {
  albums: Album[];
  songs: Song[];
  root_dirs: string[];
}

export type LibraryStatus = "Loading"
  | "ScanningSongs"
  | "IndexingAlbums"
  | "CachingArtwork"
  | "NotScanning";
