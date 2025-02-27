import { convertFileSrc } from "@tauri-apps/api/core";
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

  const thumbSrc = album.artwork?.thumbArt
    ? convertFileSrc(album.artwork?.thumbArt)
    : undefined;

  return (
    <div className="flex-grow basis-full h-full flex flex-col overflow-auto">
      <div className="w-full h-full p-2 flex-grow-0 flex-shrink-0 m-auto flex flex-col gap-1">
        <Link
          to={`/home/album/${album.id}`}
          className="basis-1/2 w-full overflow-auto flex-grow"
        >
          <img
            loading="lazy"
            src={imgSrc}
            alt={`Album art for ${album.title}`}
            className="rounded-lg h-full m-auto"
          />
        </Link>
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
          <p className="w-full text-center text-nowrap overflow-hidden text-ellipsis text-neutral-700 dark:text-neutral-300">
            <i>{album.albumArtist}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
