import { useEffect, useState } from "react";
import { getAlbum, getAlbumSongs, getPlayerState } from "../api/importer";
import { Album, Song } from "../types";
import { Link, useParams } from "react-router";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import SongListItem from "./SongListItem";
import { ChevronLeft } from "react-feather";
import { enqueueSongsBackend } from "../api/commands";
import { listen } from "@tauri-apps/api/event";
import { Duration } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api";

export type AlbumViewParams =  string;

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
    }
  }, []);

  useEffect(() => {
    if (!albumId) return;

    const albumIdParsed = parseInt(albumId);

    getAlbum(albumIdParsed).then(album => {
      if (album) {
        setAlbum(album)
      }
    }).catch(e => console.error(e));
    getAlbumSongs(albumIdParsed).then(songs => {
      if (songs) {
        setSongs(songs)
      }
    }).catch(e => console.error(e));
  }, [albumId]);

  const albumArtUri = album?.artwork?.art400 ? convertFileSrc(album.artwork.art400) : "";

  return (
    <>
      {!album || songs.length === 0 && (
        <>
          <p>
            <i>
              Invalid album - given album ID does not exist
            </i>
          </p>
        </>
      )}
      {album && songs.length > 0 &&
        <div className="flex flex-col min-h-full">
          <Link
            className="w-fit p-2 ml-3 mt-2 rounded-md"
            to="/home/albums"
          >
            <ChevronLeft />
          </Link>
          <div id="album-header" className="h-fit p-3 flex flex-row gap-3">
            <img
              alt="Album Art Image"
              src={albumArtUri}
              height="250px"
              width="250px"
              className="rounded-md shadow-md"
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
                  className="bg-gray-950 min-w-20 rounded-full text-white p-1"
                  onClick={() => {
                    invoke("clear_queue", {})
                      .then(() => enqueueSongsBackend(songs))
                      .catch(e => console.error(e));
                  }}
                >
                  Play
                </button>
                <button className="bg-gray-950 min-w-20 rounded-full text-white p-1">
                  Shuffle
                </button>
                <button className="bg-gray-950 min-w-14 rounded-full text-white p-1">
                  ...
                </button>
              </div>
            </div>
          </div>
          <ul
            id="song-list"
            className="basis-1 flex-grow-1 p-3"
          >
            <li className="border-b-2">
              <div className="flex flex-row w-full gap-2 p-2">
                <p className="flex-grow basis-1/12">#</p>
                <p className="flex-grow basis-1/2">Title</p>
                <p className="flex-grow basis-1/2">Genre</p>
              </div>
            </li>
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
        </div>
      }
    </>
  );
}
