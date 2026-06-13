#!/usr/bin/env bash
# run-lighthouse.sh — full Lighthouse pass via Docker.
# Requires an x86_64 host (or Rosetta + a working amd64 headless Chrome).
# On Apple Silicon native arm64 this image crashes at runtime; see README.

set -euo pipefail

cd "$(dirname "$0")/.."

NGINX_NAME="ats-nginx-lh"
PORT="${PORT:-8088}"
TAG="${TAG:-v0.6.0}"
OUT_DIR="lighthouse/runs-$TAG"
mkdir -p "$OUT_DIR"

# Start nginx if not running
if ! docker ps --format '{{.Names}}' | grep -q "^${NGINX_NAME}$"; then
  docker run -d --name "$NGINX_NAME" --rm -p "${PORT}:80" \
    -v "$PWD/docs:/usr/share/nginx/html:ro" nginx:alpine
  sleep 1
fi

PAGES=("fr/index.html" "fr/manifeste.html" "en/embed.html" "fr/age.html")
FORMS=("mobile" "desktop")

for page in "${PAGES[@]}"; do
  slug=$(echo "$page" | tr '/.' '__' | sed 's/_html$//')
  for form in "${FORMS[@]}"; do
    out="${OUT_DIR}/${slug}-${form}.json"
    echo ">> $page ($form) → $out"
    docker run --rm \
      -v "$PWD/lighthouse:/home/chrome/reports" \
      femtopixel/google-lighthouse \
      "http://host.docker.internal:${PORT}/${page}" \
      --output=json --output-path="/home/chrome/reports/runs-${TAG}/${slug}-${form}.json" \
      --form-factor="$form" \
      --only-categories=performance,best-practices,seo,pwa \
      --quiet || echo "!! Lighthouse failed for $page ($form)"
  done
done

docker stop "$NGINX_NAME" >/dev/null 2>&1 || true
echo "Done. Reports in $OUT_DIR/"
