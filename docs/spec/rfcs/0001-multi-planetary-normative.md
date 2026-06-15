# RFC-0001: Promote the multi-planetary annex from informative to normative

## 1. Metadata

| Field | Value |
|---|---|
| **Number** | 0001 |
| **Title** | Promote the multi-planetary annex from informative to normative |
| **Filing date** | 2026-06-13 |
| **Decision date** | 2026-06-13 |
| **Status** | **accepted** |
| **Proposer** | `@s-geffroy` (BDFL pre-v1.0) |
| **Shepherd** | `N/A — BDFL decides (pre-v1.0)` |
| **Spec sections affected** | `manifesto.en.md §14` (list of annexes), `multi-planetary.{en,fr}.md` (entire document promoted), `versioning.en.md §7.2 (2)` |
| **Related RFCs** | none |
| **Tracker** | filed at the v0.7.0 release window; no separate issue (RFC archive bootstrap, see §4.3 below) |

## 2. Summary

This RFC records the promotion of `multi-planetary.{en,fr}.md` from a non-normative annex to a **normative** annex, with the introduction of three first-class celestial-body singletons (`EARTH`, `MARS`, `MOON`) and two new conformance-vector files (`test-vectors-multi-planetary-{mars,moon}.json`). The change shipped in v0.7.0 (commit window 2026-06-13) and is recorded here retroactively so the RFC archive can satisfy `versioning.en.md §7.2 (5)` with a real, decided proposal rather than a fabricated one.

## 3. Motivation

`versioning.en.md §7.2` enumerates the seven hard requirements for tagging v1.0.0. Two were addressed by the v0.7.0 release window:

- **(2) Multi-planetary annex normative.** Until v0.7 the annex existed but carried `Informative` in its frontmatter; conformance was not required. The ATS thesis — *« a universal time counter anchored on a verifiable astronomical instant »* — collapses if the spec cannot frame the same counter across the only inhabited environments any near-term implementer might target (Earth, Mars, Moon). Without normative status the multi-planetary annex was an aspirational document, not a contract.
- **(5) RFC archive with ≥ 1 decided RFC.** No archive existed; the BDFL was making normative decisions without writing them down. `GOVERNANCE.md §4.3` allows the first-archived RFC to be accepted, revised, or rejected — the goal is to *« exercise the process »*. Retroactively documenting a real decision that has already been executed is the most honest application of that clause.

This RFC closes both requirements at once.

## 4. Detailed proposal

### 4.1 Annex status change

`multi-planetary.{en,fr}.md` frontmatter promoted from:

```
Type: Annex — non-normative
```

to:

```
Type: Annex — normative
Authoritative language: English
```

The body adds:

- A normative §2 defining the `CelestialBody` contract: `epoch_utc_ms` (anchor) + `day_seconds` (length of one body-local Δ-day). Both fields are immutable per body.
- A normative §3 with the three blessed bodies and their constants:
  - `EARTH` — epoch `1969-07-20T00:00:00Z`, `day_seconds = 86_400`. Compatibility shim: a bare `Δ` with no body prefix **MUST** resolve to `EARTH` (preserves v0.6 vectors).
  - `MARS` — epoch `1976-07-20T11:53:00Z` (Viking 1 touchdown), `day_seconds = 88_775.244` (mean sol, ≈ 24 h 39 min).
  - `MOON` — epoch `1969-07-20T20:17:40Z` (Apollo 11 LM touchdown), `day_seconds = 86_400` (selenographic mean solar day kept POSIX-compatible).
- A normative §4 forbidding cross-body arithmetic: `Δ_mars + Δd_earth` **MUST** raise (Python `TypeError`, equivalent in other implementations).
- A normative §5 reserving the syntax `body:Δ K.H.D.Kin.fffff` for explicit body annotation; the bare form remains EARTH for backward compatibility.

### 4.2 New conformance vector files

Two JSON files added under `docs/spec/`, each with `"spec_version": "0.7"` and ten vectors:

- `test-vectors-multi-planetary-mars.json` — round-trips around the Viking 1 epoch, mid-mission Curiosity sol, and JD 2451545.0 (TT) as a cross-cal anchor.
- `test-vectors-multi-planetary-moon.json` — round-trips at Apollo 11 LM touchdown (`0.0.0.0.00000` for the `MOON` body), Apollo 17 EVA, and a near-future Artemis III nominal landing window.

These vectors are bit-identical contracts: any implementation declaring `spec_version ≥ 0.7` **MUST** reproduce the canonical string byte-for-byte.

### 4.3 Implementation parity

Reference implementations updated in lock-step:

- Python: `code/ats_multi_planetary.py` (singletons + helpers + cross-body guards).
- JavaScript: `docs/assets/js/ats.js` ported the same singletons and registry (`bodyCanonicalToUtcMs`), with `TypeError` on cross-body arithmetic. Verified by `tests/test_multi_planetary.mjs`.
- Conformance vectors loaded by `tests/test_multi_planetary.py` and `tests/test_multi_planetary.mjs`.

