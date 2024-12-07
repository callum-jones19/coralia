import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { getPlayerState } from "../api/importer";
import { Song } from "../types";
import PlayButtons from "./PlayButtons";
import Seekbar from "./Seekbar";
import SongInfoFooter from "./SongInfoFooter";
import VolumeController from "./VolumeController";

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    getPlayerState()
      .then(initState => setCurrentSong(initState.songsQueue[0]))
      .catch(e => console.error(e));

    const unlistenSongChange = listen<Song | undefined>(
      "currently-playing-update",
      e => {
        const newCurrentSong = e.payload;
        if (newCurrentSong) {
          setCurrentSong(newCurrentSong);
        } else {
          setCurrentSong(null);
        }
      },
    );

    return () => {
      unlistenSongChange
        .then(f => f)
        .catch(e => console.log(e));
    };
  }, []);

  return (
    <div className="bg-gray-950 basis-16 flex-shrink-0 pt-3 pb-3">
      <div className="flex flex-col justify-center h-full gap-2">
        <div className="flex flex-row mr-10 ml-10 justify-between">
          <PlayButtons />
          <SongInfoFooter currentSong={currentSong} />
          <VolumeController />
        </div>
        <Seekbar />
      </div>
    </div>
  );
}
