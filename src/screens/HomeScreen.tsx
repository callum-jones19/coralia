import { useEffect, useState } from "react";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { filter_songs_by_title } from "../data/importer";
import { Album, MusicTags, Song } from "../data/types";
import MusicGrid from "../components/MusicGrid";
import { invoke } from "@tauri-apps/api";

// FIXME consolidate music data into a single
export interface HomeScreenProps {
  onClickSong: (song: Song) => void;
  toggleAudioPlaying: () => void;
  setSongPos: (newPos: number) => void;
  songPos: number;
  isPlaying: boolean;
  songDuration: number;
  volume: number;
  setVolume: (newVol: number) => void;
  musicTags: MusicTags | null;
  startPlaying: () => void;
  currentSong: Song | null;
  queue: Song[];
  onQueueAdd: (songToAdd: Song) => void;
  songs: Song[];
  onSkipSong: () => void;
  albums: Album[];
}

export default function HomeScreen(
  {
    toggleAudioPlaying,
    isPlaying,
    setSongPos,
    setVolume,
    songDuration,
    songPos,
    volume,
    onClickSong,
    musicTags,
    currentSong,
    queue,
    onQueueAdd,
    onSkipSong,
    songs,
    albums
  }: HomeScreenProps,
) {
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar queueSongs={queue} currSongAlbumUri={currentSong?.tags.encodedCoverArt} />
        <div className="basis-full flex-grow-0 min-w-0 relative overflow-auto">
          {/* <SongList
            songList={filteredSongs.length === 0 ? songs : filteredSongs}
            onSongClick={s => {
              onClickSong(s);
            }}
            currPlayingSong={currentSong}
            onUpdateQueue={onQueueAdd}
          />
          <input
            className="p-4 absolute bottom-4 right-8 rounded-lg shadow-md"
            placeholder="song title filter"
            onChange={e => {
              console.log(e.target.value);
              if (e.target.value !== "") {
                filter_songs_by_title(e.target.value)
                  .then(filtered_songs => setFilteredSongs(filtered_songs))
                  .catch(err => console.log(err));
              } else {
                setFilteredSongs([]);
              }
            }}
          /> */}
          <MusicGrid albums={albums} />
        </div>
      </div>
      <MusicFooter
        currSongArtist={!musicTags ? "..." : musicTags.artist}
        currSongName={!musicTags ? "..." : musicTags.title}
        toggleAudioPlaying={toggleAudioPlaying}
        isPlaying={isPlaying}
        setSongPos={setSongPos}
        setVolume={setVolume}
        songDuration={songDuration}
        songPos={songPos}
        volume={volume}
        onSkipSong={onSkipSong}
      />
    </div>
  );
}
