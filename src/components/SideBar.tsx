import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Volume1 } from "react-feather";
import { useImage } from "react-image";
import { Song } from "../types";
import { Link } from "react-router";

export default function SideBar() {
  const [queue, setQueue] = useState<Song[]>([]);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);

  useEffect(() => {
    const unlistenQueue = listen<Song[]>("queue-change", e => {
      console.log("help");
      const newQueue = e.payload;
      setQueue(newQueue);
      if (newQueue.length > 0 && newQueue[0].artwork.folderAlbumArt) {
        setArtworkUrl(convertFileSrc(newQueue[0].artwork.folderAlbumArt));
      } else {
        setArtworkUrl(null);
      }
    });

    return () => {
      unlistenQueue.then(f => f).catch(e => console.log(e));
    };
  }, []);

  const { src } = useImage({
    srcList: artworkUrl ? artworkUrl : "",
    useSuspense: false,
  });

  return (
    <div className="w-72 bg-neutral-800 h-full flex-grow-0 flex-shrink-0 pr-2 pl-2">
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <li className="flex flex-col gap-3 text-white flex-grow overflow-auto">
          {queue.length === 0 && <ul>Empty queue</ul>}
          {queue.map((song, index) => {
            return (
              <ul
                key={`${song.filePath}-${index}`}
                className="flex flex-row gap-2 w-full items-center"
              >
                {index === 0 && <Volume1 size="1em" />}
                {index !== 0 && <p>{index}.</p>}
                {/* <img alt="album art" src={tmp} className="w-6 aspect-square" /> */}
                <p>{song.tags.title}</p>
              </ul>
            );
          })}
        </li>
        <Link to="/home" className="bg-white rounded-sm text-center">Songs</Link>
        <Link to="/home/albums" className="bg-white rounded-sm text-center">Albums</Link>
        <div className="flex flex-col gap-3">
          {artworkUrl !== null
            && (
              <img
                alt="Currently playing song album art"
                src={src}
                className="w-full aspect-square rounded-lg"
              />
            )}
        </div>
      </div>
    </div>
  );
}
