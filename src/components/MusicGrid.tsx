import MusicGridAlbum from "./MusicGridAlbum";

export interface MusicGridProps {
  changeAudioSrc: (newSrc: string) => void;
}

export default function MusicGrid({ changeAudioSrc }: MusicGridProps) {
  const tmp = [
    [
      "https://coverartarchive.org/release/9d56a188-72d7-4e66-9619-d10043a1d6e4/36166506502-1200.jpg",
      "Wallsocket",
      "underscores",
    ],
    [
      "https://coverartarchive.org/release/04bed45d-d93f-4865-a92f-c5b9368c85e7/36838630641-1200.jpg",
      "Surfer Rosa",
      "Pixies",
    ],
    [
      "https://coverartarchive.org/release/560b2a6e-9584-43b6-b4be-1c0eae33843a/36693894826-1200.jpg",
      "Cartwheel",
      "Hotline TNT",
    ],
    [
      "https://coverartarchive.org/release/b4b2333e-898e-448a-ae90-312082516089/4317457733-1200.jpg",
      "It's Blitz",
      "Yeah Yeah Yeahs",
    ],
    [
      "https://coverartarchive.org/release/bd9e8c87-33c8-4705-a9bb-d9d5b635e033/36779741058-1200.jpg",
      "softscars",
      "Yeule",
    ],
    [
      "https://coverartarchive.org/release/79271d50-2cb5-4d9e-af16-332578eea396/29794417368-1200.jpg",
      "Last Year Was Weird, Vol. 3sdfsdfsedfsdf",
      "Tkay Maidza",
    ],
    [
      "https://coverartarchive.org/release/9228afaf-6abb-4ecc-906f-8db837e9efb4/25898729927-1200.jpg",
      "The New Abnormal",
      "The Strokes",
    ],
    [
      "https://coverartarchive.org/release/9d56a188-72d7-4e66-9619-d10043a1d6e4/36166506502-1200.jpg",
      "Wallsocket",
      "underscores",
    ],
    [
      "https://coverartarchive.org/release/04bed45d-d93f-4865-a92f-c5b9368c85e7/36838630641-1200.jpg",
      "Surfer Rosa",
      "Pixies",
    ],
    [
      "https://coverartarchive.org/release/560b2a6e-9584-43b6-b4be-1c0eae33843a/36693894826-1200.jpg",
      "Cartwheel",
      "Hotline TNT",
    ],
    [
      "https://coverartarchive.org/release/b4b2333e-898e-448a-ae90-312082516089/4317457733-1200.jpg",
      "It's Blitz",
      "Yeah Yeah Yeahs",
    ],
    [
      "https://coverartarchive.org/release/bd9e8c87-33c8-4705-a9bb-d9d5b635e033/36779741058-1200.jpg",
      "softscars",
      "Yeule",
    ],
    [
      "https://coverartarchive.org/release/79271d50-2cb5-4d9e-af16-332578eea396/29794417368-1200.jpg",
      "Last Year Was Weird, Vol. 3",
      "Tkay Maidza",
    ],
    [
      "https://coverartarchive.org/release/9228afaf-6abb-4ecc-906f-8db837e9efb4/25898729927-1200.jpg",
      "The New Abnormal",
      "The Strokes",
    ],
    [
      "https://coverartarchive.org/release/9d56a188-72d7-4e66-9619-d10043a1d6e4/36166506502-1200.jpg",
      "Wallsocket",
      "underscores",
    ],
    [
      "https://coverartarchive.org/release/04bed45d-d93f-4865-a92f-c5b9368c85e7/36838630641-1200.jpg",
      "Surfer Rosa",
      "Pixies",
    ],
    [
      "https://coverartarchive.org/release/560b2a6e-9584-43b6-b4be-1c0eae33843a/36693894826-1200.jpg",
      "Cartwheel",
      "Hotline TNT",
    ],
    [
      "https://coverartarchive.org/release/b4b2333e-898e-448a-ae90-312082516089/4317457733-1200.jpg",
      "It's Blitz",
      "Yeah Yeah Yeahs",
    ],
    [
      "https://coverartarchive.org/release/bd9e8c87-33c8-4705-a9bb-d9d5b635e033/36779741058-1200.jpg",
      "softscars",
      "Yeule",
    ],
    [
      "https://coverartarchive.org/release/79271d50-2cb5-4d9e-af16-332578eea396/29794417368-1200.jpg",
      "Last Year Was Weird, Vol. 3",
      "Tkay Maidza",
    ],
    [
      "https://coverartarchive.org/release/9228afaf-6abb-4ecc-906f-8db837e9efb4/25898729927-1200.jpg",
      "The New Abnormal",
      "The Strokes",
    ],
    [
      "https://coverartarchive.org/release/9d56a188-72d7-4e66-9619-d10043a1d6e4/36166506502-1200.jpg",
      "Wallsocket",
      "underscores",
    ],
    [
      "https://coverartarchive.org/release/04bed45d-d93f-4865-a92f-c5b9368c85e7/36838630641-1200.jpg",
      "Surfer Rosa",
      "Pixies",
    ],
    [
      "https://coverartarchive.org/release/560b2a6e-9584-43b6-b4be-1c0eae33843a/36693894826-1200.jpg",
      "Cartwheel",
      "Hotline TNT",
    ],
    [
      "https://coverartarchive.org/release/b4b2333e-898e-448a-ae90-312082516089/4317457733-1200.jpg",
      "It's Blitz",
      "Yeah Yeah Yeahs",
    ],
    [
      "https://coverartarchive.org/release/bd9e8c87-33c8-4705-a9bb-d9d5b635e033/36779741058-1200.jpg",
      "softscars",
      "Yeule",
    ],
    [
      "https://coverartarchive.org/release/79271d50-2cb5-4d9e-af16-332578eea396/29794417368-1200.jpg",
      "Last Year Was Weird, Vol. 3",
      "Tkay Maidza",
    ],
    [
      "https://coverartarchive.org/release/9228afaf-6abb-4ecc-906f-8db837e9efb4/25898729927-1200.jpg",
      "The New Abnormal",
      "The Strokes",
    ],
  ];

  return (
    <div className="w-full grid gap-4 bg-slate-50 p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 overflow-auto">
      {tmp.map((v, i) => {
        return (
          <MusicGridAlbum
            key={i}
            artSrc={v[0]}
            title={v[1]}
            artist={v[2]}
            changeAudioSrc={changeAudioSrc}
          />
        );
      })}
    </div>
  );
}
