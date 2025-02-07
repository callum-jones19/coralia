import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Disc,
  Heart,
  Music,
  Settings,
} from "react-feather";
import { useLocation, useNavigate } from "react-router";
import SearchBar from "./SearchBar";
import { SearchResults } from "../types";

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
      <div className="basis-2/12 h-full flex flex-col bg-neutral-100 rounded-md p-2 justify-between">
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="w-full flex flex-row justify-between gap-2 flex-wrap">
            <button
              className="hover:bg-neutral-300 bg-neutral-200 p-2 rounded-md flex-grow"
              onClick={handleClickBack}
            >
              <ChevronLeft className="m-auto" />
            </button>
            <button
              className="hover:bg-neutral-300 bg-neutral-200 p-2 rounded-md flex-grow"
              onClick={handleClickForward}
            >
              <ChevronRight className="m-auto" />
            </button>
          </div>
          <SearchBar onSearch={onSearch} />
          <button
            className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 ${
              activeSection !== "Songs"
                ? "hover:bg-neutral-200"
                : "bg-neutral-300"
            }`}
            onClick={() => handleClickSongs()}
          >
            <Music />
            <p>Songs</p>
          </button>
          <button
            className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2  ${
              activeSection !== "Albums"
                ? "hover:bg-neutral-200"
                : "bg-neutral-300"
            }`}
            onClick={() => handleClickAlbums()}
          >
            <Disc />
            <p>Albums</p>
          </button>
          <button
            className="flex flex-row items-center justify-between gap-2 w-full rounded-md p-2 disabled:text-neutral-400"
            disabled
          >
            <div className="flex flex-row gap-2">
              <Heart />
              <p>Playlists</p>
            </div>
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
    </>
  );
}
