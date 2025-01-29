import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Disc, Music, Search, Settings } from "react-feather";
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

  const handleClickBack = () => {
    const t = navigate(-1);
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleClickForward = () => {
    const t = navigate(1);
    if (t) {
      t.catch(e => console.error(e));
    }
  }

  return (
    <>
      <div className="basis-2/12 h-full">
        <div className="w-11/12 h-full flex flex-col justify-between bg-neutral-100 gap-4 items-center p-2 pt-3 rounded-md m-auto">
          <div className="w-full flex flex-col gap-2 items-start">
            <div className="w-full flex flex-row justify-between gap-2">
              <button className="hover:bg-neutral-300 bg-neutral-200 p-2 rounded-md" onClick={handleClickBack}><ChevronLeft/></button>
              <button className="bg-neutral-200 flex-grow rounded-md flex flex-row items-center gap-2 text-neutral-600">
                <Search className="ml-2"/>
                <p>Search</p>
              </button>
              <button className="hover:bg-neutral-300 bg-neutral-200 p-2 rounded-md" onClick={handleClickForward}><ChevronRight /></button>
            </div>
            <button
              className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 ${activeSection !== 'Songs' ? 'hover:bg-neutral-200' : 'bg-neutral-300'}`}
              onClick={() => handleClickSongs()}
            >
              <Music />
              <p>Songs</p>
              </button>
            <button
              className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2  ${activeSection !== 'Albums' ? 'hover:bg-neutral-200' : 'bg-neutral-300'}`}
              onClick={() => handleClickAlbums()}
            >
              <Disc />
              <p>Albums</p>
              </button>
          </div>
          <button
              className="flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-300"
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
