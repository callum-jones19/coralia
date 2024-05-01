export default function Seekbar() {
  return (
    <div className="flex flex-row mr-10 ml-10">
      <p className="text-white">0:00</p>
      <input
        className="w-full ml-5 mr-5 bg-transparent "
        type="range"
      />
      <p className="text-white">3:21</p>
    </div>
  );
}