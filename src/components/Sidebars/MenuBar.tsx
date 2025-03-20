import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Disc,
  Music,
  Settings,
} from "react-feather";
import { useLocation, useNavigate } from "react-router";
import { SearchResults } from "../../types/types";
import SearchBar from "../SearchBar";
import BackgroundCard from "../UI/BackgroundCard";

type ActiveSection = "Songs" | "Albums";

export interface MenuBarProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function MenuBar({ onSearch }: MenuBarProps) {
  const navigate = useNavigate();
  const loc = useLocation();

  const [activeSection, setActiveSection] = useState<ActiveSection>("Songs");
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  useEffect(() => {
    console.log(loc);

    if (loc.pathname === "/home") {
      setActiveSection("Songs");
    } else if (loc.pathname === "/home/albums") {
      setActiveSection("Albums");
    }

    if (loc.pathname.startsWith("/home/album/")) {
      setCanGoBack(true);
    } else {
      setCanGoBack(false);
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
    const t = navigate("/home/albums");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  return (
    <>
      <BackgroundCard className="basis-16 lg:basis-52 flex-grow-0 flex-shrink-0 rounded-md py-2 px-2 w-full h-full flex flex-col justify-between overflow-auto">
        <div className="w-full flex flex-col gap-2 items-center lg:items-start">
          <div className="w-full border-b border-neutral-600 pb-4">
            <div className="flex flex-row gap-1 items-center w-full mb-4 justify-center">
              <button
                className="disabled:hover:bg-transparent disabled:dark:text-neutral-400 disabled:text-neutral-500 hover:bg-neutral-300 hover:dark:bg-neutral-600 p-1 rounded-md w-8 h-8 inline-flex items-center justify-center"
                disabled={!canGoBack}
                onClick={handleClickBack}
              >
                <ArrowLeft className="h-5/6 w-5/6" />
              </button>
              <p className="font-semibold hidden lg:block flex-grow">Library</p>
            </div>
            <SearchBar onSearch={onSearch} />

          </div>
          {/* <h3 className="font-semibold text-lg hidden ml-2 lg:block">Library</h3> */}
          <button
            className={`flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md mt-2 p-2 ${activeSection !== "Songs"
              ? "hover:bg-neutral-200 hover:dark:bg-neutral-700"
              : "bg-neutral-300 dark:bg-neutral-900"
              }`}
            onClick={() => handleClickSongs()}
          >
            <Music className="h-5 w-5" />
            <p className="hidden lg:block">Songs</p>
          </button>
          <button
            className={`flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2  ${activeSection !== "Albums"
              ? "hover:bg-neutral-200 hover:dark:bg-neutral-700"
              : "bg-neutral-300 dark:bg-neutral-900"
              }`}
            onClick={() => handleClickAlbums()}
          >
            <Disc className="h-5 w-5" />
            <p className="hidden lg:block">Albums</p>
          </button>
        </div>
        <button
          className="flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
          onClick={() => handleClickSettings()}
        >
          <Settings className="h-5 w-5" />
          <p className="hidden lg:block">Settings</p>
        </button>
      </BackgroundCard>
    </>
  );
}
