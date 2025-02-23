import { Outlet } from "react-router";
import SettingsSidebar from "../components/Settings/SettingsSidebar";

export default function SettingsScreen() {
  return (
    <div className="w-full h-full flex flex-row dark:bg-neutral-900 dark:text-white">
      <div className="basis-60 flex flex-col m-2 gap-2 rounded-md shadow-md p-3 dark:shadow-none dark:bg-neutral-800">
        <SettingsSidebar />
      </div>
      <div className="flex-grow p-3 m-2 ml-0 shadow-md rounded-md dark:shadow-none dark:bg-neutral-800 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
