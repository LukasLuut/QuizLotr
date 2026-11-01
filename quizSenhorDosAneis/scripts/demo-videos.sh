#!/usr/bin/env bash
# Build da demo (GitHub Pages): reduz os vídeos acima de 720p para 720p, no lugar, antes do
# "vite build --mode demo". Roda só no CI, sobre a cópia do checkout: o repositório continua
# com os vídeos originais. Precisa do ffmpeg/ffprobe no PATH.
set -euo pipefail
cd "$(dirname "$0")/../src/assets/videos"
for f in *.mp4; do
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f" | head -n1 | tr -dc "0-9")
  if [ "${h:-0}" -gt 720 ]; then
    ffmpeg -hide_banner -loglevel error -y -i "$f" -vf scale=-2:720 -c:v libx264 -preset veryfast -crf 27 \
      -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "720-$f"
    mv "720-$f" "$f"
    echo "720p: $f ($(du -h "$f" | cut -f1))"
  fi
done
