import { setTheme } from "@tauri-apps/api/app";
import { ChangeEvent } from "react";

export default function AppearanceSettings() {
  const handleThemeSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;

    if (selectedOption === 'Dark') {
      setTheme("dark");
    } else if (selectedOption === 'Light') {
      setTheme("light");
    } else if (selectedOption === 'Use system settings') {
      // TODO
      console.warn("System theme selection has not yet been implemented");
    } else {
      console.error("Selected theme that does not correspond to a valid option");
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 border-b-2 border-solid border-neutral-300 pb-3">
        Appearance
      </h2>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-md">
          <div className="flex flex-col">
            <p className="text-lg">Theme</p>
          </div>
          <select
            name="theme"
            id="theme"
            className="bg-transparent p-2"
            onChange={handleThemeSelectChange}
          >
            <option
              value="Use system settings"
              className="p-2 rounded-md bg-neutral-900"
            >
              Use system settings
            </option>
            <option value="Dark" className="p-2 rounded-md bg-neutral-900">
              Dark
            </option>
            <option value="Light" className="p-2 rounded-md bg-neutral-900">
              Light
            </option>
          </select>
        </div>
      </div>
    </>
  );
}
