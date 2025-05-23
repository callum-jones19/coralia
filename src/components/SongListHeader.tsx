export default function SongListHeader() {
  return (
    <div className="font-bold flex flex-row justify-between text-start gap-4 border-b-2 bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 border-solid h-full items-center text-nowrap rounded-t-md  pr-4">
      <p className="basis-20 pl-2 overflow-hidden text-ellipsis flex-grow-0">#</p>
      <p className="basis-1/4 flex-grow overflow-hidden text-ellipsis">Title</p>
      <p className="basis-1/4 flex-grow overflow-hidden text-ellipsis">Album</p>
      <p className="basis-1/4 flex-grow overflow-hidden text-ellipsis">Artist</p>
    </div>
  );
}
