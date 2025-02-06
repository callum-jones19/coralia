import { searchLibrary } from "../api/commands";

export default function SearchBar() {
  return (
    <input
      className="bg-neutral-200 basis-full rounded-md items-center gap-2 flex-wrap text-neutral-600 p-2 min-w-0 overflow-hidden"
      placeholder="Search"
      onChange={e => {
        const searchQuery = e.target.value === '' ? null : e.target.value;

        if (searchQuery !== null) {
          searchLibrary(searchQuery);
        }
      }}
    />
  )
}