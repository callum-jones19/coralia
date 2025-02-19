import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { List, Maximize2 } from "react-feather";
import { Link } from "react-router";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types";
import Seekbar from "../SongControls/Seekbar";
import PlayButtons from "../SongControls/PlayButtons";
import CurrentSongInfo from "../SongControls/CurrentSongInfo";
import VolumeController from "../SongControls/VolumeController";
import BackgroundCard from "../UI/BackgroundCard";

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
    <BackgroundCard className="basis-16 pr-10 pl-10 rounded-md p-2">
      <div className="w-full h-full flex flex-row gap-6 items-center">
        <div className="basis-full flex flex-col justify-center h-full gap-2">
          <div className="flex flex-row justify-center flex-wrap gap-3">
            <PlayButtons />
            <CurrentSongInfo currentSong={currentSong} />
            <div className="flex flex-row items-center gap-4">
              <div className="block md:hidden">
                <List />
              </div>
              <VolumeController />
              <Link
                to={"/fullscreen"}
                onClick={() => {
                  appWindow.setFullscreen(true).catch(e => console.error(e));
                }}
              >
                <Maximize2 size="1em" />
              </Link>
            </div>
          </div>
          <Seekbar />
        </div>
      </div>
    </BackgroundCard>
  );
}
