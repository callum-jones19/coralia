import { useState } from "react";
import { Trash } from "react-feather";

interface DirectoryListItemProps {
  path: string;
}

function DirectoryListItem({ path }: DirectoryListItemProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <>
      <div
        className="min-h-50 w-full p-3 flex flex-row items-center justify-between hover:bg-neutral-300 rounded-lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <p>{path}</p>
        {isHovering &&
          <button className="text-black p-1 hover:bg-neutral-300 m-0">
            <Trash size='1rem' />
          </button>
        }
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
        <div className="bg-neutral-200 text-neutral-950 p-2 rounded-md">
          <DirectoryListItem path="C:/Users/Callum/Music/music/Aphex Twin" />
          <DirectoryListItem path="C:/Users/Callum/Music/music/Alice Phoebe Lou" />
          <DirectoryListItem path="C:/Users/Callum/Music/music/Magdalena Bay" />
        </div>
        <button type="submit" className="rounded-lg bg-neutral-50 text-black font-bold p-2 pr-4 pl-4 w-fit">Submit</button>
      </div>
    </div>
  )
}
