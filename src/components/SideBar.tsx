import { Link } from "react-router-dom";
import { testApiCall } from "../api/musicData";
import { scanFolder } from "../data/importer";

export default function SideBar () {
  return (
    <div
      className="w-56 bg-gradient-to-b from-slate-950 to-slate-800 h-full flex-grow-0 flex-shrink-0"
    >
      <div className="flex flex-col gap-3 justify-between h-full pt-3 pb-3">
        <div className="flex flex-col gap-3">
          <button
            className="bg-slate-50 ml-2 p-1 rounded-md rounded-br-none rounded-tr-none"
            onClick={() => {
              scanFolder('Music');
            }}
          >Albums</button>
          <button disabled className="bg-gray-300 ml-2 mr-2 p-1 rounded-md">Songs</button>
          <button disabled className="bg-gray-300 ml-2 mr-2 p-1 rounded-md">Artists</button>
        </div>
        <Link
          className="bg-white ml-2 mr-2 p-1 text-center rounded-md"
          to={'/settings'}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}