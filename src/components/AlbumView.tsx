import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { ChevronLeft, Play, Shuffle } from "react-feather";
import { useNavigate, useParams } from "react-router";
import { enqueueSongsBackend } from "../api/commands";
import { getAlbum, getAlbumSongs, getPlayerState } from "../api/importer";
import { Album, Song } from "../types";
import SongListItem from "./SongListItem";
import SongListHeader from "./SongListHeader";

export type AlbumViewParams = string;

export default function AlbumView() {
  const { albumId } = useParams<AlbumViewParams>();

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getPlayerState()
      .then(d => setCurrentSong(d.songsQueue[0]))
      .catch(e => console.error(e));

    const unlistenQueue = listen<[Song[], Duration]>("queue-change", e => {
      const newQueue = e.payload[0];
      setCurrentSong(newQueue[0]);
    });

    return () => {
      unlistenQueue
        .then(f => f)
        .catch(e => console.log(e));
    };
  }, []);

  useEffect(() => {
    if (!albumId) return;

    const albumIdParsed = parseInt(albumId);

    getAlbum(albumIdParsed).then(album => {
      if (album) {
        setAlbum(album);
      }
    }).catch(e => console.error(e));
    getAlbumSongs(albumIdParsed).then(songs => {
      if (songs) {
        setSongs(songs);
      }
    }).catch(e => console.error(e));
  }, [albumId]);

  const albumArtUri = album?.artwork?.art400
    ? convertFileSrc(album.artwork.art400)
    : "";

  const navigate = useNavigate();
  const handleBackClick = () => {
    // TODO
    const t = navigate(-1);
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  return (
    <div className="flex flex-col basis-9 flex-grow overflow-auto">
      {!album || songs.length === 0 && (
            <>
              <p>
                <i>
                  Invalid album - given album ID does not exist
                </i>
              </p>
            </>
          )}
      {album && songs.length > 0
        && (
          <>
            <button
              className="w-fit p-2 ml-3 mt-2 rounded-md"
              onClick={() => handleBackClick()}
            >
              <ChevronLeft />
            </button>
            <div id="album-header" className="h-fit p-3 flex flex-row gap-3">
              <img
                alt="Album Art Image"
                src={albumArtUri}
                height="250px"
                width="250px"
                className="rounded-md shadow-md aspect-square flex-grow-0 flex-shrink-0"
              />
              <div className="flex flex-col justify-between gap-3">
                <div>
                  <p className="font-bold text-4xl">{album.title}</p>
                  <p className="italic text-xl">{album.albumArtist}</p>
                </div>
                <div
                  id="controls"
                  className="w-full flex flex-row gap-2"
                >
                  <button
                    className="bg-neutral-950 rounded-full p-4"
                    onClick={() => {
                      invoke("clear_queue", {})
                        .then(() => enqueueSongsBackend(songs))
                        .catch(e => console.error(e));
                    }}
                  >
                    <Play />
                  </button>
                  <button
                    disabled
                    className="bg-neutral-950 rounded-full p-4 disabled:bg-neutral-800"
                  >
                    <Shuffle />
                  </button>
                </div>
              </div>
            </div>
            <ul
              id="song-list"
              className="basis-1 flex-grow-1 p-3"
            >
              <SongListHeader />
              {songs.map(song => (
                <div key={song.id} className="h-14">
                  <SongListItem
                    song={song}
                    colored={false}
                    currentlyPlayingId={currentSong?.id}
                  />
                </div>
              ))}
            </ul>
          </>
        )}
    </div>
  );
}
