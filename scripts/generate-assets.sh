#!/usr/bin/env bash
# Vygeneruje public/og.png (náhled pro sdílení), public/favicon.ico a public/apple-touch-icon.png.
# Potřebuje Google Chrome (macOS) a nainstalované node_modules. Spuštění: bash scripts/generate-assets.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/scripts/assets"
PUBLIC="$ROOT/public"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

shot() { # shot <url> <šířka> <výška> <výstup> [průhledné pozadí]
  local extra=()
  [ "${5:-}" = "transparent" ] && extra+=(--default-background-color=00000000)
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=3000 ${extra[@]+"${extra[@]}"} \
    --window-size="$2,$3" --screenshot="$4" "$1" >/dev/null 2>&1
}

shot "file://$ASSETS/og.html" 1200 630 "$PUBLIC/og.png"
shot "file://$ASSETS/icon.html" 512 512 "$TMP/icon.png" transparent
shot "file://$ASSETS/icon.html?square" 512 512 "$TMP/square.png"

sips -z 180 180 "$TMP/square.png" --out "$PUBLIC/apple-touch-icon.png" >/dev/null
for s in 16 32 48; do sips -z "$s" "$s" "$TMP/icon.png" --out "$TMP/icon-$s.png" >/dev/null; done

# favicon.ico se třemi velikostmi (PNG uvnitř ICO podporují všechny současné prohlížeče)
python3 -I - "$TMP" "$PUBLIC/favicon.ico" <<'PY'
import struct, sys
tmp, out = sys.argv[1], sys.argv[2]
sizes = [16, 32, 48]
blobs = [open(f"{tmp}/icon-{s}.png", "rb").read() for s in sizes]
offset = 6 + 16 * len(sizes)
header = struct.pack("<HHH", 0, 1, len(sizes))
entries = b""
for s, blob in zip(sizes, blobs):
    entries += struct.pack("<BBBBHHII", s, s, 0, 0, 1, 32, len(blob), offset)
    offset += len(blob)
open(out, "wb").write(header + entries + b"".join(blobs))
PY

ls -la "$PUBLIC/og.png" "$PUBLIC/favicon.ico" "$PUBLIC/apple-touch-icon.png"
