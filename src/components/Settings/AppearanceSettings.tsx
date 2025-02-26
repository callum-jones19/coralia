import { invoke } from "@tauri-apps/api/core";
import Select from "react-select";

export type AppearanceOption = "dark" | "light" | "system";

export default function AppearanceSettings() {
  // const themeOptions: AppearanceOption[] = ["dark", "light", "system"];
  const themeOptions = [
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];



  return (
    <>
      <h2 className="text-xl font-bold mb-4 border-b-2 border-solid border-neutral-300 dark:border-neutral-600 pb-3">
        Appearance
      </h2>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-md">
          <div className="flex flex-col">
            <p className="text-lg">Theme</p>
          </div>
          <Select
            defaultValue={themeOptions[0]}
            options={themeOptions}
            className="w-80"
            onChange={newTheme => {
              if (newTheme?.value === 'dark') {
                invoke('set_app_theme', { newTheme: 'dark' }).catch(e => console.error(e));
              } else if (newTheme?.value === 'light') {
                invoke('set_app_theme', { newTheme: 'light' }).catch(e => console.error(e));
              } else if (newTheme?.value === 'system') {
                invoke('set_app_theme', { newTheme: null }).catch(e => console.error(e));
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
