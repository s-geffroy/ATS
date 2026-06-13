# Security policy

## Supported versions

Until v1.0 ships, ATS is **pre-release**. Only the **latest tagged minor version** receives security fixes. Once v1.0 ships, see the table that will replace this paragraph.

## Reporting a vulnerability

We accept reports through two channels:

1. **Preferred: GitHub Security Advisories**
   Open a private advisory at <https://github.com/s-geffroy/ATS/security/advisories/new>.
   This keeps the discussion confidential until a fix is published.

2. **Email** : `sylvain.geffroy@gmail.com`
   Use PGP if you can (key fingerprint published at <https://keybase.io/sgeffroy>, when available).
   Subject prefix `[ATS-SEC]` so it bypasses normal filtering.

Please include:
- A description of the vulnerability and its potential impact.
- A minimal reproduction (Python script, JS snippet, or HTTP request).
- The version affected (commit SHA or release tag).
- Your preferred attribution name for the eventual CVE / advisory.

## Response timeline

- **Acknowledgement** within **72 hours** (best-effort; ATS is maintained by a single individual).
- **Triage** with severity assessment within **7 days**.
- **Fix or mitigation** within **30 days** for high-severity issues, **90 days** for moderate, best-effort for low.
- **Public disclosure** once a fix is released, with credit to the reporter unless they request anonymity.

## Scope

In scope:
- The Δ ATS spec (`docs/spec/*.md`) — semantic bugs that could allow ambiguous or non-canonical parses.
- The Python reference implementation (`code/ats.py`, `code/bridges/`).
- The JS reference implementation (`docs/assets/js/ats.js`, `ats-clock.js`).
- The static site under `docs/` — XSS, CSP bypasses, dependency vulnerabilities.
- The PWA service worker (`docs/sw.js`) and PWA manifest.
- The CI workflows (`.github/workflows/*.yml`).

Out of scope:
- Vulnerabilities in third-party packages used at build time (`marked`, `dompurify`, `pagefind`) — report upstream first; we will track CVEs.
- Self-XSS in browser DevTools or via user-pasted permalinks.
- Social engineering or physical attacks.

## What to expect

ATS code intentionally has **zero runtime dependencies** in the core spec implementations (Python core, JS core). Calendar bridges have optional dependencies declared explicitly (`convertdate`, `lunardate`). Build-time and site-time dependencies are pinned and auditable in `scripts/package-lock.json` and `pyproject.toml`.

The site's `<meta http-equiv="Content-Security-Policy">` is intentionally strict (`default-src 'self'`); reports of bypasses are welcome.
