import { dialog } from "@tauri-apps/api";
import { FormEvent, useState } from "react";
import { CheckSquare, Plus, Square, X } from "react-feather";
import { addLibraryFolders } from "../api/commands";
import path from "path";
import { useNavigate } from "react-router";

interface DirectoryListItemProps {
  path: string;
  onClickRemove?: () => void;
}

function DirectoryListItem({ path, onClickRemove }: DirectoryListItemProps) {
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
          {
            <button
              className="text-black p-1 rounded-lg h-full aspect-square flex justify-center items-center hover:bg-neutral-200"
              onClick={() => setIsChecked(!isChecked)}
            >
              {isChecked && <CheckSquare size='1.5rem' />}
              {!isChecked && <Square size='1.5rem' />}
            </button>
          }
          <p title={path} className="ml-2text-nowrap overflow-hidden text-ellipsis">{path}</p>
        </div>
        {isHovering &&
          <button
            className="text-neutral-500 rounded-lg p-1 flex justify-center items-center  hover:bg-neutral-200 hover:text-black"
            onClick={() => {
              if (onClickRemove) {
                onClickRemove();
              }
            }}
          >
            <X />
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
    dialog.open({ directory: true, multiple: false })
      .then(path => {
        if (path !== null && !Array.isArray(path)) {
          if (paths.includes(path)) {
            // TODO
          }
          setPaths([...paths, path]);
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-neutral-400">
      <form className="bg-neutral-950 text-neutral-50 shadow-md w-2/3 m-auto p-10 rounded-xl flex flex-col gap-6"
        onSubmit={handleFormSubmit}
      >
        <div>
          <p className="text-2xl font-bold">Library Folders</p>
          <p>Music will be scanned into the library from the following folders:</p>
        </div>
        <div className="bg-neutral-50 text-neutral-950 p-2 rounded-md flex flex-col gap-2">
          {paths.map((path, index) => (
            <DirectoryListItem
              key={path}
              path={path}
              onClickRemove={() => {
                const tmp = [...paths];
                tmp.splice(index, 1);
                setPaths(tmp);
              }}
            />
          ))}
          <button
            className="rounded-lg flex flex-row gap-2 justify-center items-center hover:bg-neutral-300 p-2"
            onClick={handleAddDir}
            type="button"
          >
            <Plus />
          </button>
        </div>
        <button type="submit" className="rounded-lg bg-neutral-50 text-black font-bold p-2 pr-4 pl-4 w-fit hover:bg-neutral-200">Submit</button>
      </form>
    </div>
  )
}
