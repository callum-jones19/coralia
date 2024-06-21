export interface MusicGridAlbumProps {
  artSrc: string;
  title: string;
  artist: string;
  changeAudioSrc: (newSrc: string) => void;
}

export default function MusicGridAlbum(
  { artSrc, title, artist }: MusicGridAlbumProps,
) {
  return (
    <>
      <div className="p-2 w-full shadow-md bg-white rounded-md aspect-square">
        <img
          src={artSrc}
          alt="album-cover-image"
          className="mb-3 rounded-md w-full"
        />
        <h4 className="font-bold text-l text-center">{title}</h4>
        <p className="font-light text-center">{artist}</p>
      </div>
    </>
  );
}
