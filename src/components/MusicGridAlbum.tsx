import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router";
import { Album } from "../types";

export interface MusicGridAlbumProps {
  album: Album;
}

export default function MusicGridAlbum(
  { album }: MusicGridAlbumProps,
) {
  const imgSrc = album.artwork?.art400
    ? convertFileSrc(album.artwork?.art400)
    : undefined;

  const navigate = useNavigate();

  const navigateToAlbum = () => {
    const t = navigate(`/home/album/${album.id}`);
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  return (
    <div className="p-2 w-full h-full flex flex-col justify-center items-center">
      <div className="p-2 w-full h-3/4 rounded-md flex flex-col justify-between min-h-0 min-w-0 flex-grow">
        <div className="m-auto relative">
          {imgSrc && (
            <img
              loading="lazy"
              src={imgSrc}
              alt="album-cover-image"
              className="rounded-md self-center flex-shrink hover:cursor-pointer sh"
              onClick={() => navigateToAlbum()}
            />
          )}
          {
            /* {isHovering
            && (
              <button
                className="bg-black p-5 rounded-full absolute bottom-3 right-3 shadow-md"
                onClick={() => {
                  const albumSongsReq = getAlbumSongs(album.id);
                  albumSongsReq
                    .then(songs => {
                      if (!songs) return Promise.reject();
                      invoke("clear_queue", {}).catch(e => console.error(e));
                      return songs;
                    })
                    .then(songs => enqueueSongsBackend(songs))
                    .catch(e => console.error(e));
                }}
              >
                <Play />
              </button>
            )} */
          }
        </div>
        <div className="flex flex-col">
          <button
            title={album.title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline p-1 rounded-md"
            onClick={() => navigateToAlbum()}
          >
            {album.title}
          </button>
          <p className="text-center text-sm overflow-hidden text-nowrap text-ellipsis">
            {album.albumArtist}
          </p>
        </div>
      </div>
    </div>
  );
}
