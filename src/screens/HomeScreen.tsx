import { useEffect, useState } from "react";
import { getLibrarySongs } from "../api/importer";
import MusicFooter from "../components/MusicFooter";
import SongList from "../components/SongList";

export default function HomeScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row flex-grow h-1 flex-shrink">
        {/*<SideBar queueSongs={queue} currSongAlbumUri={undefined} />*/}
        <div className="basis-full flex-grow-0 min-w-0 relative overflow-auto">
          <SongList />
        </div>
      </div>
      <MusicFooter />
    </div>
  );
}
