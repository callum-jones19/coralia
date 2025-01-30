import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Play, Shuffle } from "react-feather";
import { useParams } from "react-router";
import { enqueueSongsBackend } from "../api/commands";
import { getAlbum, getAlbumSongs, getPlayerState } from "../api/importer";
import { Album, Song } from "../types";
import SongListHeader from "./SongListHeader";
import SongListItem from "./SongListItem";

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

  return (
    <div className="flex flex-col h-full gap-3 overflow-auto">
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
            <div
              id="album-header"
              className="h-fit flex flex-row gap-3 pl-3 pt-3 w-full"
            >
              <img
                alt="Album Art Image"
                src={albumArtUri}
                height="250px"
                width="250px"
                className="rounded-md shadow-md aspect-square flex-grow-0 flex-shrink-0"
              />
              <div className="flex flex-col justify-end gap-3 w-full pr-3">
                <p className="font-bold text-4xl">{album.title}</p>
                <p className="italic text-xl">{album.albumArtist}</p>
              </div>
            </div>
            <div
              id="controls"
              className="w-full flex flex-row gap-3 pl-3"
            >
              <button
                className="hover:bg-neutral-300 rounded-md p-2"
                onClick={() => {
                  invoke("clear_queue", {})
                    .then(() => enqueueSongsBackend(songs))
                    .catch(e => console.error(e));
                }}
              >
                <Play fill="black" />
              </button>
              <button
                disabled
                className="rounded-full disabled:text-neutral-400"
              >
                <Shuffle />
              </button>
            </div>
            <ul
              id="song-list"
              className="basis-full max-w-full"
            >
              <div className="h-10 sticky top-0">
                <SongListHeader />
              </div>
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
