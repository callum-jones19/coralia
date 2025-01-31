import { Outlet } from "react-router";

export default function LibraryBody() {
  return (
    <>
      <div className="bg-neutral-100 basis-1/2 overflow-auto flex-grow rounded-md h-full">
        <Outlet />
      </div>
    </>
  );
}
