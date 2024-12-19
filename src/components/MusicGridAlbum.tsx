import { Artwork } from "../types";

export interface MusicGridAlbumProps {
  artSrc: Artwork;
  title: string;
  artist: string;
}

export default function MusicGridAlbum(
  { artSrc, title, artist }: MusicGridAlbumProps,
) {
  return (
    <>
      <div className="p-2 h-full shadow-md bg-white rounded-md flex flex-col justify-between min-h-0 min-w-0">
        <img
          src={artSrc.cachedEmbeddedArt}
          height={400}
          width={400}
          alt="album-cover-image"
          className="mb-3 rounded-m rounded-md"
        />
        <div className="flex-shrink-0">
          <h4
            title={title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis"
          >
            {title}
          </h4>
          <p className="font-light text-center">{artist}</p>
        </div>
      </div>
    </>
  );
}
