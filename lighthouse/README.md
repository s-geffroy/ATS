# Lighthouse harness — ATS

> **Internal documentation** for the Lighthouse measurement harness used by ATS. This is not a user-facing page; it sits alongside the scripts and baselines it documents. The CI counterpart of this harness is one of the seven v1.0 requirements (cf. [`docs/spec/versioning.en.md §7.2 (7)`](../docs/spec/versioning.en.md) — closed in v0.7).

This directory holds the Lighthouse measurement harness for ATS site pages, plus captured baselines.

## Role in the project

| Surface | Trigger | Where |
|---|---|---|
| **CI gate** (4 pages × 4 categories ≥ 90) | every push to `main` and every PR | [`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml) |
| **Local qualitative capture** | manual, on every release tag | this directory (`capture-baseline.sh`, JSON baselines) |
| **Local full Lighthouse pass** | manual, x86 hosts only | this directory (`run-lighthouse.sh`) |

The CI workflow is the authoritative regression gate; the scripts below are for local exploration and architectural diffs.

## Why qualitative + automated

We measure two things:

1. **Qualitative architecture metrics** (`baseline-v0.5.json`, `v0.6.0.json`):
   captured by `capture-baseline.sh` from page HTML and CDN payloads.
   Reproducible everywhere (no Chrome), readable, version-controlled.
2. **Full Lighthouse scores** (Performance / Accessibility / Best Practices / SEO):
   captured by `run-lighthouse.sh` via Docker, and reproduced in CI on every push by `.github/workflows/lighthouse.yml`.

The qualitative file is enough to demonstrate the §1.1 gain (removal of CDN `marked` + `dompurify`, removal of runtime `.md` fetch). The full Lighthouse run gives the standard scores when the host can run the Docker image natively.

## Platform note (Apple Silicon)

`femtopixel/google-lighthouse` is a `linux/amd64`-only image. On Apple Silicon it runs under emulation and headless Chrome crashes inside the tab ("Browser tab has unexpectedly crashed"). This is a Docker/Chromium emulation defect, not a Lighthouse defect. Workarounds:

- **Use the CI workflow** ([`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml)) — runs on GitHub Actions `ubuntu-latest` (Linux x86_64) on every push, no local Chrome required. This is the canonical path.
- Run the harness on a Linux x86_64 host (CI, server, x86 dev box).
- Or run Lighthouse locally outside Docker (Chrome DevTools → Lighthouse tab against `http://localhost:8088/`).

The harness scripts in this directory assume x86_64 hosts when run locally; they are documented for reproducibility but are **not** the primary regression gate (CI is).

## Running the qualitative baseline

```sh
cd /Users/sge/ATS/ats
bash lighthouse/capture-baseline.sh > lighthouse/qualitative-$(date +%F).json
```

It records, for the 4 target pages (`fr/index`, `fr/manifeste`, `en/embed`, `fr/age`):

- HTML page weight (bytes)
- External script tags (URL + integrity)
- Whether a `<!-- ATS:INLINE … -->` block is present (post-§1.1 marker)
- Markdown source sizes (for MD pages)
- Computed CDN payload sizes for `marked` and `dompurify` (raw + gzip)

These map directly to Lighthouse's "Eliminate render-blocking resources" and "Reduce JavaScript execution time" audits.

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
- `baseline-v0.5.json` — qualitative snapshot before §1.1 (CDN scripts + runtime MD fetch).
- `v0.6.0.json` — qualitative snapshot after §1.1 (inlined HTML).

The CHANGELOG v0.6.0 entry references the byte-level diff captured here. Future minor releases that touch the site bundle should refresh `v0.7.0.json` (or successor) and commit it alongside the relevant changes.

## See also

- [`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml) — the CI workflow that runs Lighthouse on every push and is the authoritative regression gate.
- [`docs/spec/versioning.en.md §7.2 (7)`](../docs/spec/versioning.en.md) — the v1.0 requirement "Lighthouse CI workflow producing scores ≥ 90 on the 4 standard categories for 4 reference pages" (closed in v0.7).
- [`ROADMAP.md`](../ROADMAP.md) — V1.0-D entry tracking the requirement above.
