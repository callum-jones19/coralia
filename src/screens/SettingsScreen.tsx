import { Link, useNavigate } from "react-router";
import { resetLibraryBackend } from "../api/commands";
import { ChevronLeft } from "react-feather";

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
      <div className="basis-60 flex flex-col m-2 gap-4 rounded-md shadow-md p-4 dark:shadow-none dark:bg-neutral-800">
        <div className="flex flex-row gap-2 items-center">
          <Link to="/home" className="flex flex-row h-full aspect-square items-center justify-center">
            <ChevronLeft />
          </Link>
          <h2 className="font-bold text-lg">Settings</h2>
        </div>
      </div>
      <div className="flex-grow p-4 m-2 ml-0 shadow-md rounded-md dark:shadow-none dark:bg-neutral-800">
        <button
          className="bg-red-500 p-3 rounded-md text-white font-bold"
          onClick={() => resetLibrary()}
        >
          Reset library
        </button>
      </div>
    </div>
  );
}
