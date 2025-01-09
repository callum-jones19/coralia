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

  const navigateToAlbum = () => {
    const t = navigate(`/home/album/${album.id}`);
    if (t) {
      t.catch(e => console.error(e));
    }
  }

  return (
    <div className="p-2 w-full h-full flex flex-col justify-center items-center">
      <div className="p-2 w-full h-3/4 shadow-md bg-white rounded-md flex flex-col justify-between min-h-0 min-w-0 flex-grow">
        <img
          loading="lazy"
          src={imgSrc}
          width={360}
          height={360}
          alt="album-cover-image"
          className="rounded-m rounded-md self-center flex-shrink hover:cursor-pointer"
          onClick={() => navigateToAlbum()}
        />
        <div className="flex flex-col">
          <button
            title={album.title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline p-1 rounded-md"
            onClick={() => navigateToAlbum()}
          >
            {album.title}
          </button>
          <p className="text-center text-sm">{album.albumArtist}</p>
        </div>
      </div>
    </div>
  );
}
