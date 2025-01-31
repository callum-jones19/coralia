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
      <div className="w-full h-full p-2 flex-grow-0 flex-shrink-0 m-auto flex flex-col">
      <div className="basis-1/2 w-full overflow-auto flex-grow">
            <img
              src={imgSrc}
              className="rounded-lg h-full m-auto"
            />
          </div>
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
      {/* <div className="h-full w-full rounded-md">
        {imgSrc && (
          <img
            loading="lazy"
            src={imgSrc}
            alt="album-cover-image"
            className="rounded-md self-center flex-shrink hover:cursor-pointer sh"
            onClick={() => navigateToAlbum()}
          />
        )}
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
      </div> */}
    </div>
  );
}
