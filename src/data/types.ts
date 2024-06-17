export interface MusicTags {
  title: string;
  artist: string;
  album: string;
  genre: string;
  encoded_cover_art: string;
}

export interface Song {
  tags: MusicTags;
  filePath: string;
}