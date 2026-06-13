#!/usr/bin/env bash
# capture-baseline.sh — collect reproducible qualitative metrics on the
# ATS site, without launching Chrome. Designed for §1.4 baseline/after
# diffs (Roadmap Wave 1).
#
# Usage:  bash lighthouse/capture-baseline.sh > lighthouse/<name>.json

set -euo pipefail

cd "$(dirname "$0")/.."   # repo root

PAGES=(fr/index.html fr/manifeste.html en/embed.html fr/age.html
       fr/philosophie.html en/manifesto.html en/philosophy.html en/comparison.html
       fr/comparaison.html fr/faq.html en/faq.html)
MD_SOURCES=(spec/manifesto.fr.md spec/philosophy.fr.md spec/comparison.fr.md spec/faq.fr.md
            spec/manifesto.en.md spec/philosophy.en.md spec/comparison.en.md spec/faq.en.md)

json_array_pages() {
  printf '['
  local first=1
  for p in "${PAGES[@]}"; do
    [ -f "docs/$p" ] || continue
    local bytes
    bytes=$(wc -c < "docs/$p" | tr -d ' ')
    local has_inline=false
    local has_runtime_md=false
    local cdn_scripts
    if grep -q 'ATS:INLINE' "docs/$p"; then has_inline=true; fi
    if grep -qE 'cdn.jsdelivr.net/npm/(marked|dompurify)' "docs/$p"; then has_runtime_md=true; fi
    cdn_scripts=$(grep -oE 'cdn\.jsdelivr\.net/npm/[^"]+' "docs/$p" | sort -u | jq -R . | jq -s -c .)
    [ "$cdn_scripts" = "" ] && cdn_scripts="[]"
    [ $first -eq 0 ] && printf ','
    first=0
    printf '{"path":"%s","bytes":%s,"has_inlined_md":%s,"has_runtime_md_fetch":%s,"cdn_scripts":%s}' \
      "$p" "$bytes" "$has_inline" "$has_runtime_md" "$cdn_scripts"
  done
  printf ']'
}

json_array_md_sources() {
  printf '['
  local first=1
  for f in "${MD_SOURCES[@]}"; do
    [ -f "docs/$f" ] || continue
    local bytes
    bytes=$(wc -c < "docs/$f" | tr -d ' ')
    [ $first -eq 0 ] && printf ','
    first=0
    printf '{"path":"%s","bytes":%s}' "$f" "$bytes"
  done
  printf ']'
}

json_cdn_payloads() {
  printf '['
  local first=1
  for url in \
      "https://cdn.jsdelivr.net/npm/marked@13.0.3/marked.min.js" \
      "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js"; do
    local raw gz
    raw=$(curl -fsSL "$url" | wc -c | tr -d ' ')
    gz=$(curl -fsSL "$url" | gzip -c | wc -c | tr -d ' ')
    [ $first -eq 0 ] && printf ','
    first=0
    printf '{"url":"%s","raw_bytes":%s,"gzip_bytes":%s}' "$url" "$raw" "$gz"
  done
  printf ']'
}

PAGES_J=$(json_array_pages)
MD_J=$(json_array_md_sources)
CDN_J=$(json_cdn_payloads)
NOW_ISO=$(date -u +%FT%TZ)
GIT_REV=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_REF=$(git symbolic-ref --short HEAD 2>/dev/null || echo "detached")

cat <<EOF
{
  "captured_at_utc": "$NOW_ISO",
  "git_rev": "$GIT_REV",
  "git_ref": "$GIT_REF",
  "note": "Qualitative architecture metrics — see lighthouse/README.md for the full Lighthouse harness.",
  "pages": $PAGES_J,
  "md_sources": $MD_J,
  "cdn_payloads": $CDN_J
}
EOF
