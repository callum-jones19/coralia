import { useNavigate } from "react-router";
import { resetLibraryBackend } from "../../api/commands";

export default function LibrarySettings() {
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
    <>
      <h2 className="text-xl font-bold mb-4 border-b-2 border-solid border-neutral-300 pb-3">
        Library
      </h2>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center dark:bg-neutral-700 p-3 rounded-t-md">
          <div className="flex flex-col">
            <p className="text-lg">Scan for new music</p>
            <p className="dark:text-neutral-300 text-sm">
              <i>
                Re-scan the current library directories for newly added music
                files. This will <b>not</b>{" "}
                rescan the metadata of songs already in the library
              </i>
            </p>
          </div>
          <button className="bg-neutral-800 text-white p-2 rounded-md h-fit">
            Rescan library
          </button>
        </div>
        <div className="flex justify-between items-center dark:bg-neutral-700 p-3 rounded-b-md">
          <div className="flex flex-col">
            <p className="text-lg">Reset Library</p>
            <p className="dark:text-neutral-300 text-sm">
              <i>
                Completely wipe the internal cache of the scanned music library,
                all attached metadata and artwork.
              </i>
            </p>
          </div>
          <button
            className="bg-red-600 text-white p-2 rounded-md h-fit"
            onClick={() => resetLibrary()}
          >
            Reset Library
          </button>
        </div>
      </div>
    </>
  );
}
