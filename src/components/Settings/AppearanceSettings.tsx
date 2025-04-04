import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Settings } from "../../types/types";

export type AppearanceOption = "dark" | "light" | "system";

export default function AppearanceSettings() {

  const [initTheme, setInitTheme] = useState<null | AppearanceOption>(null);

  useEffect(() => {
    invoke<Settings>('get_app_settings', {})
      .then(settings => {
        if (settings.theme === null) {
          setInitTheme('system');
        } else if (settings.theme === 'dark') {
          setInitTheme('dark');
        } else {
          setInitTheme('light');
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
          {initTheme &&
            <select
              onChange={e => {
                const val = e.currentTarget.value as AppearanceOption;

                if (val === 'system') {
                  invoke('set_app_theme', { newTheme: null })
                    .catch(e => console.error(e));
                } else if (val === 'dark') {
                  invoke('set_app_theme', { newTheme: 'dark' })
                    .catch(e => console.error(e));
                } else if (val === 'light') {
                  invoke('set_app_theme', { newTheme: 'light' })
                    .catch(e => console.error(e));
                }
              }}
              className="text-black w-40 p-2 rounded-md dark:bg-neutral-900 dark:text-white"
              value={initTheme}
            >
              <option value="system">System</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            // <Select
            //   defaultValue={initTheme}
            //   options={themeOptions}
            //   styles={{
            //     option: (baseStyles) => ({
            //       ...baseStyles,
            //       color: 'black'
            //     }),
            //   }}
            //   onChange={newTheme => {
            //     if (newTheme?.value === 'system') {
            //       invoke('set_app_theme', { newTheme: null })
            //         .catch(e => console.error(e));
            //     } else if (newTheme?.value === 'dark') {
            //       invoke('set_app_theme', { newTheme: 'dark' })
            //         .catch(e => console.error(e));
            //     } else if (newTheme?.value === 'light') {
            //       invoke('set_app_theme', { newTheme: 'light' })
            //         .catch(e => console.error(e));
            //     }
            //   }}
            // />
          }
        </div>
      </div>
    </>
  );
}
