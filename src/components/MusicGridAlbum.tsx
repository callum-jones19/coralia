import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Album } from "../types";
import { useNavigate } from "react-router";

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

  return (
    <>
      <div className="p-2 w-full shadow-md bg-white rounded-md flex flex-col justify-between min-h-0 min-w-0">
        <img
          loading="lazy"
          src={imgSrc}
          width={400}
          height={400}
          alt="album-cover-image"
          className="mb-3 rounded-m rounded-md"
        />
        <div className="flex-shrink-0">
          <button
            title={album.title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline"
            onClick={() => {
              const t = navigate(`/home/album/${album.id}`);
              if (t) {
                t.catch(e => console.error(e));
              }
            }}
          >
            {album.title}
          </button>
          <p className="text-center text-sm">{album.albumArtist}</p>
        </div>
      </div>
    </>
  );
}
