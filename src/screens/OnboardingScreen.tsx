import { dialog } from "@tauri-apps/api";
import { FormEvent, useState } from "react";
import { CheckSquare, Plus, Square, X } from "react-feather";
import { addLibraryFolders } from "../api/commands";
import path from "path";
import { useNavigate } from "react-router";

interface DirectoryListItemProps {
  path: string;
  onClickRemove?: () => void;
  index: number;
}

function DirectoryListItem({ path, onClickRemove, index }: DirectoryListItemProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);

  return (
    <>
      <div
        className="w-full flex flex-row items-center justify-between  rounded-lg h-10"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-row items-center flex-grow basis-1/2 text-nowrap overflow-hidden">
          {false &&
            <button
              className="text-black p-1 rounded-lg h-full aspect-square flex justify-center items-center hover:bg-neutral-200"
              type="button"
              onClick={() => setIsChecked(!isChecked)}
            >
              {isChecked && <CheckSquare size='1.5rem' />}
              {!isChecked && <Square size='1.5rem' />}
            </button>
          }
          <p title={path} className="ml-2 text-nowrap overflow-hidden text-ellipsis"><b>{index}.</b> {path}</p>
        </div>
        {true &&
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
        }
      </div>
    </>
  )
}

export default function OnboardingScreen() {
  const [paths, setPaths] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted onboarding form');
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
          setPaths([...paths, ...path])
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-neutral-400">
      <form className="bg-neutral-50 text-neutral-950 shadow-md w-2/3 m-auto h-5/6 p-10 rounded-xl flex flex-col gap-4 justify-between"
        onSubmit={handleFormSubmit}
      >
        <div>
          <p className="text-2xl font-bold">Library Folders</p>
          <p>Music will be scanned into the library from the following folders:</p>
        </div>
        <div className="bg-neutral-50 text-neutral-950 p-2 rounded-md flex flex-col gap-3 overflow-auto flex-grow justify-center shadow-md">
          <div className="overflow-auto basis-full">
            {paths.map((path, index) => (
              <DirectoryListItem
                key={path}
                path={path}
                index={index + 1}
                onClickRemove={() => {
                  const tmp = [...paths];
                  tmp.splice(index, 1);
                  setPaths(tmp);
                }}
              />
            ))}
            {paths.length === 0 &&
              <p className="text-center">
                No folders added...
              </p>
            }
          </div>
          <button
            className="rounded-lg flex flex-row gap-2 justify-center items-center hover:bg-neutral-300 p-1"
            onClick={handleAddDir}
            type="button"
          >
            <Plus size={20}/>
            <p>Add new directory...</p>
          </button>
        </div>
        <button type="submit" disabled={paths.length === 0} className="disabled:bg-neutral-200 disabled:text-neutral-500 rounded-lg bg-neutral-50 text-black font-bold p-2 w-fit hover:bg-neutral-200 self-end">Submit</button>
      </form>
    </div>
  )
}
