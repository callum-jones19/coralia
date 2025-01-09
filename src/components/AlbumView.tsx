import { useEffect, useState } from "react";
import { getAlbum, getAlbumSongs } from "../api/importer";
import { Album, Song } from "../types";
import { useParams } from "react-router";
import { convertFileSrc } from "@tauri-apps/api/tauri";

export type AlbumViewParams =  string;

export default function AlbumView() {
  const { albumId } = useParams<AlbumViewParams>();


  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    console.log("Album ID updated!");
    console.log(albumId);

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

  const albumArtUri = album?.artwork.art400 ? convertFileSrc(album.artwork.art400) : undefined;

  console.log(album);
  console.log(songs);
  console.log(`albumArtUri: ${albumArtUri}`);

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
        <div className="flex flex-col gap-2 min-h-full">
          <div id="album-header" className="h-fit p-3 flex flex-row gap-3">
            <img
              alt="Album Art Image"
              src={albumArtUri}
              height="250px"
              width="250px"
              className="rounded-md"
            />
            <div className="flex flex-col justify-between gap-3">
              <div>
                <p className="font-extrabold text-4xl">{album.title}</p>
                <p className="italic text-2xl">{album.albumArtist}</p>
              </div>
              <div
                id="controls"
                className="w-full flex flex-row gap-2"
              >
                <button className="bg-gray-950 min-w-20 rounded-full text-white p-1">
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
              <div className="flex flex-row w-full gap-2 p-2 hover:bg-gray-300">
                <p className="flex-grow basis-1/12">#</p>
                <p className="flex-grow basis-1/2">Title</p>
                <p className="flex-grow basis-1/2">Genre</p>
              </div>
            </li>
            {songs.map((song, index) => {
              return (
                <li key={song.filePath}>
                  <div className="flex flex-row w-full gap-2 p-2 hover:bg-gray-300">
                    <button className="flex-grow basis-1/12 hover:bg-gray-500 text-left">
                      {index}
                    </button>
                    <p className="flex-grow basis-1/2">{song.tags.title}</p>
                    <p className="flex-grow basis-1/2">{song.tags.genre}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      }
    </>
  );
}
