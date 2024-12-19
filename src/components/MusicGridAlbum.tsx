import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Artwork } from "../types";
import { Link } from "react-router";

export interface MusicGridAlbumProps {
  artSrc: Artwork;
  title: string;
  artist: string;
}

export default function MusicGridAlbum(
  { artSrc, title, artist }: MusicGridAlbumProps,
) {
  console.log('test')
  return (
    <>
      <div className="p-2 h-full shadow-md bg-white rounded-md flex flex-col justify-between min-h-0 min-w-0">
        {/* <img
          src={convertFileSrc(artSrc.folderAlbumArt)}
          height={400}
          width={400}
          alt="album-cover-image"
          className="mb-3 rounded-m rounded-md"
        /> */}
        <div className="flex-shrink-0">
          <Link
            title={title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline"
            to="/home/albums"
          >
            {title}
          </Link>
          <p className="text-center text-sm">{artist}</p>
        </div>
      </div>
    </>
  );
}
