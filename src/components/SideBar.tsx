import { Link } from "react-router-dom";
import { scanFolder } from "../data/importer";

export default function SideBar () {
  return (
    <div
      className="w-56 bg-gray-950 h-full flex-grow-0 flex-shrink-0"
    >
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <div className="flex flex-col gap-3">
          <button
            className="bg-slate-50 ml-2 mr-2 p-1 rounded-sm"
            onClick={() => scanFolder('Music')}
          >Songs</button>
          <button disabled className="bg-gray-500 ml-2 mr-2 p-1 rounded-sm">Albums</button>
          <button disabled className="bg-gray-500 ml-2 mr-2 p-1 rounded-sm">Artists</button>
        </div>
        <Link
          className="bg-white ml-2 mr-2 p-1 text-center rounded-sm"
          to={'/settings'}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}