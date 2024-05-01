import MusicGridAlbum from "./MusicGridAlbum";

export default function MusicGrid () {
  const tmp =  [
    1,1,1,1,1,1,1,1
  ];

  return (
    <div
      className="grid gap-4 bg-slate-50 flex-grow p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7"
    >
      {tmp.map((v, i) => {
        return (
          <MusicGridAlbum key={i} />
        )
      })}
    </div>
  )
}