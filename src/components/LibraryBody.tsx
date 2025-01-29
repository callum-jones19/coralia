import { Outlet } from "react-router";

export default function LibraryBody() {
  return (
    <>
      <div className="shadow-md basis-full rounded-md h-full">
        <Outlet />
      </div>
    </>
  );
}