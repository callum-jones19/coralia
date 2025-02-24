export default function AppearanceSettings() {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 border-b-2 border-solid border-neutral-300 pb-3">
        Appearance
      </h2>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center dark:bg-neutral-700 p-3 rounded-md">
          <div className="flex flex-col">
            <p className="text-lg">Theme</p>
          </div>
          <select name="theme" id="theme" className="bg-transparent p-2">
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
