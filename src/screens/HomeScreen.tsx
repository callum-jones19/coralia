import { useEffect, useState } from "react";
import MusicFooter from "../components/MusicFooter";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { filter_songs_by_title, get_all_songs, get_queue } from "../data/importer";
import { MusicTags, Song } from "../data/types";

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
  }: HomeScreenProps,
) {

  const [songs, setSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    get_all_songs()
      .then(songs => setSongs(songs))
      .catch(err => console.log(`Error on initial load of songs in HomeScreen: ${err}`))

    get_queue()
      .then(queue => setQueue(queue))
      .catch(err => console.log(err))

  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar queueSongs={queue} />
        {/* <MusicGrid changeAudioSrc={changeAudioSrc} /> */}
        <div className="basis-full flex-grow-0 min-w-0 relative">
          <SongList
            songList={songs}
            onSongClick={s => {
              if (s === currentSong) {
                toggleAudioPlaying();
              } else {
                changeAudioSrc(s);
                startPlaying();
              }
            }}
            currPlayingSong={currentSong}
            onUpdateQueue={queue => setQueue(queue)}
          />
          <input
            className="p-4 absolute bottom-4 right-8 rounded-lg shadow-md"
            placeholder="song title filter"
            onChange={e => {
              if (e.target.value === '') {
                get_all_songs()
                  .then(songs => setSongs(songs))
                  .catch(err => console.log(err));
              } else {
              filter_songs_by_title(e.target.value)
                .then(filtered_songs => setSongs(filtered_songs))
                .catch(err => console.log(err));
              }
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
