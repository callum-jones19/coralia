import { useNavigate } from "react-router";
import { searchLibrary } from "../api/importer";

export default function SearchBar() {
  const navigate = useNavigate();

  return (
    <input
      className="bg-neutral-200 basis-full rounded-md items-center gap-2 flex-wrap text-neutral-600 p-2 min-w-0 overflow-hidden"
      placeholder="Search"
      onChange={e => {
        const searchQuery = e.target.value === '' ? null : e.target.value;

        if (searchQuery !== null) {
          navigate('/home/search');
        } else {
          navigate('/home');
        }

        if (searchQuery !== null) {
          searchLibrary(searchQuery)
            .then(d => console.log(d))
            .catch(e => console.error(e));
        }
      }}
    />
  )
}