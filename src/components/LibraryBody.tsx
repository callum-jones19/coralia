import { Outlet } from "react-router";

export default function LibraryBody() {
  return (
    <>
      <div className="bg-neutral-200 basis-full rounded-b-md">
        <Outlet />
      </div>
    </>
  );
}