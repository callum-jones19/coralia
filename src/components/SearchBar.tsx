import { useNavigate } from "react-router";
import { searchLibrary } from "../api/importer";
import { SearchResults } from "../types";
import { X } from "react-feather";
import { useState } from "react";

export interface SearchBarProps {
  onSearch: (searchRes: SearchResults) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState<null | string>(null);

  return (
    <div className="basis-full flex flex-row bg-neutral-200 rounded-md items-center">
      <input
        className=" basis-1 items-center text-neutral-600 p-2 min-w-0 overflow-hidden"
        placeholder="Search"
        value={query ? query : ''}
        onChange={e => {
          const searchQuery = e.target.value === '' ? null : e.target.value;
          setQuery(searchQuery);

          if (searchQuery !== null) {
            searchLibrary(searchQuery)
              .then(res => {
                const t = navigate('/home/search');
                if (t) {
                  t.catch(e => console.error(e));
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
        }}
      />
      {query &&
        <button
          onClick={() => {
            const t = navigate('/home');
            if (t) t.catch(e => console.error(e))
            setQuery(null);
          }}
          className="min-w-0 bg-neutral-200"
        >
          <X />
        </button>
      }
    </div>
  )
}