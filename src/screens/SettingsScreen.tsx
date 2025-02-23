import { Link, useNavigate } from "react-router";
import { resetLibraryBackend } from "../api/commands";
import { Aperture, ChevronLeft, Layers, Music, Settings } from "react-feather";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const resetLibrary = () => {
    resetLibraryBackend()
      .then(() => {
        const t = navigate("/");
        if (t) {
          t.catch(e => console.error(e));
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="w-full h-full flex flex-row dark:bg-neutral-900 dark:text-white">
      <div className="basis-60 flex flex-col m-2 gap-2 rounded-md shadow-md p-3 dark:shadow-none dark:bg-neutral-800">
        <div className="flex flex-row gap-2 items-center border-b-2 border-solid border-neutral-300 pb-3 mb-2">
          <Link to="/home" className="flex flex-row h-full aspect-square items-center justify-center hover:bg-neutral-200 hover:dark:bg-neutral-700 rounded-md">
            <ChevronLeft />
          </Link>
          <h2 className="font-bold text-xl">Settings</h2>
        </div>
        <button className="bg-neutral-300 dark:bg-neutral-900 text-start p-2 rounded-md flex gap-2 disabled:text-neutral-300">
          <Layers />
          <p>Library</p>
        </button>
      </div>
      <div className="flex-grow p-3 m-2 ml-0 shadow-md rounded-md dark:shadow-none dark:bg-neutral-800 overflow-auto">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-solid border-neutral-300 pb-3">Library</h2>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center dark:bg-neutral-700 p-3 rounded-md">
            <div className="flex flex-col">
              <p className="text-lg">Scan for new music</p>
              <p className="dark:text-neutral-300 text-sm"><i>Re-scan the current library directories for newly added music files. This will <b>not</b> rescan the metadata of songs already in the library</i></p>
            </div>
            <button
              className="bg-neutral-800 text-white p-2 rounded-md h-fit"
            >
              Rescan library
            </button>
          </div>
          <div className="flex justify-between items-center dark:bg-neutral-700 p-3 rounded-md">
            <div className="flex flex-col">
              <p className="text-lg">Reset Library</p>
              <p className="dark:text-neutral-300 text-sm"><i>Completely wipe the internal cache of the scanned music library, all attached metadata and artwork</i></p>
            </div>
            <button
              className="bg-red-600 text-white p-2 rounded-md h-fit"
              onClick={() => resetLibrary()}
            >
              Reset Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
