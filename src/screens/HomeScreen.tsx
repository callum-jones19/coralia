import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { Song } from "../types";
import { get_library_songs } from "../api/importer";
import MusicFooter from "../components/MusicFooter";

export interface HomeScreenProps {
  isPaused: boolean;
  volume: number;
  onUpdatePause: (isPaused: boolean) => void;
  onUpdateVolume: (newVol: number) => void;
  onClickSkip: () => void;
}

export default function HomeScreen({ isPaused, onUpdatePause, onClickSkip, onUpdateVolume, volume }: HomeScreenProps) {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    get_library_songs()
      .then(songs => setSongs(songs))
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        <SideBar queueSongs={[]} currSongAlbumUri={undefined} />
        <div className="basis-full flex-grow-0 min-w-0 relative overflow-auto">
          <SongList
            songList={songs}
            onSongClick={s => console.log(s)}
            currPlayingSong={null}
            onUpdateQueue={() => console.log("todo")}
          />
        </div>
      </div>
      <MusicFooter
        isPaused={isPaused}
        onUpdatePause={onUpdatePause}
        onClickSkip={onClickSkip}
        onUpdateVolume={onUpdateVolume}
        volume={volume}
      />
    </div>
  );
}
