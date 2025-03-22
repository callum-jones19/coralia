import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Disc,
  Music,
  Search,
  Settings,
} from "react-feather";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { SearchResults } from "../../types/types";
import SearchBar from "../SearchBar";
import BackgroundCard from "../UI/BackgroundCard";

export interface MenuBarProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function MenuBar({ onSearch }: MenuBarProps) {
  const navigate = useNavigate();
  const loc = useLocation();

  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  useEffect(() => {
    console.log(loc);

    if (loc.pathname.startsWith("/home/album/")) {
      setCanGoBack(true);
    } else {
      setCanGoBack(false);
    }
  }, [loc]);

  const handleClickBack = () => {
    const t = navigate("/home/albums");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const [searchExpanded, setSearchExpanded] = useState<boolean>(false);
  const blurTimeout = useRef<number | null>(null);

  return (
    <>
      <BackgroundCard className={`${searchExpanded ? 'basis-52' : 'basis-16'} transition-all lg:basis-52 flex-grow-0 flex-shrink-0 rounded-md py-2 px-2 w-full h-full flex flex-col justify-between overflow-auto @container`}>
        <div
          className="w-full flex flex-col gap-2 items-center lg:items-start"
          onBlur={() => {

            blurTimeout.current = window.setTimeout(() => {
              setSearchExpanded(false);
            }, 0);
          }}
          onFocus={() => {
            if (blurTimeout.current) {
              window.clearTimeout(blurTimeout.current);
            }
          }}
        >
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
            <div className="hidden lg:block">
              <SearchBar onSearch={onSearch} />
            </div>
            <div className="block lg:hidden">
              {!searchExpanded && <button
                type="button"
                className="w-full flex justify-center items-center p-2 rounded-md hover:dark:bg-neutral-600"
                onClick={() => setSearchExpanded(!searchExpanded)}
              >
                <Search className="h-5 w-5" />
              </button>}
              {searchExpanded && <SearchBar autofocus onSearch={onSearch} />}
            </div>
          </div>
          <NavLink
            className={({ isActive }) => `flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 ${isActive ? 'bg-neutral-200 dark:bg-neutral-900' : 'bg-transparent hover:bg-neutral-300 hover:dark:bg-neutral-700'}`}
            to="/home"
            end
          >
            <Music className="h-5 w-5" />
            <p className="hidden lg:block">Songs</p>
          </NavLink>
          <NavLink
            className={({ isActive }) => `flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 ${isActive ? 'bg-neutral-200 dark:bg-neutral-900' : 'bg-transparent hover:bg-neutral-300 hover:dark:bg-neutral-700'}`}
            to="/home/albums"
          >
            <Disc className="h-5 w-5" />
            <p className="hidden lg:block">Albums</p>
          </NavLink>
        </div>
        <Link
          className="flex flex-row items-center justify-center lg:justify-start gap-2 w-full rounded-md p-2 hover:bg-neutral-300 hover:dark:bg-neutral-700"
          to={'/settings/appearance'}
        >
          <Settings className="h-5 w-5" />
          <p className="hidden lg:block">Settings</p>
        </Link>
      </BackgroundCard>
    </>
  );
}
