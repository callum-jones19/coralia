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
  artwork: Artwork;
  properties: SongProperties;
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
}

export interface Artwork {
  cachedEmbeddedArt: string | undefined;
  folderAlbumArt: string | undefined;
}

export interface Album {
  title: string;
  albumArtist: string;
  albumSongs: Song[];
  artwork: Artwork;
}
