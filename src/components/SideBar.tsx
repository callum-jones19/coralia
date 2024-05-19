export default function SideBar () {
  return (
    <div
      className="w-56 bg-gray-400 h-full flex-grow-0 flex-shrink-0"
    >
      <div className="flex flex-col mt-3 gap-3">
        <button className="bg-white ml-2 mr-2 p-1">Albums</button>
        <button disabled className="bg-gray-300 ml-2 mr-2 p-1">Songs</button>
        <button disabled className="bg-gray-300 ml-2 mr-2 p-1">Artists</button>
      </div>
    </div>
  );
}