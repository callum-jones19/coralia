import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Link } from "react-router";
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

  return (
    <div className="flex-grow basis-full h-full flex flex-col overflow-auto">
      <div className="w-full h-full p-2 flex-grow-0 flex-shrink-0 m-auto flex flex-col gap-1">
        <div className="basis-1/2 w-full overflow-auto flex-grow">
          <img
            src={imgSrc}
            className="rounded-lg h-full m-auto"
          />
        </div>
        <div>
          <Link
            to={`/home/album/${album.id}`}
            title={album.title}
            className="w-full"
          >
            <p className="font-bold text-center text-nowrap overflow-hidden text-ellipsis hover:underline rounded-md">
              {album.title}
            </p>
          </Link>
          <p className="w-full text-center text-nowrap overflow-hidden text-ellipsis text-neutral-700">
            {album.albumArtist}
          </p>
        </div>
      </div>
    </div>
  );
}
