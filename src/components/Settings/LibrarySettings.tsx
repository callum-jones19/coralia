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
      <h2 className="font-semibold mb-4 p-1 border-b border-solid border-neutral-300 dark:border-neutral-600 pb-5">
        Library
      </h2>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-t-md">
          <div className="flex flex-col">
            <p className="text-lg">Scan for new music</p>
            <p className="dark:text-neutral-300 text-sm w-11/12">
              <i>
                Re-scan the current library directories for newly added music
                files. This will <b>not</b>{" "}
                rescan the metadata of songs already in the library
              </i>
            </p>
          </div>
          <button className="bg-neutral-800 text-white p-2 rounded-md h-fit w-36 text-wrap">
            Rescan library
          </button>
        </div>
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-b-md">
          <div className="flex flex-col w-full">
            <p className="text-lg">Reset Library</p>
            <p className="dark:text-neutral-300 text-sm w-11/12">
              <i>
                Completely wipe the internal cache of the scanned music library,
                all attached metadata and artwork.
              </i>
            </p>
          </div>
          <button
            className="bg-red-600 text-white rounded-md p-2 h-fit w-36"
            onClick={() => resetLibrary()}
          >
            Reset Library
          </button>
        </div>
      </div>
    </>
  );
}
