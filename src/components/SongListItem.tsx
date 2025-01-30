import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { Play, Volume2 } from "react-feather";
import { clearAndPlayBackend } from "../api/commands";
import { Song } from "../types";

export interface SongListItemProps {
  song: Song;
  colored: boolean;
  currentlyPlayingId: number | undefined;
  showImage?: boolean;
}

export default function SongListItem(
  { song, currentlyPlayingId, showImage }: SongListItemProps,
) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const imgUrl = convertFileSrc(song.artwork ? song.artwork.thumbArt : "");

  const isPlaying = currentlyPlayingId === song.id;

  return (
    <tr
      className="h-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td className="flex flex-row items-center h-full">
        {showImage && (
          <img
            loading="lazy"
            src={imgUrl}
            width={35}
            height={35}
            alt="thumb art"
            className="rounded-sm mr-2"
          />
        )}
        {!isHovering && !isPlaying && <p>{song.tags.trackNumber ? song.tags.trackNumber : "N/A"}.</p>}
        {!isHovering && isPlaying
          && <Volume2 />}
        {isHovering
          && (
            <button
              className="rounded-full text-center"
              onClick={() => clearAndPlayBackend(song)}
            >
              <Play />
            </button>
          )}
      </td>
      <td>
        {song.tags.title}
      </td>
      <td
        title={song.tags.album}
      >
        {song.tags.album}
      </td>
      <td
        title={song.tags.artist}
      >
        {song.tags.artist}
      </td>
      <td
        title={song.tags.albumArtist}
      >
        {song.tags.albumArtist}
      </td>
    </tr>
  );
}
