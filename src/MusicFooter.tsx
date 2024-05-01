import Seekbar from "./Seekbar";

export default function MusicFooter() {
  return (
    <div className="bg-gray-700 basis-36">
      <div className="flex flex-col justify-center h-full gap-3">
        <div className="flex flex-row mr-10 ml-10 justify-center">
          <button className="bg-white mr-3 p-2 font-bold">&lt;</button>
          <button className="bg-white p-2 pr-4 pl-4 font-bold">P</button>
          <button className="bg-white ml-3 p-2 font-bold">&gt;</button>
        </div>
        <Seekbar />
      </div>
    </div>
  )
}