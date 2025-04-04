import { ChangeEvent, useState } from "react";
import { X } from "react-feather";
import { useLocation, useNavigate } from "react-router";
import { searchLibrary } from "../api/importer";
import { SearchResults } from "../types/types";

export interface SearchBarProps {
  onSearch: (searchRes: SearchResults) => void;
  autofocus?: boolean;
}

export default function SearchBar({ onSearch, autofocus }: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState<null | string>(null);

  const handleInputChage = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value === "" ? null : e.target.value;
    setQuery(searchQuery);

    if (searchQuery !== null) {
      searchLibrary(searchQuery)
        .then(res => {
          if (location.pathname !== "/home/search") {
            const t = navigate("/home/search");
            if (t) {
              t.catch(e => console.error(e));
            }
          }
          onSearch(res);
        })
        .catch(e => console.error(e));
    } else {
      const t = navigate("/home");
      if (t) {
        t.catch(e => console.error(e));
      }
    }

    if (searchQuery !== null) {
      searchLibrary(searchQuery)
        .then(d => console.log(d))
        .catch(e => console.error(e));
    }
  };

  return (
    <div className="flex flex-row rounded-md items-center w-full bg-neutral-100 dark:text-white dark:bg-neutral-900">
      <input
        className=" basis-full items-center text-black p-2 min-w-0 rounded-md bg-neutral-100 dark:bg-neutral-900 dark:text-white"
        placeholder="Search"
        value={query ? query : ""}
        onChange={handleInputChage}
        autoFocus={autofocus}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.currentTarget.blur();
          }
        }}
      />
      {query
        && (
          <button
            onClick={() => {
              const t = navigate("/home");
              if (t) t.catch(e => console.error(e));
              setQuery(null);
            }}
            className="bg-neutral-100 h-full rounded-r-md pr-1 dark:bg-neutral-900 dark:text-white"
          >
            <X />
          </button>
        )}
    </div>
  );
}
