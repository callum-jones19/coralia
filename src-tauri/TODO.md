# Main Tasks

- [ ] Setup fully recursive library parsing
  - Have an actual check for whether the file is a music file or not - don't just skip the song on error (in case we
    want more specifc parsing for it).
- [ ] Fix year metadata tag parsing
- [ ] Remove all `.expect` and `.unwrap` uses.
- [ ] Maybe rename the 'music' folder to 'library'. That will be the folder with all the code for library parsing and
      management, etc. Then we can have a separate folder called 'player', which will then handle all of the
      functionality for actually listening to music.


Add a specific data type for managing artwork.

- Artwork for an album/song can appear in two places:
  - Embedded in the song file itself.
  - Stored in the same folder as the song.
- When scanning each song, we still will need to determine if there is an associated album.jpg (etc) that should be used as the image for that song.
  - When importing a song, trim off the songs file name from its path, and then search for `.../album.jpg` etc. If that exists, add that path as an image for the song.
  - If the song has an embedded image in its tags, we also want to extract that image out, and then store it in some sort of appdata cache location.
  - Then, an album can just take the artwork of the first song in its list (beyond this, its hard to tell what we should do. If the user has badly organised their library,
    then tbh there's not really a clearly defined behaviour that we should follow).
- How can we determine the album (data structure, not tag value) of a song, only through the song itself?
  - We could have a reference to the album inside the song? Kind of like a doubly linked list? Although, this would then require me to involve lifetimes, etc.
    Maybe it's worth doing this, but we can leave it until a bit later down the line. For the moment, we can just (inefficiently) use queries over the entire library to fetch
    an album based off a specific song within it.

I think to handle the different possible storage locations and functions each would need to invoke, it makes the most sense to just make a custom Artwork data type.
This data type would:

- Have `cached_embedded_art_path: Option<Path>`. This is for if there was an embedded artwork, which is then cached in appdata.
- Have `folder_album_art_path: Option<Path>`. This is for if there is a `folder.jpg`, `album.jpg`, etc., image inside the
- This would then sit inside each song (so you can fetch a song's artwork specifically, rather than needing to go song -> album -> artwork)
- This would also then sit in each album (so you can fetch the artwork for a specific album). When initialising an album, the album's artwork will be picked from the first
  song in the album. Maybe later down the line we can add a utility to check whether there is a metadata conflict within songs from the same album.