import { dialog } from "@tauri-apps/api";
import { FormEvent, useEffect, useState } from "react";
import { CheckSquare, Plus, Square, X } from "react-feather";
import { redirect, useNavigate } from "react-router";
import { addLibraryFolders } from "../api/commands";
import { readLibFromCache } from "../api/importer";

interface DirectoryListItemProps {
  path: string;
  onClickRemove?: () => void;
  index: number;
}

function DirectoryListItem(
  { path, onClickRemove, index }: DirectoryListItemProps,
) {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  return (
    <>
      <div
        className="w-full flex flex-row items-center justify-between  rounded-lg h-10"
      >
        <div className="flex flex-row items-center flex-grow basis-1/2 text-nowrap overflow-hidden">
          {false
            && (
              <button
                className="text-black p-1 rounded-lg h-full aspect-square flex justify-center items-center hover:bg-neutral-200"
                type="button"
                onClick={() => setIsChecked(!isChecked)}
              >
                {isChecked && <CheckSquare size="1.5rem" />}
                {!isChecked && <Square size="1.5rem" />}
              </button>
            )}
          <p title={path} className="text-nowrap overflow-hidden text-ellipsis">
            <b>{index}.</b> {path}
          </p>
        </div>
        {true
          && (
            <button
              className="text-neutral-500 rounded-lg p-1 flex justify-center items-center  hover:bg-neutral-200 hover:text-black"
              type="button"
              onClick={() => {
                if (onClickRemove) {
                  onClickRemove();
                }
              }}
            >
              <X size={20} />
            </button>
          )}
      </div>
    </>
  );
}

export default function OnboardingScreen() {
  const [paths, setPaths] = useState<string[]>([]);
  const [isCheckingCache, setIsCheckingCache] = useState<boolean>(true);
  const [cachedLibExists, setCachedLibExists] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    readLibFromCache()
      .then(libExists=> {
        console.log(libExists);
        setIsCheckingCache(false);
        if (libExists) {
          setCachedLibExists(true);
          const t = navigate("/home");
          if (t) {
            t.catch(e => console.error(e));
          }
        }
      })
      .catch(e => console.log(e));
  }, [navigate]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted onboarding form");
    addLibraryFolders(paths);
    const t = navigate("/home");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleAddDir = () => {
    dialog.open({ directory: true, multiple: true })
      .then(path => {
        if (path === null) return;

        // FIXME dont allow duplicate path adding
        if (!Array.isArray(path)) {
          setPaths([...paths, path]);
        } else {
          setPaths([...paths, ...path]);
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-neutral-400">
      {!isCheckingCache && !cachedLibExists && <form
        className="bg-white shadow-md text-neutral-950 w-2/3 m-auto h-1/2 p-10 rounded-xl flex flex-col gap-3 justify-between"
        onSubmit={handleFormSubmit}
      >
        <div className="border-b-2 border-solid border-neutral-300">
          <p className="text-2xl font-bold">Library Folders</p>
          <p className="mb-1">
            Music will be scanned into the library from the following folders:
          </p>
        </div>
        <div className="bg-white text-neutral-950 rounded-md flex flex-col gap-3 overflow-auto flex-grow justify-center ">
          <div className="overflow-auto basis-full flex flex-col gap-3">
            {paths.map((path, index) => (
              <div key={path} className="mr-4">
                <DirectoryListItem
                  path={path}
                  index={index + 1}
                  onClickRemove={() => {
                    const tmp = [...paths];
                    tmp.splice(index, 1);
                    setPaths(tmp);
                  }}
                />
              </div>
            ))}
            {paths.length === 0
              && (
                <p className="text-center mt-auto mb-auto italic">
                  No folders added to library
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-row w-full justify-between">
          <button
            className="rounded-lg flex flex-row gap-2 hover:bg-neutral-300 text-sm p-2 pl-3 pr-4 bg-neutral-700 w-fit text-white shadow-md"
            onClick={handleAddDir}
            type="button"
          >
            <Plus size={20} />
            <p>New directory</p>
          </button>
          <button
            type="submit"
            disabled={paths.length === 0}
            className="disabled:bg-neutral-200 disabled:text-neutral-500 rounded-lg bg-neutral-700 pl-3 pr-3 text-white shadow-md p-2 w-fit hover:bg-neutral-200 self-end"
          >
            Submit
          </button>
        </div>
      </form>}
    </div>
  );
}
