import { useState } from "react";
import { Check, CheckSquare, Delete, Plus, Square, Trash } from "react-feather";

interface DirectoryListItemProps {
  path: string;
}

function DirectoryListItem({ path }: DirectoryListItemProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);

  return (
    <>
      <div
        className="w-full flex flex-row items-center justify-between hover:bg-neutral-200 rounded-lg h-10"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-row items-center">
          {
            <button
              className="text-black p-1 rounded-lg h-full aspect-square flex justify-center items-center"
              onClick={() => setIsChecked(!isChecked)}
            >
              {isChecked && <CheckSquare size='1.5rem' />}
              {!isChecked && <Square size='1.5rem' />}
            </button>
          }
          <p className="ml-2">{path}</p>
        </div>
        {isHovering && <button className="text-black rounded-lg h-full aspect-square flex justify-center items-center">
          <Trash size='1.5rem' />
        </button>}
      </div>
    </>
  )
}

export default function OnboardingScreen() {
  return (
    <div className="h-screen flex flex-col justify-center bg-neutral-400">
      <div className="bg-neutral-950 text-neutral-50 shadow-md w-2/3 m-auto p-10 rounded-xl flex flex-col gap-6">
        <div>
          <p className="text-2xl font-bold">Library Folders</p>
          <p>Music will be scanned into the library from the following folders:</p>
        </div>
        <div className="bg-neutral-50 text-neutral-950 p-2 rounded-md flex flex-col gap-2">
          <DirectoryListItem path="C:/Users/Callum/Music/music/Aphex Twin" />
          <DirectoryListItem path="C:/Users/Callum/Music/music/Alice Phoebe Lou" />
          <DirectoryListItem path="C:/Users/Callum/Music/music/Magdalena Bay" />
          <button className="rounded-lg flex flex-row gap-2 justify-center items-center hover:bg-neutral-300 p-2">
            <Plus />
          </button>
        </div>
        <button type="submit" className="rounded-lg bg-neutral-50 text-black font-bold p-2 pr-4 pl-4 w-fit">Submit</button>
      </div>
    </div>
  )
}
