# ATS — Security policy

**Status:** Pre-release v0.7
**Document type:** **NORMATIVE PROCESS DOCUMENT** for vulnerability reporting and handling.
**Authoritative language:** English.
**Cross-references:** `GOVERNANCE.md §1` (editors of record), `versioning.en.md §6` (RFC procedure for spec-level fixes), `manifesto.en.md §16` (standards process and governance).

---

## 0. Conventions

### 0.1 Requirement levels

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 [RFC 2119, RFC 8174] when, and only when, they appear in all capitals.

### 0.2 Severity definitions

- **Critical** — Remote code execution, authentication bypass, or systemic data exposure across any deployed reference site or PWA. None currently expected (no auth, no server-side state).
- **High** — Cross-site scripting (XSS) bypassing the project CSP, Content-Security-Policy regression that enables arbitrary script injection, or a spec-level parsing ambiguity that allows the same canonical string to be produced from two distinct UTC instants.
- **Moderate** — Denial-of-service in the reference implementations (`code/ats.py`, `docs/assets/js/ats.js`) reachable with a bounded input, dependency CVE in a build-time tool affecting integrity of the published artefacts, conformance-vector tampering vector.
- **Low** — Defensive-coding improvements, missing input bounds where no exploit path is known, documentation defects with security implications.

---

## 1. Supported versions

| Branch | Status | Security fixes |
|---|---|---|
| `0.7.x` (latest pre-release) | Active | Yes |
| `0.6.x` and earlier | Archived | No — upgrade |
| `1.0.x` (future) | Will be active once tagged | Yes (per `versioning.en.md §7.3`) |

Until v1.0 ships, only the **latest tagged minor version** receives security fixes. Once v1.0 ships, the editors of record (`GOVERNANCE.md §1`) **MUST** publish a revised support table here as part of the release.

---

## 2. Reporting channels

Reporters **MUST** use one of the following:

### 2.1 GitHub Security Advisories (preferred)

Open a private advisory at <https://github.com/s-geffroy/ATS/security/advisories/new>. This keeps discussion confidential until a fix is published and produces a CVE-aligned record automatically.

### 2.2 Email

Send to `sylvain.geffroy@gmail.com` with subject prefix `[ATS-SEC]` (this bypasses standard inbox filtering). Reporters **SHOULD** use PGP when sending sensitive technical detail.

- Fingerprint: published on <https://keybase.io/sgeffroy> once the key roll is complete.
- Until the key is published, prefer §2.1 for confidentiality.

### 2.3 Out-of-band channels (NOT supported)

Twitter / Bluesky DMs, Discord, IRC, and direct phone contact **MUST NOT** be used to report vulnerabilities. They do not produce an auditable record and risk premature disclosure.

### 2.4 What to include in a report

A complete report **SHOULD** include:

- Description of the vulnerability and its potential impact.
- A minimal reproduction (Python script, JS snippet, HTTP request, or input string).
- The version affected: a commit SHA, a release tag, or a published URL with the embedded `spec_version`.
- The reporter's preferred attribution name for the eventual CVE / advisory (or "anonymous").
- Disclosure preference (coordinated, immediate, embargo until a date).

---

## 3. Response cadence

The editors of record commit (best-effort, single-maintainer pre-v1.0) to the following timeline:

| Stage | Target | Hard cap |
|---|---|---|
| Acknowledgement of receipt | 72 hours | 7 days |
| Severity assessment + triage published to the reporter | 7 days | 14 days |
| Fix or mitigation — Critical | 7 days | 30 days |
| Fix or mitigation — High | 30 days | 90 days |
| Fix or mitigation — Moderate | 90 days | 180 days |
| Fix or mitigation — Low | best-effort | — |
| Public disclosure after fix released | 14 days | 90 days |

If a hard cap is missed, the editors **MUST** publish a status update to the reporter and a public abstract (no exploit detail) on the repository.

Post-v1.0, the steering committee (`GOVERNANCE.md §2.2`) **MUST** assign a security shepherd per report. Pre-v1.0, the BDFL shepherds all reports.

---

## 4. Coordinated disclosure policy

The default is **coordinated disclosure**:

