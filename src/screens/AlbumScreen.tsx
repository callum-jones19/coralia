import { Song } from "../data/types";

export interface AlbumArtProps {
  albumArtUri: string;
  songs: Song[];
}

export default function AlbumScreen ({ albumArtUri, songs }: AlbumArtProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div id="album-header" className="h-fit p-3 flex flex-row gap-3">
        <img
          alt="Album Art Image"
          src={albumArtUri}
          height="250px"
          width="250px"
          className="rounded-md"
        />
        <div className="flex flex-col justify-between gap-3">
          <div>
            <p className="font-extrabold text-4xl">The Ballad of Darren</p>
            <p className="italic text-2xl">Blur</p>
          </div>
          <div
            id="controls"
            className="w-full flex flex-row gap-2"
          >
            <button className="bg-gray-950 min-w-20 rounded-full text-white p-1">Play</button>
            <button className="bg-gray-950 min-w-20 rounded-full text-white p-1">Shuffle</button>
            <button className="bg-gray-950 min-w-14 rounded-full text-white p-1">...</button>
          </div>
        </div>
      </div>
      <ul
        id="song-list"
        className="basis-1 flex-grow-1 p-3"
      >
        <li className="border-b-2">
          <div className="flex flex-row w-full gap-2 p-2 hover:bg-gray-300">
            <p className="flex-grow basis-1/12">#</p>
            <p className="flex-grow basis-1/2">Title</p>
            <p className="flex-grow basis-1/2">Genre</p>
          </div>
        </li>
        {songs.map(song => {
          return (
            <li key={song.filePath}>
              <div className="flex flex-row w-full gap-2 p-2 hover:bg-gray-300">
                <button className="flex-grow basis-1/12 hover:bg-gray-500 text-left">1</button>
                <p className="flex-grow basis-1/2">{song.tags.title}</p>
                <p className="flex-grow basis-1/2">{song.tags.genre}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}