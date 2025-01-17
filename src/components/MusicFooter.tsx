import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { getPlayerState } from "../api/importer";
import { Song } from "../types";
import PlayButtons from "./PlayButtons";
import Seekbar from "./Seekbar";
import SongInfoFooter from "./SongInfoFooter";
import VolumeController from "./VolumeController";
import { Duration } from "@tauri-apps/api/http";
import { Maximize2, Minimize2 } from "react-feather";
import { Link } from "react-router";

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    getPlayerState()
      .then(initState => setCurrentSong(initState.songsQueue[0]))
      .catch(e => console.error(e));

    const unlistenSongEnd = listen<Song | undefined>(
      "song-end",
      e => {
        const newCurrentSong = e.payload;
        if (newCurrentSong) {
          setCurrentSong(newCurrentSong);
        } else {
          setCurrentSong(null);
        }
      },
    );

    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      const newQueue = e.payload[0];
      setCurrentSong(newQueue[0]);
    });

    return () => {
      unlistenSongEnd
        .then(f => f)
        .catch(e => console.log(e));
      unlistenQueue
        .then(f => f)
        .catch(e => console.log(e));
  };
  }, []);

  return (
    <div className="bg-neutral-950 basis-16 pt-3 pb-3 pr-10 pl-10">
      <div className="flex flex-col justify-center h-full gap-2">
        <div className="flex flex-row justify-between">
          <PlayButtons />
          <SongInfoFooter currentSong={currentSong} />
          <div className="flex flex-row items-center gap-2">
            <VolumeController />
            <Link to={"/fullscreen"} className="">
              <Maximize2 size="1em" />
            </Link>
          </div>
        </div>
        <Seekbar />
      </div>
    </div>
  );
}
