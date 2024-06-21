import { Link } from "react-router-dom";

export default function SettingsScreen() {
  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-3xl">Settings</p>
      <Link to={"/"} className="bg-slate-600 p-3">Home</Link>
    </div>
  );
}
