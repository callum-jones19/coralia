import { Disc, Music, Settings } from "react-feather";
import { useNavigate } from "react-router";

export default function MenuBar() {
  const navigate = useNavigate();

  const handleClickSongs = () => {
    const t = navigate('/home');
    if (t) {
      t.catch(e => console.error(e));
    }
  }

  const handleClickAlbums = () => {
    const t = navigate('/home/albums');
    if (t) {
      t.catch(e => console.error(e));
    }
  }

  const handleClickSettings = () => {
    const t = navigate('/settings');
    if (t) {
      t.catch(e => console.error(e));
    }
  }

  return (
    <>
      <div className="w-20 h-full flex flex-col justify-start gap-4 items-center p-2 bg-neutral-800 border-r-8 border-b-8 border-neutral-950">
        <button
          className="bg-neutral-600 rounded-md w-10/12 aspect-square"
          onClick={() => handleClickSongs()}
        >
          <Music className="m-auto" />
        </button>
        <button
          className="bg-neutral-600 rounded-md w-10/12 aspect-square"
          onClick={() => handleClickAlbums()}
        >
          <Disc className="m-auto" />
        </button>
        <button
          className="bg-neutral-600 rounded-md w-10/12 aspect-square"
          onClick={() => handleClickSettings()}
        >
          <Settings className="m-auto" />
        </button>
      </div>
    </>
  );
}