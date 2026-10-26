#!/usr/bin/env bash
# Converts the original artwork files into formats that play reliably on a
# Raspberry Pi and writes them to media/. Originals are never modified.
#   Video: H.264 8-bit yuv420p, max 1920x1080 (1080x1920 portrait), max 30 fps
#   Image: JPG, long edge max 2160 px, transparent areas flattened onto black
# Usage: ./prepare.sh --source /path/to/originals   (skips existing outputs)
#        ./prepare.sh --source ... --force         (regenerates everything)

set -u
cd "$(dirname "$0")"
SRC="../originals"
OUT="media"
FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE=1 ;;
    --source) SRC="$2"; shift ;;
  esac
  shift
done
mkdir -p "$OUT"

# original file name | output name (without extension)
LIST=$(cat <<'EOF'
raphael_s171029_alt_landscape_4min.mp4|raphael-de-courville
001 - Agoston Nagy.mp4|agoston-nagy-semantic-noise
33 - Aluan Wang.mp4|aluan-wang-inkfield
20260927_133610 - Anna Carreras.mov|anna-carreras-idoni
ASL_lossless - Bedirhan Ugur.mp4|bedirhan-ugur-altered-state-of-line
CamilleRoux_Resilience-OOB-02_2024_90s - Camille Roux.mp4|camille-roux-resilience
Stratum (5) - Dist Collective.png|dist-collective-stratum
monolith - oğuz ülgen tunç.png|oguz-tunc-ulgen-monolith
Nihavendcomp (1) - Dilek Atimtay.mp4|sonic-chimes-nihavend
underlayer_ooGUKH2gmWQybkjRbGTHhcCeo4utHPcxZUQsr8FxpegrRjZCmHS - Rob Scalera.png|rob-scalera-underlayer
chet copy - Deniz Küçükcan.mp4|deniz-kucukcan-chet
loackme - Loïc Schwaller.mp4|loackme-strandedness
42626888 - Ahmad Moussa.png|gorilla-sun-some-parts-of-me
pastelhope_computer_kill_lyric_vid - Negar Chamani.mp4|pastelhope-i-think-im-going-blind
ac_futures_neonscepter_feelings_synthwave_reactive_hexagons - Amir Chamani.mp4|ac-futures-feelings
Julien_Gachadoat_Binary_drift - Julien Gachadoat.mp4|x-julien-gachadoat-binary-drift
memento-loop - Berkin Dündar.mp4|x-berkin-dundar-memento-loop
TracesofIntervention - Gözde Damla TURHAN.mov|x-gozde-damla-turhan-traces-of-intervention
Sealed_Lips_Video - Ruveyda.png|x-ruveyda-sealed-lips
trim_E112025F-AB03-4689-8A49-5797620C0668 (1) - Ali Osman Bayram.mov|x-ali-osman-bayram
metropolis8000px (1) - Murat Atimtay.png|x-murat-atimtay-metropolis
Moducon (11) - Sadık Aksu.jpg|x-sadik-aksu-moducon
PosterImage2 - Buse.mp4|x-buse-unravel
OnatSaygi-Tyhme Flows.png|x-onat-saygi-thyme-flows
Noema loop 03 - Paweł Dudko.mp4|x-pawel-dudko-noema
EOF
)

while IFS='|' read -r src dst; do
  in="$SRC/$src"
  [ -f "$in" ] || { echo "!! not found: $src"; continue; }
  case "${src##*.}" in
    png|PNG|jpg|JPG|jpeg)
      out="$OUT/$dst.jpg"
      [ $FORCE = 0 ] && [ -f "$out" ] && { echo "-- exists: $out"; continue; }
      echo ">> image: $src"
      # premultiply = flattens transparent pixels onto black
      ffmpeg -nostdin -v error -y -i "$in" \
        -vf "scale='min(2160,iw)':'min(2160,ih)':force_original_aspect_ratio=decrease:flags=lanczos,format=rgba,premultiply=inplace=1,format=yuvj444p" \
        -frames:v 1 -q:v 2 "$out"
      ;;
    *)
      out="$OUT/$dst.mp4"
      [ $FORCE = 0 ] && [ -f "$out" ] && { echo "-- exists: $out"; continue; }
      echo ">> video: $src"
      # fit into a 1920x1080 box whether landscape or portrait (1080x1920 when portrait)
      ffmpeg -nostdin -v error -y -i "$in" \
        -vf "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))',scale='if(gt(iw,ih),-2,min(1080,iw))':'if(gt(iw,ih),min(1080,ih),-2)',scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" \
        -fpsmax 30 -c:v libx264 -profile:v high -level 4.1 -preset medium -crf 19 \
        -c:a aac -b:a 160k -ac 2 -movflags +faststart "$out"
      ;;
  esac
done <<< "$LIST"

# thumbnails for the panel
mkdir -p "$OUT/thumbs"
for f in "$OUT"/*.mp4 "$OUT"/*.jpg; do
  [ -f "$f" ] || continue
  b=$(basename "${f%.*}")
  t="$OUT/thumbs/$b.jpg"
  [ $FORCE = 0 ] && [ -f "$t" ] && continue
  ss=(); case "$f" in *.mp4) ss=(-ss 3) ;; esac
  ffmpeg -nostdin -v error -y ${ss[@]+"${ss[@]}"} -i "$f" -frames:v 1 -vf "scale=240:240:force_original_aspect_ratio=decrease" -q:v 4 "$t"
done
echo "done."
