export default function SongListHeader() {
  return (
    <div
      className="font-bold flex flex-row justify-between text-start gap-4 border-b-2 bg-neutral-200 border-neutral-300 border-solid h-full items-center"
    >
      <p className="basis-1/5 pl-2">Track #</p>
      <p className="basis-1/5">Title</p>
      <p className="basis-1/5">Album</p>
      <p className="basis-1/5">Artist</p>
      <p className="basis-1/5">Artist</p>
    </div>
  );
}
