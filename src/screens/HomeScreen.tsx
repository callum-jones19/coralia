import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { filter_songs_by_title } from "../data/importer";
import { MusicTags, Song, songsToTauriSongs } from "../data/types";

// FIXME consolidate music data into a single
export interface HomeScreenProps {
  changeAudioSrc: (song: Song) => void;
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
  allSongs: Song[];
  displayedSongs: Song[];
  onFilterSongs: (filteredSongs: Song[]) => void;
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
    changeAudioSrc,
    musicTags,
    startPlaying,
    currentSong,
    allSongs,
    displayedSongs,
    onFilterSongs
  }: HomeScreenProps,
) {

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar />
        {/* <MusicGrid changeAudioSrc={changeAudioSrc} /> */}
        <div className="basis-full flex-grow-0 min-w-0 relative">
          <SongList
            songList={displayedSongs}
            onSongClick={s => {
              if (s === currentSong) {
                toggleAudioPlaying();
              } else {
                changeAudioSrc(s);
                startPlaying();
              }
            }}
            currPlayingSong={currentSong}
          />
          <input
            className="p-4 absolute bottom-4 right-8 rounded-lg shadow-md"
            placeholder="song title filter"
            onChange={e => {
              console.log(e.target.value);
              filter_songs_by_title(e.target.value, { songs: songsToTauriSongs(allSongs) })
                .then(filtered_songs => onFilterSongs(filtered_songs))
                .catch(err => console.log(err))
            }}
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
      />
    </div>
  );
}
