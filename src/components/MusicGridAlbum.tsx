export interface MusicGridAlbumProps {
  artSrc: string;
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
          src={artSrc}
          alt="album-cover-image"
          className="mb-3 rounded-m basis-1 rounded-md"
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
