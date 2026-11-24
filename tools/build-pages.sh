#!/usr/bin/env bash
# Builds the folder Cloudflare Pages publishes at app.unravelingtherift.com.
#
# Cloudflare Pages settings (collection-bound project → Settings → Build):
#   Build command:          bash tools/build-pages.sh
#   Build output directory: dist
#
# What gets published:
#   - the app (everything in app/) at the site root, same as before
#   - the files the website pages load: tracker code, handbook, lore codex,
#     pictures, logos and backgrounds, at the same paths they have in this repo
#     (so https://app.unravelingtherift.com/promo-images/x.webp is promo-images/x.webp)
#
# What never gets published: research and working files (sql/, supabase/, tools/,
# newsletter/, add-card-pictures/, READMEs, review logs). Only the folders and
# files listed below are copied; anything new has to be added here on purpose.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=dist
rm -rf "$OUT"
mkdir -p "$OUT"

# 1. The app itself, at the root (keeps the app's current addresses working).
cp -R app/. "$OUT/"

# 2. Whole folders of pictures and page code.
FOLDERS=(
  tracker-app
  handbook-images
  codex
  branding
  card-images
  promo-images
  product-images
  ogn-korean
  ogs-korean
  lang-images-ko-OGS
  about
  market-tools
)
for d in "${FOLDERS[@]}"; do
  [ -d "$d" ] && cp -R "$d" "$OUT/$d"
done

# 3. Single files the pages load.
FILES=(
  handbook/riftbound-starter-handbook.html
  tracker-data/codex-links.json
  tracker-data/collab-groups.json
  tracker-data/decks.json
  tracker-data/events.json
  tracker-data/legality.json
  tracker-data/poros.json
  tracker-data/promo-tcg.json
  ogn.json ogs.json sfd.json unl.json ven.json rad.json
  cardtext.json
  regions.json
  regions-tab.js
  set-legacy.webp set-radiance.webp set-reckoning.webp set-reckoning-v2.webp
  collect-bound-bg.jpg
  "homepage bg.png"
  "about us image.png"
  "contact us image.png"
)
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "$OUT/$(dirname "$f")"
    cp "$f" "$OUT/$f"
  fi
done

# 4. Working files that sit inside published folders but aren't for visitors.
find "$OUT" \( -name 'README.md' -o -name 'placeholder.txt' -o -name '*.py' -o -name '__pycache__' \) -prune -exec rm -rf {} +
rm -rf "$OUT/handbook/tools"

echo "Built $OUT: $(find "$OUT" -type f | wc -l) files, $(du -sh "$OUT" | cut -f1)"
