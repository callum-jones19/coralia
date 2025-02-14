import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Disc,
  Music,
  Settings,
} from "react-feather";
import { useLocation, useNavigate } from "react-router";
import { SearchResults } from "../../types";
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
      <BackgroundCard className="basis-52 flex-grow-0 flex-shrink-0 rounded-md p-2 w-full h-full flex flex-col justify-between overflow-hidden">
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
            className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2 ${activeSection !== "Songs"
              ? "hover:bg-neutral-200"
              : "bg-neutral-300"
              }`}
            onClick={() => handleClickSongs()}
          >
            <Music />
            <p>Songs</p>
          </button>
          <button
            className={`flex flex-row items-center justify-start gap-2 w-full rounded-md p-2  ${activeSection !== "Albums"
              ? "hover:bg-neutral-200"
              : "bg-neutral-300"
              }`}
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
      </BackgroundCard>
    </>
  );
}
