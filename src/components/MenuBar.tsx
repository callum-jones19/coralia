import { useEffect, useState } from "react";
import { Disc, Music, Settings } from "react-feather";
import { useLocation, useNavigate } from "react-router";

type ActiveSection = "Songs" | "Albums";

export default function MenuBar() {
  const navigate = useNavigate();
  const loc = useLocation();

  const [activeSection, setActiveSection] = useState<ActiveSection>("Songs");

  useEffect(() => {
    console.log(loc);

    if (loc.pathname === '/home') {
      setActiveSection('Songs');
    } else if (loc.pathname === '/home/albums') {
      setActiveSection('Albums');
    }

  }, [loc]);

  const handleClickSongs = () => {
    const t = navigate("/home");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleClickAlbums = () => {
    const t = navigate("/home/albums");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleClickSettings = () => {
    const t = navigate("/settings");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  return (
    <>
      <div className="bg-neutral-950 basis-2/12 h-full">
        <div className="w-11/12 overflow-auto h-full flex flex-col justify-between gap-4 items-center p-2 pt-3 bg-neutral-900 rounded-b-md m-auto">
          <div className="w-full flex flex-col gap-2 items-start">
            <button
              className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-700 ${activeSection !== 'Songs' ? 'text-neutral-400' : 'bg-neutral-700'}`}
              onClick={() => handleClickSongs()}
            >
              <Music />
              <p>Songs</p>
              </button>
            <button
              className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-700  ${activeSection !== 'Albums' ? 'text-neutral-400' : 'bg-neutral-700'}`}
              onClick={() => handleClickAlbums()}
            >
              <Disc />
              <p>Albums</p>
              </button>
          </div>
          <button
              className="flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-700 text-neutral-300"
              onClick={() => handleClickSettings()}
          >
            <Settings />
            <p>Settings</p>
          </button>
        </div>
      </div>
    </>
  );
}
