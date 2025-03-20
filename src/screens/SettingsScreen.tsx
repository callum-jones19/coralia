import { Outlet } from "react-router";
import SettingsSidebar from "../components/Settings/SettingsSidebar";

export default function SettingsScreen() {
  return (
    <div className="h-full flex flex-col bg-white text-black gap-2 p-2 dark:bg-neutral-900 dark:text-white">
      <div className="flex flex-row flex-grow h-1 flex-shrink gap-2">
        <SettingsSidebar />
        <div className="flex-grow p-2 shadow-md rounded-md dark:shadow-none dark:bg-neutral-800 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
