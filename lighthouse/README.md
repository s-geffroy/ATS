# Lighthouse harness — ATS

> **Internal documentation** for the Lighthouse measurement harness used by ATS. This is not a user-facing page; it sits alongside the scripts and baselines it documents. The CI counterpart of this harness is one of the seven v1.0 requirements (cf. [`docs/spec/versioning.en.md §7.2 (7)`](../docs/spec/versioning.en.md) — closed in v0.7).

This directory holds the Lighthouse measurement harness for ATS site pages, plus captured baselines.

## Role in the project

| Surface | Trigger | Where |
|---|---|---|
| **CI gate — localhost** (4 pages × 4 categories ≥ 90, median of 3 runs) | every push to `main` and every PR | [`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml) → job `lighthouse` |
| **CI sanity — deployed origin** (≥ 95, informational, `continue-on-error`) | every push to `main` and manual dispatch (skipped on PRs) | same workflow → job `lighthouse-prod` |
| **Local qualitative capture** | manual, on every release tag | this directory (`capture-baseline.sh`, JSON baselines) |
| **Local full Lighthouse pass** | manual, x86 hosts only | this directory (`run-lighthouse.sh`) |

The localhost CI job is the authoritative regression gate. The prod CI job is a parallel check against the gzipped/CDN-served site at <https://s-geffroy.github.io/ATS/>; it runs at a stricter ≥ 95 threshold because real-user conditions are ~5-15 points better than localhost, but it never blocks a merge — Pages outages and CDN hiccups are out of the project's control. PRs skip the prod job entirely because the deployed site reflects `main`, not the PR branch.

### Median of 3 — variance taming

A single Lighthouse run on a tiny static site has been observed oscillating ~20 points on the Performance category alone (e.g. FAQ desktop has scored anywhere between 71 and 94 across consecutive identical runs). The CI runner sets `LIGHTHOUSE_RUNS=3` and gates on the **per-category median** of the three runs, which:

- absorbs cold-cache + GC outliers without lowering the gate floor;
- keeps the failure summary readable (the table prints the median row plus the min of N as a noise floor reference);
- triples the CI wall-clock budget — about 18 min worst case for 4 pages × 2 form factors × 3 runs, hence the 30-minute timeout.

For a one-shot local check, omit `LIGHTHOUSE_RUNS` and the runner reverts to a single run (the historical behaviour). The runner picks the run whose Performance score equals the median Performance and persists that one as the canonical `<slug>.json`; each individual run is also kept as `<slug>-run<N>.json` for forensic diffing.

## Why qualitative + automated

We measure two things:

1. **Qualitative architecture metrics** (`baseline-v0.5.json`, `v0.6.0.json`):
   captured by `capture-baseline.sh` from page HTML and CDN payloads.
   Reproducible everywhere (no Chrome), readable, version-controlled.
2. **Full Lighthouse scores** (Performance / Accessibility / Best Practices / SEO):
   captured by `run-lighthouse.sh` via Docker, and reproduced in CI on every push by `.github/workflows/lighthouse.yml`.

The qualitative file is enough to demonstrate the §1.1 gain (removal of CDN `marked` + `dompurify`, removal of runtime `.md` fetch). The full Lighthouse run gives the standard scores when the host can run the Docker image natively.

## Localhost vs deployed site — measurement artifacts

Both the CI gate and the local Docker harness exercise pages served from `http://127.0.0.1:8088` via Python's `http.server`. The `is-on-https` audit (Best Practices, weight 5/27) always scores 0 against that target — localhost can't legitimately serve HTTPS — but the deployed site at <https://s-geffroy.github.io/ATS/> is HTTPS. Without skipping it the BP gate caps at ~0.81 even when the prod-deployed site scores ≥ 0.90 on the same code. `ci-assert.mjs` therefore passes `skipAudits: ['is-on-https']` whenever the target URL points at a local HTTP host (`127.0.0.1`, `localhost`, `[::1]`); if `LIGHTHOUSE_BASE_URL` ever points at a public origin, the skip turns off automatically and the audit runs as normal.

Local diagnostic scripts (`run-lighthouse.sh`, `capture-baseline.sh`) do **not** apply this skip; the resulting JSON files therefore show `is-on-https` score 0. That is a known measurement artifact, not a real regression — compare with CI scores or with a manual run against the deployed origin to validate.

Note: `uses-text-compression` (Performance "opportunity") also flags ~70-105 KiB of savings against `python3 -m http.server` since it doesn't emit `Content-Encoding: gzip`. GitHub Pages gzips transparently in prod, but the audit is an opportunity (not a scored metric) so it doesn't affect the Performance gate either way — no skip needed.

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