1. Reporter and editor agree on a fix date or embargo window during triage.
2. Editor prepares a fix branch (private, if §2.1 was used).
3. Fix is merged, a release is cut, and the public advisory is published in lockstep.
4. The reporter is credited (per §2.4) unless they requested anonymity.

A reporter **MAY** request **immediate disclosure** if the vulnerability is already public, if the editors miss a hard cap (§3), or if the reporter has independent evidence of active exploitation.

The editors **MAY** request an **embargo extension** of up to 30 days beyond the hard cap (§3) when fixing the vulnerability requires a normative spec change requiring an RFC (`versioning.en.md §6`).

---

## 5. Scope (in)

The following are **in scope**:

- **Specification text** (`docs/spec/*.md`). Semantic bugs that allow ambiguous or non-canonical parses; spec wording that permits a conformant implementation to produce a malformed canonical or short form; ABNF errors. Spec-level vulnerabilities **MUST** be fixed via the RFC procedure (`versioning.en.md §6`).
- **Reference implementations**: Python (`code/ats.py`, `code/ats_multi_planetary.py`, `code/bridges/*.py`) and JavaScript (`docs/assets/js/ats.js`, `ats-clock.js`).
- **Static site under `docs/`**: XSS, CSP bypasses, prototype pollution, dependency vulnerabilities affecting site-time JS (`marked`, `dompurify`, `pagefind`).
- **PWA service worker** (`docs/sw.js`) and PWA manifest (`docs/manifest.webmanifest`).
- **CI workflows** (`.github/workflows/*.yml`) — workflow injection, secret exfiltration, supply-chain integrity.
- **Conformance vectors** (`docs/spec/test-vectors-*.json`) — tampered vectors that would silently break implementer verification.
- **API endpoint** (`docs/api/now.json`) — integrity of the hourly cron snapshot.

---

## 6. Scope (out)

The following are **out of scope**:

- Vulnerabilities in third-party packages used at build time (`marked`, `dompurify`, `pagefind`, `convertdate`, `lunardate`) — report upstream first; we will track CVEs and bump pinned versions per §3.
- Self-XSS in browser DevTools (the user pasting a script into their own console is not a vulnerability).
- Vulnerabilities reachable only by an attacker who already has write access to the repository or to a maintainer's machine — this is a compromise scenario, not an ATS vulnerability.
- Social engineering, physical attacks, or attacks on third-party platforms (GitHub, Cloudflare).
- Outdated browser versions that do not enforce CSP — the spec **MUST NOT** be weakened to accommodate them.
- Theoretical concerns without a reproduction path.

---

## 7. Hall of fame

Reporters credited so far:

_(no security reports received yet — this section will be updated as advisories are resolved.)_

The editors of record **MUST** offer attribution to every accepted report unless the reporter requests otherwise (§2.4).

---

## 8. Project security posture

- The core reference implementations have **zero runtime dependencies**. Calendar bridges declare optional dependencies explicitly (`convertdate`, `lunardate`).
- Build-time and site-time dependencies are pinned and auditable in `scripts/package-lock.json` and `pyproject.toml`.
- The published site sets a strict CSP via `<meta http-equiv="Content-Security-Policy">` (`default-src 'self'`).
- `npm` and PyPI artefacts (`@s-geffroy/ats`, `ats-time`) **SHALL** be GPG-signed before v1.0 ships (`versioning.en.md §7.2 (4)`).
- The conformance vectors and `now.json` snapshots **MAY** be GPG-signed in a future release to detect tampering.

Reports of CSP bypasses, dependency-pinning gaps, or signing-policy weaknesses are welcome under §5.

---

## References

- [RFC 2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119.
- [RFC 8174] Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174.
- [CVSS] FIRST, "Common Vulnerability Scoring System v3.1", <https://www.first.org/cvss/v3-1/>.
- `GOVERNANCE.md` — editors of record, decision rule, accountability.
- `versioning.en.md §6` — RFC procedure (for spec-level security fixes).
- `versioning.en.md §7.2` — v1.0 requirements (including signed release artefacts).
- `manifesto.en.md §16` — standards process and governance overview.
