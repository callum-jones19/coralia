# Main Tasks

- [ ] Setup fully recursive library parsing
  - Have an actual check for whether the file is a music file or not - don't just skip the song on error (in case we
    want more specifc parsing for it).
- [ ] Fix year metadata tag parsing
- [ ] Remove all `.expect` and `.unwrap` uses.
- [ ] Maybe rename the 'music' folder to 'library'. That will be the folder with all the code for library parsing and
      management, etc. Then we can have a separate folder called 'player', which will then handle all of the
      functionality for actually listening to music.
