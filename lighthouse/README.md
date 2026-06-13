# Lighthouse harness — ATS

This directory holds the Lighthouse measurement harness for ATS site pages,
plus captured baselines.

## Why qualitative + automated

We measure two things:

1. **Qualitative architecture metrics** (`baseline-v0.5.json`, `v0.6.0.json`):
   captured by `capture-baseline.sh` from page HTML and CDN payloads.
   Reproducible everywhere (no Chrome), readable, version-controlled.
2. **Full Lighthouse scores** (Performance / SEO / Best Practices / PWA):
   captured by `run-lighthouse.sh` via Docker.

The qualitative file is enough to demonstrate the §1.1 gain
(removal of CDN `marked` + `dompurify`, removal of runtime `.md` fetch).
The full Lighthouse run gives the standard scores when the host can run
the Docker image natively.

## Platform note (Apple Silicon)

`femtopixel/google-lighthouse` is an `linux/amd64`-only image. On
Apple Silicon it runs under emulation and headless Chrome crashes
inside the tab ("Browser tab has unexpectedly crashed"). Workarounds:

- Run the harness on Linux/x86_64 (CI, server, x86 dev box).
- Or run Lighthouse locally on the host (outside the Docker constraint),
  e.g. via Chrome DevTools → Lighthouse tab against `http://localhost:8088/`.

The harness scripts below assume x86_64 hosts; documented for reproducibility.

## Running the qualitative baseline

```sh
cd /Users/sge/ATS/ats
bash lighthouse/capture-baseline.sh > lighthouse/qualitative-$(date +%F).json
```

It records, for the 4 target pages (`fr/index`, `fr/manifeste`, `en/embed`,
`fr/age`):

- HTML page weight (bytes)
- External script tags (URL + integrity)
- Whether a `<!-- ATS:INLINE … -->` block is present (post-§1.1 marker)
- Markdown source sizes (for MD pages)
- Computed CDN payload sizes for `marked` and `dompurify` (raw + gzip)

These map directly to Lighthouse's "Eliminate render-blocking resources"
and "Reduce JavaScript execution time" audits.

## Running the full Lighthouse pass (Docker, x86)

```sh
cd /Users/sge/ATS/ats
docker run -d --name ats-nginx --rm -p 8088:80 \
  -v "$PWD/docs:/usr/share/nginx/html:ro" nginx:alpine

for page in fr/index.html fr/manifeste.html en/embed.html fr/age.html; do
  slug=$(echo "$page" | tr '/.' '__')
  for form in mobile desktop; do
    docker run --rm \
      -v "$PWD/lighthouse:/home/chrome/reports" \
      femtopixel/google-lighthouse \
      "http://host.docker.internal:8088/$page" \
      --output=json --output-path=/home/chrome/reports/${slug}-${form}.json \
      --form-factor=$form --quiet
  done
done

docker stop ats-nginx
```

Outputs land as `<slug>-mobile.json` and `<slug>-desktop.json`.

## Files

- `capture-baseline.sh` — qualitative metric capture (always works).
- `run-lighthouse.sh` — full Docker harness (x86 hosts).
- `baseline-v0.5.json` — qualitative snapshot before §1.1 (CDN scripts +
  runtime MD fetch).
- `v0.6.0.json` — qualitative snapshot after §1.1 (inlined HTML).

The CHANGELOG v0.6.0 entry references the byte-level diff captured here.
