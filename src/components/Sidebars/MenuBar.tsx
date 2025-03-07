import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
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

  useEffect(() => {
    console.log(loc);

    if (loc.pathname === "/home") {
      setActiveSection("Songs");
    } else if (loc.pathname === "/home/albums") {
      setActiveSection("Albums");
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
  };

  return (
    <>
      <BackgroundCard className="basis-16 lg:basis-52 flex-grow-0 flex-shrink-0 rounded-md p-2 w-full h-full flex flex-col justify-between overflow-auto">
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="w-full flex flex-row justify-between gap-2 flex-wrap border-b-2 border-solid border-neutral-300 dark:border-neutral-700 pb-4 mb-2">
            <button
              className="hover:bg-neutral-300 hover:dark:bg-neutral-600 bg-neutral-200 dark:bg-neutral-700 p-2 rounded-md flex-grow"
              onClick={handleClickBack}
            >
              <ChevronLeft className="m-auto" />
            </button>
            <button
              className="hover:bg-neutral-300 hover:dark:bg-neutral-600 bg-neutral-200 dark:bg-neutral-700 p-2 rounded-md flex-grow"
              onClick={handleClickForward}
            >
              <ChevronRight className="m-auto" />
            </button>
            <SearchBar onSearch={onSearch} />
          </div>
          <button
            className={`flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 ${
              activeSection !== "Songs"
                ? "hover:bg-neutral-200 hover:dark:bg-neutral-700"
                : "bg-neutral-300 dark:bg-neutral-900"
            }`}
            onClick={() => handleClickSongs()}
          >
            <Music />
            <p className="hidden lg:block">Songs</p>
          </button>
          <button
            className={`flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2  ${
              activeSection !== "Albums"
                ? "hover:bg-neutral-200 hover:dark:bg-neutral-700"
                : "bg-neutral-300 dark:bg-neutral-900"
            }`}
            onClick={() => handleClickAlbums()}
          >
            <Disc />
            <p className="hidden lg:block">Albums</p>
          </button>
        </div>
        <button
          className="flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
          onClick={() => handleClickSettings()}
        >
          <Settings />
          <p className="hidden lg:block">Settings</p>
        </button>
      </BackgroundCard>
    </>
  );
}
