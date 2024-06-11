import SongListItem from "./SongListItem";

export interface SongData {
  id: number;
  albumName: string;
  artistName: string;
  songName: string;
}

export default function SongList () {
  const songs: SongData[] = [
    {id: 1, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 2, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 3, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
    {id: 4, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 5, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 6, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
    {id: 7, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 8, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 9, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
    {id: 10, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 11, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 12, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
    {id: 13, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 14, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 15, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
    {id: 16, albumName: 'Wallsocket fuashdklj', artistName: 'RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf', songName: 'Cops and RobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgfRobdfgf'},
    {id: 17, albumName: 'Surfer Rosa', artistName: "Pixies", songName: 'Where Is My Mind?'},
    {id: 18, albumName: 'Last year Was Weird, Vol. 3', artistName: "Tkay Maidza", songName: 'My Flowers'},
  ]

  return (
    <div className="flex flex-col h-full w-full basis-full overflow-auto">
      <SongListItem songName="Song Name" albumName="Album Name" artistName="Artist Name" />
      {songs.map(song => <SongListItem key={song.id} songName={song.songName} albumName={song.albumName} artistName={song.artistName} />)}
    </div>
  )
}