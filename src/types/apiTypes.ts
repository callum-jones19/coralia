import { Duration, Song } from "./types";

export interface SongEndPayload {
  newQueue: Song[];
  newPrevious: Song[];
}

export interface QueueUpdatePayload {
  newQueue: Song[];
  newPrevious: Song[];
  playbackPosition: Duration;
}

export interface QueueLengthChangePayload {
  newQueueLength: number;
  newPreviousLength: number;
}

export interface SongEndPayload {
  newQueue: Song[];
  newPrevious: Song[];
}