import { useState } from "react";
import MusicFooter from "../components/MusicFooter";
import MusicGrid from "../components/MusicGrid";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { filter_songs_by_title } from "../data/importer";
import { Album, MusicTags, Song } from "../data/types";
import AlbumScreen from "./AlbumScreen";

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
    albums,
  }: HomeScreenProps,
) {
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar
          queueSongs={queue}
          currSongAlbumUri={currentSong?.tags.encodedCoverArt}
        />
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
          {/* <MusicGrid albums={albums} /> */}
          <AlbumScreen
            albumArtUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi0.wp.com%2Fcultfollowing.co.uk%2Fwp-content%2Fuploads%2F2023%2F05%2FBlur-The-Ballad-of-Darren.png%3Ffit%3D927%252C929%26ssl%3D1&f=1&nofb=1&ipt=4d6f94d6e1b71c3b1004a2b28df6abba526a86ff70277f7340b5cbee9aa10453&ipo=images"
            songs={songs.filter(song => song.tags.album === "The Ballad of Darren")}
          />
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
