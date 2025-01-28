import { Disc, Music, Settings } from "react-feather";
import { useNavigate } from "react-router";

export default function MenuBar() {
  const navigate = useNavigate();

  const handleClickSongs = () => {
    const t = navigate("/home");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleClickAlbums = () => {
    const t = navigate("/home/albums");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  const handleClickSettings = () => {
    const t = navigate("/settings");
    if (t) {
      t.catch(e => console.error(e));
    }
  };

  return (
    <>
      <div className="bg-neutral-950 w-48 h-full">
        <div className="w-[92%] overflow-auto h-full flex flex-col justify-between gap-4 items-center p-2 pt-3 bg-neutral-900 rounded-b-md m-auto">
          <div className="w-full ml-auto flex flex-col gap-2 items-center">
            <button
              className="flex flex-row items-center justify-center gap-2 bg-neutral-600 rounded-md w-10/12 p-3"
              onClick={() => handleClickSongs()}
            >
              <Music />
              <p>Songs</p>
              </button>
            <button
              className="flex flex-row items-center justify-center gap-2 bg-neutral-600 rounded-md w-10/12 p-3"
              onClick={() => handleClickAlbums()}
            >
              <Disc />
              <p>Albums</p>
              </button>
          </div>
          <button
              className="flex flex-row items-center justify-center gap-2 bg-neutral-600 rounded-md w-10/12 p-3"
              onClick={() => handleClickSettings()}
          >
            <Settings />
            <p>Settings</p>
          </button>
        </div>
      </div>
    </>
  );
}
