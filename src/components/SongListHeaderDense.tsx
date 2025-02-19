export default function SongListHeaderDense() {
  return (
    <div
      className="font-bold flex flex-row justify-start text-start gap-4 border-b-2 bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 border-solid h-full items-center text-nowrap"
    >
      <p className="basis-14 pl-2 overflow-hidden text-ellipsis">#</p>
      <p className="basis-grow overflow-hidden text-ellipsis text-start">Title</p>
    </div>
  );
}
