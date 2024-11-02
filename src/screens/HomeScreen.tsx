import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import SongList from "../components/SongList";
import { Song } from "../types";
import { get_library_songs } from "../api/importer";

export default function HomeScreen() {
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
      {/* <MusicFooter
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
      /> */}
    </div>
  );
}
