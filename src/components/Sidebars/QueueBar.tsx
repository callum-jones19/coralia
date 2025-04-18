import { convertFileSrc } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getPlayerState } from "../../api/importer";
import { Song } from "../../types/types";
import BackgroundCard from "../UI/BackgroundCard";
import QueueList from "./QueueList";
import { QueueUpdatePayload } from "../../types/apiTypes";
import midsizeDefaultImg from "./../../assets/no_art_icon_md.png";

export default function QueueBar() {
  const [queue, setQueue] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayerState()
      .then(cachedState => {
        console.log(cachedState);
        setQueue(cachedState.songsQueue);
      })
      .catch(e => console.error(e));

    const unlistenQueue = listen<QueueUpdatePayload>(
      "queue-change",
      e => {
        const newQueue = e.payload.newQueue;
        setQueue(newQueue);
      },
    );

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const imgSrc = useMemo(() => {
    const currentSong = queue.at(0);

    if (currentSong === undefined) {
      return undefined;
    } else {
      if (currentSong.artwork) {
        return convertFileSrc(currentSong.artwork.art400);
      }  else {
        return midsizeDefaultImg;
      }
    }
  }, [queue]);

  return (
    <BackgroundCard className="hidden lg:block basis-60 h-full flex-grow-0 flex-shrink-0 overflow-hidden p-2">
      <div className="h-full flex flex-col gap-3 justify-between">
        <QueueList />
        <div className="flex flex-col gap-3">
          {imgSrc && (
            <img
              alt="Currently playing song album art"
              src={imgSrc}
              className="w-full aspect-square rounded-lg hover:cursor-pointer"
              onClick={() => {
                const navRes = navigate(`album/${queue[0].album}`);
                if (navRes) {
                  navRes.catch(e => console.error(e));
                }
              }}
            />
          )}
        </div>
      </div>
    </BackgroundCard>
  );
}
