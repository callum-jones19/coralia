import { useLocation, useNavigate } from "react-router";
import { searchLibrary } from "../api/importer";
import { SearchResults } from "../types";
import { X } from "react-feather";
import { ChangeEvent, useState } from "react";

export interface SearchBarProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState<null | string>(null);

  const handleInputChage = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value === '' ? null : e.target.value;
    setQuery(searchQuery);

    if (searchQuery !== null) {
      searchLibrary(searchQuery)
        .then(res => {
          if (location.pathname !== '/home/search') {
            const t = navigate('/home/search');
            if (t) {
              t.catch(e => console.error(e));
            }
          }
          onSearch(res);
        })
        .catch(e => console.error(e));
    } else {
      const t = navigate('/home');
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
    <div className="flex flex-row rounded-md items-center w-full bg-white dark:text-white dark:bg-neutral-900">
      <input
        className=" basis-full items-center text-black p-2 min-w-0 rounded-md dark:bg-neutral-900 dark:text-white mr-2"
        placeholder="Search"
        value={query ? query : ''}
        onChange={handleInputChage}
      />
      {query &&
        <button
          onClick={() => {
            const t = navigate('/home');
            if (t) t.catch(e => console.error(e))
            setQuery(null);
          }}
          className="bg-white h-full rounded-r-md pr-1 dark:bg-neutral-900 dark:text-white"
        >
          <X />
        </button>
      }
    </div>
  )
}