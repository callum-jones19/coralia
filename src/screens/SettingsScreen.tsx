import { Link, useNavigate } from "react-router";
import { resetLibraryBackend } from "../api/commands";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const resetLibrary = () => {
    resetLibraryBackend()
      .then(() => {
        console.log("fuck");
        const t = navigate("/");
        if (t) {
          t.catch(e => console.error(e));
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="w-full h-full flex flex-row">
      <div className="basis-1/4 flex flex-col shadow-md p-2">
        <h2 className="font-bold text-lg">Settings</h2>
        <Link to="/home" className=" p-2 rounded-md text-center">
          Home
        </Link>
      </div>
      <div className="flex-grow p-2">
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
