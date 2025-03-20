import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Settings } from "../../types/types";

export type AppearanceOption = "dark" | "light" | "system";

interface ThemeOption { value: string; label: string }

export default function AppearanceSettings() {
  const themeOptions = [
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ];

  const [initTheme, setInitTheme] = useState<null | ThemeOption>(null);

  useEffect(() => {
    invoke<Settings>('get_app_settings', {})
      .then(settings => {
        if (settings.theme === null) {
          setInitTheme({ value: 'system', label: 'System' });
        } else if (settings.theme === 'dark') {
          setInitTheme({ value: 'dark', label: 'Dark' });
        } else {
          setInitTheme({ value: 'light', label: 'Light' });
        }
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <>
      <h2 className="font-semibold mb-4 p-1 border-b border-solid border-neutral-300 dark:border-neutral-600 pb-5">
        Appearance
      </h2>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 p-3 rounded-md">
          <div className="flex flex-col">
            <p className="text-lg">Theme</p>
          </div>
          {initTheme && <Select
            defaultValue={initTheme}
            options={themeOptions}
            className="w-80"
            onChange={newTheme => {
              if (newTheme?.value === 'system') {
                invoke('set_app_theme', { newTheme: null })
                  .catch(e => console.error(e));
              } else if (newTheme?.value === 'dark') {
                invoke('set_app_theme', { newTheme: 'dark' })
                .catch(e => console.error(e));
              } else if (newTheme?.value === 'light') {
                invoke('set_app_theme', { newTheme: 'light' })
                .catch(e => console.error(e));
              }
            }}
          />}
        </div>
      </div>
    </>
  );
}
