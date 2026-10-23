#!/usr/bin/env bash
# Starts the exhibition on a Raspberry Pi: one fullscreen window per connected HDMI screen.
#
#   ./start.sh 1 2              Screen 1 on HDMI0, Screen 2 on HDMI1
#   ./start.sh 3 4              (on the second Pi)
#   ./start.sh --install 1 2    do this automatically every time the Pi boots
#   ./start.sh --uninstall      remove autostart
#
# Screens are ordered by port: HDMI0 (next to the power input) gets the first number.
# If two screens come up swapped, swap the cables or the numbers (2 1).

DIR="$(cd "$(dirname "$0")" && pwd)"
AUTOSTART="$HOME/.config/autostart/pcd-exhibition.desktop"

if [ "${1:-}" = "--install" ]; then
  shift
  [ $# -gt 0 ] || { echo "Give the screen numbers: ./start.sh --install 1 2"; exit 1; }
  mkdir -p "$(dirname "$AUTOSTART")"
  cat > "$AUTOSTART" <<EOF
[Desktop Entry]
Type=Application
Name=PCD Exhibition
Exec=$DIR/start.sh $*
X-GNOME-Autostart-enabled=true
EOF
  echo "Installed: screen(s) $* will start automatically on boot ($AUTOSTART)"
  exit 0
fi
if [ "${1:-}" = "--uninstall" ]; then
  rm -f "$AUTOSTART"; echo "Autostart removed."; exit 0
fi
[ $# -gt 0 ] || { echo "Usage: ./start.sh 1 2"; exit 1; }

BROWSER=$(command -v chromium-browser || command -v chromium)
[ -n "$BROWSER" ] || { echo "Chromium not found"; exit 1; }
export DISPLAY="${DISPLAY:-:0}"

if [ "${XDG_SESSION_TYPE:-}" = "wayland" ]; then
  echo "WARNING: Wayland session. Windows may not land on the right screens;"
  echo "         run sudo raspi-config → Advanced Options → Wayland → X11 and reboot."
fi

# wait until the desktop and screens are ready
for _ in $(seq 30); do
  [ "$(xrandr --listmonitors 2>/dev/null | head -1 | awk '{print $2}')" -ge 1 ] 2>/dev/null && break
  sleep 1
done
sleep 2

# no screensaver / blanking
xset s off -dpms s noblank 2>/dev/null

# close previous windows, if any
pkill -f "user-data-dir=$HOME/.pcd-exhibition-" 2>/dev/null && sleep 2

# monitors: "name width height x y", sorted by port
MONITORS=$(xrandr --listmonitors | awk 'NR>1 {
  split($3, g, /[\/x+]/); print $NF, g[1], g[3], g[5], g[6] }' | sort)
COUNT=$(echo "$MONITORS" | grep -c .)
echo "Screens found ($COUNT):"; echo "$MONITORS"
[ "$COUNT" -lt $# ] && echo "WARNING: $# screens requested but only $COUNT connected."

i=0
for N in "$@"; do
  i=$((i + 1))
  line=$(echo "$MONITORS" | sed -n "${i}p")
  [ -n "$line" ] || break
  read -r NAME W H X Y <<< "$line"
  PROFILE="$HOME/.pcd-exhibition-screen$N"
  # suppress the "restore pages" prompt after a power cut
  [ -f "$PROFILE/Default/Preferences" ] && sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]*"/"exit_type":"Normal"/' "$PROFILE/Default/Preferences"
  echo "Screen $N → $NAME (${W}x${H} @ $X,$Y)"
  "$BROWSER" \
    --user-data-dir="$PROFILE" \
    --window-position="$X,$Y" --window-size="$W,$H" \
    --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble \
    --no-first-run --password-store=basic --check-for-update-interval=31536000 \
    --autoplay-policy=no-user-gesture-required \
    "file://$DIR/index.html?screen=$N" >/dev/null 2>&1 &
  sleep 4
done
