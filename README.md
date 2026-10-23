# exhibition-presenter

A small exhibition player that loops artworks like a slideshow across multiple screens, built for Processing Community Day İzmir. It was first used for the **PCD İzmir 2026** open call exhibition (26 October 2026, İzmir University of Economics) on 4 screens driven by 2 Raspberry Pis.

- A single `index.html`. No server, internet connection or install needed — it runs from `file://`.
- Every screen opens the same file with its own number: `index.html?screen=1` … `?screen=4`.
- Videos play for their full length; images (PNG/JPG) stay up for a set duration (20 s by default). The playlist loops.
- A fixed caption on top of the work, over a soft gradient rising from the bottom: title, artist, location. Event name at the bottom right.
- A panel that opens over the screen lets you choose which works play on which screen.

## Folder structure

```
index.html     player + control panel
works.js       event title, list of works (captions), default screen assignment
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
- Screen settings: image duration, shuffle, sound (off by default), show/hide caption, rotation (for screens mounted in portrait).
- **Download settings.js** downloads the layout of all four screens as a single file.
- Keys: **P** panel · **←/→** previous/next · **F** fullscreen · **Esc** close.
- On startup a **SCREEN N** badge shows in the corner for 4 seconds, so you can tell which screen is which during setup.

Selections are stored in that browser's localStorage and survive restarts. Precedence: what's saved on the device → `settings.js` → `DEFAULT_ASSIGNMENT` in `works.js`. **Revert to settings.js** in the panel clears the local copy and switches to the file.

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
   - `EVENT.title` / `EVENT.subtitle` → text at the bottom right
   - `WORKS` → for each work: `id`, `artist`, `title`, `location`, `file` (`media/...`). If the file hasn't arrived yet, use `file: null` (shown as "NO FILE" in the panel). Use `listed: false` for files that are in the folder but not on the list.
   - `DEFAULT_ASSIGNMENT` → which works play on which screen when nothing has been saved yet.
   - If the title is empty, the artist name is shown on the large line.
2. `LIST` in `prepare.sh`: one `original file name|output name` line per work.
3. For a number of screens other than 4, change the `SCREENS` array in `index.html`.

## Known limitations / notes

- Raspberry Pi 5 has no H.264 hardware decoder, so video is decoded on the CPU. If one Pi plays two 1080p videos at once on two screens, test before the event; if it stutters, lower the size in `prepare.sh` to 1280×720.
- On Wayland, Chromium may ignore `--window-position`; that's why X11 is recommended.
- Works play in the order of the `WORKS` list (unless shuffle is on).
- If a video fails to load or stalls, the player skips to the next one automatically and the panel shows "FAILED TO PLAY" next to that work.
- `start.sh` hasn't been tested on real Pi hardware yet as of this commit.
