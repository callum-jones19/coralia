export default function MusicFooter() {
  return (
    <div className="min-h-28 bg-gray-700">
      <div className="flex flex-col justify-center h-full gap-3">
        <div className="flex flex-row mr-10 ml-10 justify-center">
          <button className="bg-white mr-3 p-2 font-bold">&lt;</button>
          <button className="bg-white p-2 pr-4 pl-4 font-bold">P</button>
          <button className="bg-white ml-3 p-2 font-bold">&gt;</button>
        </div>
        <div className="flex flex-row mr-10 ml-10">
          <p className="text-white">0:00</p>
          <input
            className="w-full ml-5 mr-5 bg-red-600"
            type="range"
          />
          <p className="text-white">3:21</p>
        </div>
      </div>
    </div>
  )
}