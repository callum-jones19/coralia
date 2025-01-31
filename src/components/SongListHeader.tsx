export default function SongListHeader() {
  return (
    <div
      className="font-bold flex flex-row justify-between text-start gap-4 border-b-2 bg-neutral-200 border-neutral-300 border-solid h-full items-center text-nowrap"
    >
      <p className="basis-1/5 pl-2 overflow-hidden text-ellipsis">Track #</p>
      <p className="basis-1/5 overflow-hidden text-ellipsis">Title</p>
      <p className="basis-1/5 overflow-hidden text-ellipsis">Album</p>
      <p className="basis-1/5 overflow-hidden text-ellipsis">Artist</p>
      <p className="basis-1/5 overflow-hidden text-ellipsis">Artist</p>
    </div>
  );
}
