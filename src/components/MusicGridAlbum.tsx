
export interface MusicGridAlbumProps {
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
          loading="lazy"
          width={400}
          height={400}
          alt="album-cover-image"
          className="mb-3 rounded-m rounded-md"
        />
        <div className="flex-shrink-0">
          <p
            title={title}
            className="font-bold text-l text-center overflow-hidden text-nowrap text-ellipsis hover:underline"
          >
            {title}
          </p>
          <p className="text-center text-sm">{artist}</p>
        </div>
      </div>
    </>
  );
}
