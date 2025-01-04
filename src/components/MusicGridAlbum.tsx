import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Album } from "../types";

export interface MusicGridAlbumProps {
  album: Album
}

export default function MusicGridAlbum(
  { album }: MusicGridAlbumProps,
) {
  const imgSrc = album.artwork?.fullResArt ? convertFileSrc(album.artwork?.fullResArt) : undefined;

  return (
    <>
      <div className="p-2 h-full shadow-md bg-white rounded-md flex flex-col justify-between min-h-0 min-w-0">
        <img
          loading="lazy"
          src={imgSrc}
          width={400}
          height={400}
          alt="album-cover-image"
          className="mb-3 rounded-m rounded-md"
        />
        <div className="flex-shrink-0">
          <p
            title={album.title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline"
          >
            {album.title}
          </p>
          <p className="text-center text-sm">{album.albumArtist}</p>
        </div>
      </div>
    </>
  );
}