### 4.4 RFC archive bootstrap (procedural caveat)

The §6 procedure of `versioning.en.md` describes a 14-day public comment period before a decision. This RFC is recorded retroactively, which means the period was not run *as an explicit RFC*; instead, the discussion happened on the v0.7.0 work itself (commits to `multi-planetary.{en,fr}.md`, review of the JSON vector files, PR review of the parity changes in JS). The BDFL acknowledges this irregularity and notes:

- The substantive technical content was public throughout the v0.7 window.
- No editor or contributor raised a sustained objection to the normative promotion at any point.
- Pre-v1.0, the BDFL has the authority to decide normative changes per `GOVERNANCE.md §3.2`; the irregularity is procedural, not substantive.

Future RFCs **MUST** follow the §6 procedure prospectively. This bootstrap exception is non-precedential and is documented openly here.

## 5. Backward compatibility

**Additive.** The promotion does not change the semantics of EARTH-anchored vectors. The bare-Δ compatibility shim (§4.1) ensures every v0.6 vector continues to validate against v0.7. No `spec_version` migration is required for consumers that do not adopt multi-body syntax; consumers that adopt it declare `spec_version ≥ 0.7` per `versioning.en.md §2.3`.

## 6. Alternatives considered

1. **Keep the annex informative.** Rejected: the v1.0 thesis requires a universal counter, which is incompatible with leaving the only multi-environment frame as aspirational.
2. **Promote only `MARS`, defer `MOON` to v0.8.** Rejected: MOON is needed for the Apollo 11 LM-touchdown alignment that the manifesto already cites (`manifesto.en.md §2`); omitting it would have created an internal inconsistency.
3. **Split the annex into two normative documents** (`mars.md`, `moon.md`). Rejected: bodies share the `CelestialBody` contract; a single annex makes the contract more discoverable.
4. **Use `Δ_mars` / `Δ_moon` as primary syntax** instead of `body:Δ`. Rejected: `_` collides with the existing canonical `T+ Δ K.H.D.Kin.fffff` separator visually; colon prefix reads as a typed namespace.

## 7. Open questions

None at decision time. The future addition of further bodies (e.g. Europa, Titan, Ceres) will require additional RFCs adding entries to `multi-planetary.{en,fr}.md §3` and a vector file per body. Those are **additive** per §5 above.

## 8. Public comment thread

No dedicated tracker thread (see §4.4). The substantive review happened on:

- v0.7.0 commits to `docs/spec/multi-planetary.{en,fr}.md` (status change).
- Review of `code/ats_multi_planetary.py` for `EARTH/MARS/MOON` constants.
- Review of `docs/assets/js/ats.js` JS parity port.
- Review of the two new `test-vectors-multi-planetary-{mars,moon}.json` files.

No objection was raised. The CHANGELOG entry for v0.7.0 covers the user-visible scope.

## 9. Decision

- **Status:** **accepted**
- **Decided by:** `@s-geffroy` (BDFL pre-v1.0, `GOVERNANCE.md §1.1`)
- **Decision date:** 2026-06-13
- **Rationale:**
  1. The normative promotion is the minimum coherent ATS contract for any environment beyond Earth-UTC. The §1.1 manifesto thesis (*« universal counter, not Earth time »*) is internally inconsistent without it.
  2. The two new vector files are bit-stable and pass on both the Python and JavaScript reference implementations as of v0.7.0; any third-party implementation (Rust per RFC-NNNN to come, Go optional) targeting `spec_version 0.7` can verify conformance without ambiguity.
  3. The backward-compatibility shim of §4.1 (bare-Δ → EARTH) means every v0.6 vector continues to validate. No consumer is broken.
  4. Recording this RFC retroactively is acknowledged as a procedural irregularity (§4.4) but does not change the substantive outcome. Future RFCs **MUST** follow `versioning.en.md §6` prospectively.

This decision simultaneously closes:

- `versioning.en.md §7.2 (2)` — multi-planetary annex normative.
- `versioning.en.md §7.2 (5)` — RFC archive contains at least one decided RFC.

## 10. Cross-references

- `manifesto.en.md §14` — annex list updated to mark multi-planetary as normative.
- `multi-planetary.en.md` — entire document, all sections.
- `multi-planetary.fr.md` — symmetric translation, normative status mirrored.
- `versioning.en.md §7.2 (2)` and `§7.2 (5)` — both closed by this RFC.
- `GOVERNANCE.md §3.2` — pre-v1.0 BDFL decision rule applied here.
- `GOVERNANCE.md §4.3` — v1.0 acceptance criterion explicitly invoked.
- `docs/spec/test-vectors-multi-planetary-mars.json` — added.
- `docs/spec/test-vectors-multi-planetary-moon.json` — added.
- `code/ats_multi_planetary.py` — Python reference impl.
- `docs/assets/js/ats.js` — JS reference impl parity port.
- `tests/test_multi_planetary.{py,mjs}` — conformance runners.
- `CHANGELOG.md` — v0.7.0 entry.
