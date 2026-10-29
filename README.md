# exhibition-presenter

A small exhibition player that loops artworks like a slideshow across multiple screens, built for Processing Community Day İzmir. It was first used for the **PCD İzmir 2026** open call exhibition (26 October 2026, İzmir University of Economics) on 4 screens driven by 2 Raspberry Pis.

- A static HTML player with separate JavaScript files. No server, internet connection or install needed — it runs from `file://`.
- Every screen opens the same file with its own number: `index.html?screen=1` … `?screen=4`.
- Artworks display for 60 seconds by default. Short videos loop to fill their slot. Set an artwork’s Duration to 0 to play a video in full, or enter a custom number of seconds. Existing saved screen durations are preserved.
- Long works can sit out some cycles (e.g. a 6-minute video plays in full once every 3 cycles), so they don't dominate every loop.
- A fixed caption on top of the work, over a soft gradient rising from the bottom: a QR code to the work's page on the PCD İzmir site, title, artist, location. Event name at the bottom right.
- A panel that opens over the screen lets you choose which works play on which screen.

## Folder structure

```
index.html     markup and styles
js/app.js      playback, persistence, and control panel
js/policy.js   pure duration, frequency, and exclusive assignment rules
works.js       artwork catalog (captions, files, QR codes)
exhibition.js  event title and default screen assignment
qr/            QR codes (SVG) linking to each work on https://pcdizmir.kodart.xyz/exhibition.html
prepare.sh     converts original files into Pi-friendly formats in media/ (macOS/Linux, needs ffmpeg)
start.sh       opens one fullscreen window per HDMI screen on a Raspberry Pi
settings.js    (optional) four-screen layout downloaded from the panel
media/         converted artwork files (NOT in the repo, see below)
```

> **Artwork files are not in this repo.** They total about 1 GB, several exceed GitHub's 100 MB file limit, and they belong to the artists. The originals live in the team's shared folder; `prepare.sh` regenerates `media/` from them.

## Usage

### Panel
- **P**, a double-click, or the ⚙ button that appears at the top right when you move the mouse opens the panel.
- The table has S1–S4 checkboxes for each work. This window's column is highlighted and changes take effect immediately.
- **Duration (s)**: per-artwork display time; 0 plays videos in full (images use 60 seconds). Changes restart the current slot.
- **Plays**: Auto uses `ceil(video length / 60)` cycles, up to 100. Metadata is learned when a video first loads or the panel scans it; before that it is eligible every cycle. Choose an explicit frequency to override Auto. Empty cycles are skipped, so a screen with only one artwork cannot reduce that artwork’s relative exposure.
- Each artwork belongs to one screen. Selecting it on another screen moves it. Legacy duplicate assignments resolve to the lowest screen number.
- Deploy the same exported `settings.js` to every Pi and use **Revert to settings.js** to clear older local layouts. Offline players cannot enforce exclusivity across conflicting layouts or two windows using the same screen number.

- Screen settings: image duration, shuffle, sound (off by default), show/hide caption, show/hide QR code, rotation (for screens mounted in portrait).
- **Download settings.js** downloads the layout of all four screens as a single file.
- Keys: **P** panel · **←/→** previous/next · **F** fullscreen · **Esc** close.
- On startup a **SCREEN N** badge shows in the corner for 4 seconds, so you can tell which screen is which during setup.

Selections are stored in that browser's localStorage and survive restarts. Precedence: what's saved on the device → `settings.js` → `DEFAULT_ASSIGNMENT` in `exhibition.js`. **Revert to settings.js** in the panel clears the local copy and switches to the file.

## Exhibition setup (2 Pis, 4 screens)

Raspberry Pi 4 and 5 both have two HDMI outputs. Each Pi opens `index.html` in two separate fullscreen windows, one per screen; `start.sh` takes care of that.

### 1. On a computer (once)
1. Put the original files in a folder, update the list in `prepare.sh` and run it:
   ```bash
   ./prepare.sh --source /path/to/originals
   ```
2. Check captions and file names in `works.js`.
3. Open `index.html` in a browser, assign works to screens in the panel, click **Download settings.js** and put the file in this folder.
4. Copy the whole folder (including `media/`) to a USB stick.

### 2. On each Pi (once)
1. Copy the folder to `/home/pi/exhibition-presenter`.
2. `sudo raspi-config`:
   - Advanced Options → Wayland → **X11** (placing windows on a specific screen is reliable on X11)
   - Display Options → Screen Blanking → **No**
   - System Options → Boot / Auto Login → **Desktop Autologin**
3. Install autostart:
   - Pi A: `~/exhibition-presenter/start.sh --install 1 2`
   - Pi B: `~/exhibition-presenter/start.sh --install 3 4`
4. `sudo reboot`

### 3. On the day
1. Turn on the screens and the Pis; playback starts within about 30 seconds.
2. Check the numbers with the **SCREEN N** badge in the corner. If a Pi's two screens are swapped, swap its HDMI cables or reinstall with `--install 2 1`.
3. To change something, plug a keyboard + mouse into that Pi, move the mouse to the screen in question and press **P**.
4. To leave the kiosk window: **Alt+F4**. To reopen: `~/exhibition-presenter/start.sh 1 2`.

