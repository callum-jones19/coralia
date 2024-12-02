# Types

Collection

- List of songs
- List of albums

Songs:

- Path of music file
- Tags attached to that file

Tags:

- Data possibly written in a song's metadata

Album:

- Title of the album
- Artwork
- References to songs in the album

## Album notes

- How does an album know what songs form it?
  - Collect together every song that shares the same:
    - Album name &&
    - album artist
- Where does an album struct get its data from?
  - For key, album-wide data (supposedly), get it from the first of the list
  - Maybe at a later stage, we can add a verifying step, which will alert the
    user if there was a mismatch between song tags that should be uniform across
    the album
