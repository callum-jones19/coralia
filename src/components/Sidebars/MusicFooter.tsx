import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
import { Maximize2 } from "react-feather";
import { Link } from "react-router";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types/types";
import QueuePopup from "../QueuePopup";
import CurrentSongInfo from "../SongControls/CurrentSongInfo";
import PlayButtons from "../SongControls/PlayButtons";
import Seekbar from "../SongControls/Seekbar";
import VolumeController from "../SongControls/VolumeController";
import BackgroundCard from "../UI/BackgroundCard";
import { QueueUpdatePayload, SongEndPayload } from "../../types/apiTypes";

const appWindow = getCurrentWebviewWindow();

// TODO send down the isReady variable, so we can make things like the song
// duration variable change only when the new data has been loaded in from
// the song
export default function MusicFooter() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    getPlayerState()
      .then(initState => setCurrentSong(initState.songsQueue[0]))
      .catch(e => console.error(e));

    const unlistenSongEnd = listen<SongEndPayload>(
      "song-end",
      e => {
        const newCurrentSong = e.payload.newQueue[0];
        if (newCurrentSong) {
          setCurrentSong(newCurrentSong);
        } else {
          setCurrentSong(null);
        }
      },
    );

    const unlistenQueue = listen<QueueUpdatePayload>("queue-change", e => {
      const newQueue = e.payload.newQueue;
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
              <div className="block lg:hidden">
                <QueuePopup />
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