`start.sh` sorts HDMI ports by name (HDMI0, next to the power input, gets the first number) and uses a separate Chromium profile per screen (`~/.pcd-exhibition-screenN`). This means a change made in the panel of one window is only stored for that window; use `settings.js` for bulk changes.

## File formats

`prepare.sh` converts everything into formats that play reliably on a Raspberry Pi:

| | Target | Why |
|---|---|---|
| Video | H.264 High, 8-bit yuv420p, max 1920×1080 (1080×1920 portrait), max 30 fps, AAC audio, faststart | 10-bit, 4:4:4 and larger-than-1080p videos don't play or stutter on a Pi |
| Image | JPG, long edge max 2160 px, transparent areas flattened onto black | 8000 px PNGs exceed the Pi's memory and GPU limits |
| Thumbnail | `media/thumbs/`, 240 px | for the panel |

Rotation metadata from phone videos is applied (videos shot in portrait come out portrait). Existing outputs are skipped; `--force` regenerates everything.

## Adapting for a new event

1. `works.js`:
   - `exhibition.js`: `EVENT.title` / `EVENT.subtitle` → text at the bottom right
   - `WORKS` → for each work: `id`, `artist`, `title`, `location`, `file` (`media/...`), optionally `qr` (`qr/...svg`) and `every` (default for the Plays column, e.g. `every: 3`). If the file hasn't arrived yet, use `file: null` (shown as "NO FILE" in the panel). Every catalog entry appears in the same selectable list.
   - `exhibition.js`: `DEFAULT_ASSIGNMENT` → which works play on which screen when nothing has been saved yet.
   - If the title is empty, the artist name is shown on the large line.
2. `LIST` in `prepare.sh`: one `original file name|output name` line per work.
3. For a number of screens other than 4, change the `SCREENS` array in `js/app.js`.

## Known limitations / notes

- Raspberry Pi 5 has no H.264 hardware decoder, so video is decoded on the CPU. If one Pi plays two 1080p videos at once on two screens, test before the event; if it stutters, lower the size in `prepare.sh` to 1280×720.
- On Wayland, Chromium may ignore `--window-position`; that's why X11 is recommended.
- Works play in the order of the `WORKS` list (unless shuffle is on).
- If a video fails to load or stalls, the player skips to the next one automatically and the panel shows "FAILED TO PLAY" next to that work.
- `start.sh` hasn't been tested on real Pi hardware yet as of this commit.

## QR codes

Each QR in `qr/` opens the work on the exhibition page of the PCD İzmir site (`exhibition.html#<slug>`), which expands its information. They were generated by the team from the site's links; all 25 decode to the right URL and every slug exists on the live site (checked 23 October 2026). On a 1080p screen the QR is about 125 px wide and can be read from a full-screen capture.

The site's exhibition data also shows which original file each work uses, which is handy for matching files to works.

## Validation

Run `node --test tests/policy.test.cjs` for playback policy checks. Real browser playback and Pi hardware still require an exhibition rehearsal.

## Current four-screen layout

All 26 catalog artworks are assigned exactly once in `exhibition.js` and the shared `settings.js`. Screens 1 and 3 are portrait; Screens 2 and 4 are landscape. Screen 1 has seven works including Semantic Noise, Screen 2 has the other six audio videos, Screen 3 has six silent works, and Screen 4 has seven silent works. Sound is scheduled between Screens 1 and 2 as described below. Browser autoplay rules can require interaction to enable sound; the kiosk launcher supplies the autoplay flag.

Configure Screens 1 and 3 as portrait in the operating system. Software rotation remains 0° to avoid double rotation. If the OS still outputs landscape to a physically rotated screen, select 90° or 270° in that screen’s panel according to its mounting direction. Artwork fits without cropping.

Deploy the same files to all playback machines and reload each window with its unique screen number. This layout revision starts a fresh browser settings namespace. Later local edits still override `settings.js`; use **Revert to settings.js** on each window to restore the shared layout. Independently edited offline layouts cannot guarantee exclusive assignments across machines.

Run `node --test tests/*.test.cjs` to verify policy and the actual layout; media validation requires prepared files and `ffprobe`.

## Semantic Noise reserved audio window

Semantic Noise is on portrait Screen 1. Every ten wall-clock minutes it receives a 60-second window (seconds 3–63). Screen 2 is blank and silent during that window and the three-second guard gaps. Screen 2 waits before starting any video that cannot finish before the next reserved window, so normal playback does not truncate long videos. Other works on Screen 1 stay silent. This timetable supersedes Semantic Noise’s ordinary cycle frequency.

Reload every screen after deploying these changes. A single computer shares a clock; multiple computers require synchronized clocks. This is a browser timetable, not a distributed lock: clock drift, suspended browsers, and operating-system stalls prevent an absolute cross-device guarantee. Test the transition with the actual exhibition hardware.
