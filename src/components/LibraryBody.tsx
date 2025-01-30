import { Outlet } from "react-router";

export default function LibraryBody() {
  return (
    <>
      <div className="bg-neutral-100 basis-full rounded-md h-full">
        <Outlet />
      </div>
    </>
  );
}
