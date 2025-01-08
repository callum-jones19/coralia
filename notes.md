# TODO

Order song list/album list responses properly. Have a way so this is synced
between backend/frontend for easy mass-enqueuing.

Fix issue with seeking and starting a new source causing issues with mpa offset. Occurred when playing:

- Raphael’s Final Act

## Events

Song ends

- song-end (new playing song)

Queue changed

- queue-change (new queue)

- queue-length-change (new queue length)

Playback state changed

- is-paused (if player is paused or playing).
