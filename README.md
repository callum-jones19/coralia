# Coralia

## Overview

Coralia is a local-only music player 🎶. It creates an internal library from a specified
set of local folders and allows you to browse songs and albums, search through them and
queue thousands of songs at a time.

Coralia is written in Rust 🦀 and Typescript 🎉. The aim is to have a clean, adaptable UI
while supporting efficient playback with full cross-platform support. Minimal bloat,
maximum performance.

## Features

Music playback features:

- [X] Gapless playback
- [X] Support for all main music file formats (MP3, FLAC, AAC, WAV, etc)
- [X] Shuffle support
- [X] Large, efficient queue support
- [ ] Replay gain support

App features:

- [X] Fully cross-platform
- [X] Multiple-folder library
- [X] Fully responsive design for small screens
- [X] Scanning and handling of folder-based album art
- [ ] Scanning and handling of embedded album art
- [X] Native OS media controls integration (media control shortcuts, currently playing media preview)
- [X] Support for searching albums and songs by artist name, song name and album name
- [X] Intelligently populates queue based on screen song started playing from
- [X] Full support for light, dark and system color scheme

## Installation

Currently, this is not in any package managers (and probably will not be for a while - I
have very limited free time, so will do it when/if I can). The current options are either to
build from source, or download a pre-compiled binary from the
[GitHub Releases page](https://github.com/callum-jones19/coralia/releases).

To build from source, please make sure you have installed Tauri 2.0. From the
root of the repository, `npm instasll` and then run `tauri build` as outlined
in the Tauri 2.0 docs [here](https://tauri.app/distribute/). Prerequisites will
depend on the OS/distribution you are building on.

## Screenshots

Song overview page:

![Song Overview page](assets/songs_page_overview.png)

Albums overview page:

![Albums Overview page](assets/albums_page_overview.png)

Album page:

![Album page](assets/album_page_overview.png)

Fullscreen view:

![Fullscreen view](assets/fullscreen_overview.png)

Responsive view:

![Responsive view](assets/responsive_page_preview.png)

Create library page:

![Albums Overview page](assets/create_library_overview.png)

Playing song:

![Playing song preview](assets/playing_song_preview.png)

Search view:

![Search view](assets/search_page_overview.png)

Settings page:

![Settings page](assets/settings_page_overview.png)

## Issues

There will likely be small bugs here and there - I do my best to address them, but
the nature of this app as a side-project means that some will inevitably fall through the
cracks. If you find a bug, please feel free to open an issue, and I will take a look at it
when I have time.
