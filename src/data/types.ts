export interface MusicTags {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface Song {
  tags: MusicTags;
  filePath: string;
}