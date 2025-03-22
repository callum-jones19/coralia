import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Play, Shuffle } from "react-feather";
import { useParams } from "react-router";
import { enqueueSongsBackend, playPlayer } from "../../api/commands";
import { getAlbum, getAlbumSongs, getPlayerState } from "../../api/importer";
import { Album, Song } from "../../types/types";
import SongListHeader from "../SongListHeader";
import SongListHeaderDense from "../SongListHeaderDense";
import SongListItem from "../SongListItem";
import SongListItemDense from "../SongListItemDense";
import { QueueUpdatePayload } from "../../types/apiTypes";

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

    const unlistenQueue = listen<QueueUpdatePayload>("queue-change", e => {
      const newQueue = e.payload.newQueue;
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
    <div className="flex flex-col h-full gap-5 overflow-auto">
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
            <div className="w-full flex flex-col gap-4">
              <div
                id="album-header"
                className="flex flex-row flex-grow gap-3 pl-3 pt-3 flex-wrap justify-start"
              >
                <img
                  alt="Album Art Image"
                  src={albumArtUri}
                  height="250px"
                  width="250px"
                  className="rounded-md shadow-md"
                />
                <div className="flex flex-col justify-end gap-1 overflow-hidden">
                  <p className="font-semibold text-4xl text-nowrap overflow-hidden text-ellipsis pb-2">
                    {album.title}
                  </p>
                  <p className="text-xl font- text-nowrap overflow-hidden text-ellipsis">
                    {album.albumArtist}
                  </p>
                </div>
              </div>
              <div
                id="controls"
                className="w-full flex flex-row gap-3 pl-3"
              >
                <button
                  className="hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md p-2"
                  onClick={() => {
                    invoke("clear_queue", {})
                      .then(() => enqueueSongsBackend(songs))
                      .then(() => playPlayer())
                      .catch(e => console.error(e));
                  }}
                >
                  <Play className="fill-black text-black dark:text-white dark:fill-white" />
                </button>

              </div>
            </div>
            <ul
              id="song-list"
              className="basis-full w-full"
            >
              <div className="h-10 sticky top-0 hidden sm:block z-20">
                <SongListHeader />
              </div>
              <div className="h-10 sticky top-0 block sm:hidden z-20">
                <SongListHeaderDense />
              </div>
              <div className="hidden sm:block">
                {songs.map(song => (
                  <div key={song.id} className="h-14">
                    <SongListItem
                      song={song}
                      colored={false}
                      currentlyPlayingId={currentSong?.id}
                    />
                  </div>
                ))}
              </div>
              <div className="block sm:hidden">
                {songs.map(song => (
                  <div key={song.id} className="h-14">
                    <SongListItemDense
                      song={song}
                      colored={false}
                      currentlyPlayingId={currentSong?.id}
                    />
                  </div>
                ))}
              </div>
            </ul>
          </>
        )}
    </div>
  );
}
