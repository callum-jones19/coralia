import { ArrowLeft, Layers, Sun } from "react-feather";
import { Link, NavLink } from "react-router";
import BackgroundCard from "../UI/BackgroundCard";

export default function SettingsSidebar() {
  return (
    <>
      <BackgroundCard className="basis-16 lg:basis-52 flex-grow-0 flex-shrink-0 rounded-md py-2 px-2 w-full h-full flex flex-col justify-start items-center overflow-auto">
        <div className="flex flex-row gap-1 items-center w-full mb-4 justify-center border-b border-neutral-600 pb-4">
          <Link
            className="disabled:hover:bg-transparent disabled:dark:text-neutral-400 disabled:text-neutral-500 hover:bg-neutral-300 hover:dark:bg-neutral-600 p-1 rounded-md w-8 h-8 inline-flex items-center justify-center"
            to={'/home'}
          >
            <ArrowLeft className="h-5/6 w-5/6" />
          </Link>
          <p className="font-semibold hidden lg:block flex-grow">Settings</p>
        </div>
        <div className="w-full h-full flex flex-col gap-2">
          <NavLink
            to="/settings/appearance"
            className={({ isActive }) => (`${isActive
              ? "bg-neutral-200 dark:bg-neutral-900"
              : "bg-transparent hover:bg-neutral-300 hover:dark:bg-neutral-700"
              } text-start p-2 rounded-md flex items-center gap-3 disabled:text-neutral-300 justify-center lg:justify-start h-10 w-10 lg:w-full`)}
            title="Appearance"
          >
            <Sun className="h-5 w-5" />
            <p className="hidden lg:block">Appearance</p>
          </NavLink>
          <NavLink
            to="library"
            className={({ isActive }) => (`${isActive
              ? "bg-neutral-200 dark:bg-neutral-900"
              : "bg-transparent hover:bg-neutral-300 hover:dark:bg-neutral-700"
              } text-start p-2 rounded-md flex items-center gap-3 disabled:text-neutral-300 justify-center lg:justify-start h-10 w-10 lg:w-full`)}
            title="Library"
          >
            <Layers className="h-5 w-5" />
            <p className="hidden lg:block">Library</p>
          </NavLink>
        </div>
      </BackgroundCard>
    </>
  );
}
