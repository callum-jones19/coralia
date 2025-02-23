import { ChevronLeft, Layers, Sun } from "react-feather";
import { Link, useLocation } from "react-router";

export default function SettingsSidebar() {
  const loc = useLocation();
  console.log(loc)
  return (
    <>
      <div className="flex flex-row gap-2 items-center border-b-2 border-solid border-neutral-300 pb-3 mb-2">
          <Link to="/home" className="flex flex-row h-full aspect-square items-center justify-center hover:bg-neutral-200 hover:dark:bg-neutral-700 rounded-md">
            <ChevronLeft />
          </Link>
          <h2 className="font-bold text-xl">Settings</h2>
        </div>
        <Link
          to="appearance"
          className={`${loc.pathname === '/settings/appearance' ? 'bg-neutral-900' : 'bg-transparent'} text-start p-2 rounded-md flex gap-3 disabled:text-neutral-300`}
        >
          <Sun />
          <p>Appearance</p>
        </Link>
        <Link
          to="library"
          className={`${loc.pathname === '/settings/library' ? 'bg-neutral-900' : 'bg-transparent'} text-start p-2 rounded-md flex gap-3 disabled:text-neutral-300`}
        >
          <Layers />
          <p>Library</p>
        </Link>
    </>
  )
}