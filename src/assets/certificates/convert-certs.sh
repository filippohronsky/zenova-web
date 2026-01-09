#!/bin/bash

for i in $(seq -w 21 25); do
  input="Zenovalabs-Cert0${i}.png"
  output="ZENOVA-Labs-Cert0${i}.webp"

  if [[ -f "$input" ]]; then
    echo "Converting $input → $output"
    magick "$input" \
      -resize "2400x1855>" \
      -strip \
      "$output"
  else
    echo "Skipping missing file: $input"
  fi
done

# Generate manifest.json listing all .webp certificates (for the web gallery)
manifest="manifest.json"
echo "Generating $manifest"
{
  echo "["
  first=true
  for f in ZENOVA-Labs-Cert*.webp; do
    [ -f "$f" ] || continue
    if [ "$first" = false ]; then
      echo ","
    fi
    printf '  "%s"' "$f"
    first=false
  done
  echo
  echo "]"
} > "$manifest"
