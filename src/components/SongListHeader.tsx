export default function SongListHeader() {
  return (
    <div className="font-bold flex flex-row justify-between text-start gap-4 pt-2 pb-2 bg-neutral-900 border-b-2 border-neutral-200 border-solid">
      <p className="basis-1/5">Track #</p>
      <p className="basis-1/5">Title</p>
      <p className="basis-1/5">Album</p>
      <p className="basis-1/5">Artist</p>
      <p className="basis-1/5">Artist</p>
    </div>
  );
}