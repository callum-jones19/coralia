import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { Song } from "../types";
import { get_library_songs } from "../api/importer";
import MusicFooter from "../components/MusicFooter";

export interface HomeScreenProps {
  isPaused: boolean;
  onUpdatePause: (isPaused: boolean) => void;
  onClickSkip: () => void;
  onChangeSong: (song: Song) => void;
  onEnqueueSong: (song: Song) => void;
  currentSong: Song | null;
  queue: Song[];
}

export default function HomeScreen({ onChangeSong, queue ,isPaused, onUpdatePause, onClickSkip, currentSong, onEnqueueSong }: HomeScreenProps) {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    get_library_songs()
      .then(songs => setSongs(songs))
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar queueSongs={queue} currSongAlbumUri={undefined} />
        <div className="basis-full flex-grow-0 min-w-0 relative overflow-auto">
          <SongList
            songList={songs}
            onSongClick={s => onChangeSong(s)}
            currPlayingSong={null}
            onAddToQueue={s => onEnqueueSong(s)}
          />
        </div>
      </div>
      <MusicFooter
        isPaused={isPaused}
        onUpdatePause={onUpdatePause}
        onClickSkip={onClickSkip}
        currentSong={currentSong}
      />
    </div>
  );
}
