import { AlertCircle, X } from "react-feather"

export interface ErrorPopupProps {
  errorMessage: string;
}

export default function ErrorPopup({ errorMessage }: ErrorPopupProps) {
  return (
    <>
      <div className="h-fit w-96 absolute bottom-5 right-5 bg-neutral-100 z-30 rounded-md shadow-md flex flex-col">
        <div className="flex justify-between p-4 border-b-2 border-solid border-neutral-400 items-center text-red-800">
          <div className="flex gap-2 ">
            <AlertCircle />
            <p className="text-xl font-bold">Error</p>
          </div>
          <button className="p-1 hover:bg-neutral-300 rounded-md">
            <X />
          </button>
        </div>
        <p className="p-4">{errorMessage}</p>
      </div>
    </>
  )
}