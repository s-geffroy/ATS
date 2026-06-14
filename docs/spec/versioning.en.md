# ATS — Versioning, stability, and process

**Status:** Pre-release v0.7
**Document type:** **NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the spec proper).
**Authoritative language:** English. French translation in `versioning.fr.md`; in case of divergence, this document controls.
**Core thesis:** This annex defines the stability contract that turns ATS from a personal project into a reliable standard. It specifies what changes between versions, what is frozen forever post-v1.0, how the RFC process works, and how implementations claim and maintain conformance over time.

---

## 0. Conventions

### 0.1 Requirement levels

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 [RFC 2119, RFC 8174] when, and only when, they appear in all capitals.

### 0.2 Glossary

- **Conformance vector** — A machine-readable test case in a JSON file used by implementations to verify bit-identical output.
- **Editor of record** — A human listed in `GOVERNANCE.md` with authority to merge normative changes to this specification.
- **Implementer** — A party producing a conformant implementation of ATS.
- **RFC** (in this annex) — A public request-for-comment document filed in the project's issue/PR tracker proposing a normative change. Not to be confused with IETF RFCs (the format here is lightweight, not IETF).
- **`spec_version` field** — A required root-level string in every conformance vector file identifying the spec revision that produced it.
- **SemVer** — Semantic Versioning 2.0.0 [SemVer 2.0.0].

### 0.3 Scope

This annex specifies:

- The version-number scheme (§1).
- The `spec_version` field used by consumers to detect spec drift (§2).
- The set of items frozen post-v1.0 (§3).
- The vector-additivity policy (§4).
- The role and treatment of non-normative annexes (§5).
- The RFC procedure for normative changes (§6).
- The migration plan from v0.x to v1.0 (§7).
- The formal backward-compatibility contract (§8).
- Anticipated objections to this contract (§9).

This annex does **not** specify governance (`GOVERNANCE.md`), implementation requirements (`manifesto.en.md §16.5`), or test-vector content (the `test-vectors-*.json` files themselves).

---

## 1. SemVer scheme

ATS uses **Semantic Versioning 2.0.0** [SemVer 2.0.0] with a reinforced post-v1.0 stability policy.

### 1.1 Version triple semantics

A version is a triple `MAJOR.MINOR.PATCH`. Each component carries a defined meaning:

| Component | Pre-v1.0 (current) | Post-v1.0 (committed) |
|---|---|---|
| **MAJOR** (`X.0.0`) | Breaking change to format, algebra, or binary encoding | **FORBIDDEN** — any change requiring a MAJOR bump triggers a new project (ATS 2) per §3.5 |
| **MINOR** (`0.X.0`) | Additive change: new annexes, new bodies, new bridges, new conformance vectors | Additive only — strictly backward-compatible |
| **PATCH** (`0.0.X`) | Editorial fixes, clarifications, additional vectors that test existing behaviour | Identical: editorial fixes only |

### 1.2 Current version policy (pre-v1.0)

In v0.x, breaking changes at MINOR boundaries are **PERMITTED**. Implementations **MUST** consult `CHANGELOG.md` between minor versions and follow the documented migration path. Every breaking change in v0.x **MUST** be recorded in `CHANGELOG.md` with the migration path stated explicitly.

The v0.6 → v0.7 transition is the most recent documented example: short-form syntax changed from `Δ K.H.D.Kin/cc` to `ΔK.H.D.Kin-BC.M`. The change was breaking; the migration was documented; implementations were updated.

### 1.3 Pre-release tags

Pre-release versions use SemVer build identifiers: `v1.0.0-rc1`, `v1.0.0-rc2`, etc. Implementations **MAY** advertise conformance to a pre-release version, but **SHOULD** treat such conformance as provisional until the corresponding stable version ships.

---

## 2. The `spec_version` field

### 2.1 Format

Every conformance vector file in `docs/spec/test-vectors*.json` **MUST** carry a root-level field:

```json
{
  "spec_version": "0.7",
  "...": "..."
}
```

The field value uses the syntax:

```abnf
spec_version = major "." minor
major        = 1*DIGIT
minor        = 1*DIGIT
```

PATCH **MUST NOT** appear in `spec_version`. Patches never modify existing vectors (cf. §4.1).

### 2.2 Producer obligations

A producer (the editor adding or modifying vectors) **MUST**:

- Set `spec_version` to the `MAJOR.MINOR` of the spec under which the vectors were produced.
- Update `spec_version` only when a MINOR bump introduces vectors that test new normative content.
- **NEVER** modify an existing vector under the same `spec_version`. Modification requires a new MINOR with a new `spec_version`.

### 2.3 Consumer obligations

A consumer (an implementer claiming conformance to a given version) **MUST**:

- Validate the `spec_version` field exists and parses.
- Reject vector files whose `spec_version` declares a MAJOR greater than the version claimed.
- Reject vector files whose MINOR exceeds the version claimed (such vectors test content not yet in the claimed spec).
- Test against every vector whose `spec_version` is **≤** the claimed conformance version.

### 2.4 Multiple files

A repository **MAY** contain multiple vector files (`test-vectors.json`, `test-vectors-arithmetic.json`, `test-vectors-multi-planetary-mars.json`, etc.). Each file carries its own `spec_version`. A consumer **MUST** evaluate each file independently against its own `spec_version` field.

---

## 3. Post-v1.0 commitments (frozen)

The following items become **frozen** when ATS v1.0 ships. Modifying any of them post-v1.0 is FORBIDDEN at MINOR boundaries; modification requires a new project as defined in §3.5.

### 3.1 The epoch

The Earth ATS epoch is `1969-07-20T00:00:00Z`. Post-v1.0, this value **MUST NOT** change. Other bodies have their own epochs frozen separately (cf. `multi-planetary.en.md §7`).

### 3.2 The canonical format

The canonical format `T± Δ K.H.D.Kin.fffff` is frozen as specified in `manifesto.en.md §4.1` (ABNF grammar). Post-v1.0:

- The positional order **MUST NOT** change.
- The separators (`.`) **MUST NOT** change.
- The direction marker (`T+` / `T-`) **MUST NOT** be omitted.
- The default 5-digit fraction **MUST NOT** change as the default; extended precision (e.g., 9 digits) remains optional per `manifesto.en.md §4.4`.

### 3.3 The short format

The short format `ΔK.H.D.Kin-BC.M` is frozen as specified in `manifesto.en.md §5.1`. The legacy `Δ K.H.D.Kin/cc` form (pre-v0.7) **MUST NOT** be re-introduced; its rejection at the parser is a post-v1.0 invariant.

### 3.4 Truncation policy

The strict floor-truncation rule (`ROUND_FLOOR`) defined in `manifesto.en.md §6` is frozen. Implementations **MUST NOT** introduce alternative rounding modes (half-up, half-even, round-to-zero) for canonical output.

### 3.5 The §11.4 algebra

The duration algebra defined in `manifesto.en.md §11.4` is frozen. Specifically:

- The seven typed operations (`Δ+Δd→Δ`, `Δd+Δ→Δ`, `Δ−Δd→Δ`, `Δ−Δ→Δd`, `Δd+Δd→Δd`, `Δd−Δd→Δd`, `Δd×n→Δd`, `Δd÷n→Δd`) **MUST NOT** change signature.
- Comparisons (`< ≤ = ≥ >`) **MUST** raise a type error on mixed `Δ × Δd` operands.
- Overflow semantics (Kilo unbounded; lower digits floor-truncated) **MUST NOT** change.
- Additional operations **MAY** be added in MINOR releases provided they do not modify existing signatures.

### 3.6 The binary format

The 64-bit binary layout defined in `manifesto.en.md §12` is frozen:

- 40 high bits, signed (two's complement), big-endian: day count.
- 24 low bits, unsigned, big-endian: fraction of day, scaled to 2²⁴.

Alternative layouts (biased offset, little-endian, 96-bit precision) **MAY** be introduced as additional formats with distinct names; they **MUST NOT** replace the 64-bit canonical form.

### 3.7 The core conformance vectors

`docs/spec/test-vectors.json` contains 12 vectors at v0.7. Post-v1.0:

- These 12 vectors **MUST NOT** be modified.
- Additional vectors **MAY** be added in MINOR releases.
- Removal of any vector is **FORBIDDEN** (additive policy, cf. §4).

### 3.8 The new-project escape hatch

If ATS ever requires breaking changes to the items in §§3.1–3.7, the editors **MUST** ship a new project named `ATS 2` (or higher) with:

- A new, distinct epoch (so values from ATS 1.x and ATS 2.x are not confusable).
- A new project name in `pyproject.toml`, `package.json`, etc.
- A new GitHub repository, or a clearly separated branch/directory.
- A new conformance vector suite.

ATS 1.x and ATS 2.x are **distinct standards**. Implementations **MUST NOT** claim conformance to "ATS" in the unqualified sense; they **MUST** specify the version.

---

## 4. Vector policy

### 4.1 Additive only

A published conformance vector **MUST NOT** be removed or modified after publication under a given `spec_version`. The set of vectors at version `vX.Y` **MUST** be a subset of the set at any later version `vX.Z` where `Z ≥ Y`.

If a published vector is discovered to be wrong (e.g., a calculation error), the correction process is:

1. Open an RFC documenting the error (§6).
2. If the spec was correct and the vector was wrong, deprecate the vector by **adding** a new corrected vector with a clear label (`label: "Corrected from <old vector id>"`).
3. The wrong vector remains in the file with a `deprecated: true` flag and a reason field, so consumers running the old test suite see the deprecation.

This procedure preserves the additive-only invariant while permitting error correction without modification.

### 4.2 Test obligations for implementers

A consumer claiming conformance to version `vX.Y` **MUST**:

- Pass every non-deprecated vector with `spec_version ≤ vX.Y`.
- Document in its release notes which vectors it skipped (e.g., extended-precision vectors if the implementation supports only 5 digits).

Implementations **SHOULD** publish their conformance-test report (the output of running the vector suite) so users can verify conformance independently. The reference CI workflow `tests/test_vectors.py` and `tests/test_vectors.mjs` produces such a report.

### 4.3 New vector sets

A new vector set (e.g., `test-vectors-multi-planetary-venus.json`) ships with:

- Its own `spec_version` field, matching the MAJOR.MINOR of the spec that introduces the body.
- A minimum of 5 vectors covering the body's epoch, mid-life round numbers, fractional edge cases, and a date in the next century.
- A `label` field on each vector for human-readable context.

---

## 5. Non-normative annexes

The following annexes are **explicitly non-normative**:

- `philosophy.en.md`
- `comparison.en.md`
- `conventions.en.md`
- `analog-clock.en.md`

These annexes:

- **MAY** be added, modified, or removed between MINOR versions.
- **DO NOT** carry conformance vectors that gate implementation conformance.
- **DO NOT** participate in the §3 post-v1.0 freezes.
- **MAY** reference normative content but **MUST NOT** redefine it.

A reader of the spec who skips every non-normative annex still has a complete normative specification (`manifesto.en.md` + `versioning.en.md` + `multi-planetary.en.md`).

---

## 6. RFC procedure

Any normative change to this specification (including this annex itself) **MUST** follow the procedure below.

### 6.1 Filing an RFC

The proposer **MUST**:

1. Open a public document in the project's tracker (GitHub Issue or PR) titled `RFC: <topic>`.
2. The document **MUST** contain:
   - **Summary**: one paragraph describing the change.
   - **Motivation**: why the change is needed.
   - **Specification**: the proposed normative text.
   - **Migration**: how existing implementations are affected and what they MUST do.
   - **Backward compatibility analysis**: whether the change is additive (MINOR) or breaking (forbidden post-v1.0).
   - **Conformance vector impact**: which vectors are added, which are deprecated.

### 6.2 Public comment period

The RFC **MUST** remain open for public comment for a **minimum of 14 calendar days** from filing. During this period:

- The proposer **MAY** revise the RFC in response to comments.
- The editors of record **MUST NOT** merge the change before the period expires.
- If a substantive revision is made (i.e., the normative text changes), the 14-day clock **RESETS** from the revision date.

### 6.3 Decision

After the comment period:

- The editors of record record a decision: **ACCEPT**, **MODIFY**, or **REJECT**.
- The decision **MUST** include a written justification.
- Acceptance requires **rough consensus** among editors of record (no editor objects on backward-compatibility or scope grounds).
- A single editor MAY veto on **backward-compatibility** grounds only; substantive disagreement on design merit is resolved by majority.

### 6.4 Merge and version bump

If accepted, the RFC is merged with:

- Updates to the affected spec files (`manifesto.en.md`, this annex, etc.).
- Updates to `CHANGELOG.md`.
- Bump of the version in `pyproject.toml`, `package.json`, all HTML footers.
- A new conformance vector file (if applicable) or additions to existing files.

The merge triggers the next release. Versioning follows §1.

### 6.5 Changes not requiring an RFC

The following changes **MAY** be made by editors without an RFC:

- Typo and formatting fixes that do not change semantics.
- Translation updates (preserving the authoritative English version).
- Non-normative annex additions or revisions (cf. §5).
- New calendar bridges (`code/bridges/*.py`) — additive by construction.
- New conformance vectors at the current `spec_version` (testing existing behaviour).
- Editorial restructuring of section numbering with redirects so existing references still resolve.

### 6.6 RFC archive

Every RFC, accepted or rejected, **MUST** be archived under `docs/spec/rfcs/`. The archive **MUST** include:

- The original proposal text.
- The full comment thread (or a link if the tracker stores it).
- The editors' decision and justification.

This makes the decision history auditable.

---

## 7. v0.x → v1.0 migration

### 7.1 Stability invariant

The v0.x → v1.0 transition **MUST NOT** introduce a format change. The full v0.7 vector battery **MUST** validate against v1.0 bit-for-bit.

### 7.2 Requirements for v1.0

ATS v1.0 ships when **all** the following are true:

1. `spec_version` field present on all conformance vectors. (DONE in v0.6.)
2. Multi-planetary annex normative. (DONE in v0.7.)
3. At least one third-party reference implementation (Rust or Go) passing 100 % of the conformance vectors.
4. Published artefacts: `npm publish @s-geffroy/ats`, `twine upload ats-time`, signed GitHub Release with GPG.
5. RFC archive in `docs/spec/rfcs/` with at least one decided RFC.
6. `GOVERNANCE.md` in the repository naming the editors of record.
7. Lighthouse CI workflow producing scores ≥ 90 on the 4 standard categories for 4 reference pages. (DONE in v0.7.)

When all seven hold, the editors of record may tag v1.0 by following §6.4.

### 7.3 Post-v1.0 evolution

Between v1.0 and v1.x, the spec evolves additively per §1. Examples of permitted v1.x changes:

- A new celestial body in `multi-planetary.md` with new vectors.
- A new operation in §11.4 (e.g., `Δd modulo n`) provided it does not modify existing signatures.
- New non-normative annexes.
- New conformance vector files for additional precision (e.g., 9-digit fraction tests).

Examples of v1.x changes that are FORBIDDEN (require ATS 2.x):

- Changing the epoch.
- Renaming a positional unit.
- Modifying the binary layout.
- Removing any post-v1.0 frozen item (§3).

---

## 8. Backward and forward compatibility contract

### 8.1 Definitions

- **Backward compatible**: A change to the spec is backward compatible if every implementation conformant to the previous version remains conformant to the new version.
- **Forward compatible**: A consumer claiming conformance to version `vX.Y` is forward compatible with vector files declaring `spec_version > vX.Y` if it skips unknown vectors rather than failing.

### 8.2 Implementation obligations

An implementation **MUST**:

- Accept conformance vector files with `spec_version` equal to or less than its claimed conformance version.
- Reject files with greater `spec_version` (forward compatibility is NOT REQUIRED but RECOMMENDED for tooling).
- Document in its release notes the exact version claimed.

An implementation **SHOULD**:

- Support forward compatibility by skipping unknown vectors with a warning.
- Refresh its conformance run on each new vector file release.

### 8.3 Deprecation policy

When a feature is intended for removal in a future MAJOR release (i.e., in ATS 2.x):

- The feature **MUST** be marked deprecated in the version where the intent is decided.
- The deprecation marker **MUST** be visible in the spec text (e.g., `> **DEPRECATED in v1.5.0**, scheduled for removal in ATS 2.0`).
- Implementations **MAY** emit deprecation warnings to users.
- The feature **MUST** continue to function correctly until the MAJOR boundary (which, per §3.8, is a new project).

In practice, this means **nothing is removed during ATS 1.x**. Deprecation marks intent to drop in ATS 2.x.

---

## 9. Anticipated objections

### 9.1 "Post-v1.0 stability commitments are unenforceable. What stops you from breaking them?"

The commitments are enforced by **migration cost**: any implementation that has passed the conformance vectors at v1.0 is broken by a violation. The cost of breaking the contract is visible — to users, to other implementers, to anyone running the conformance suite. The editors of record are accountable to that cost. Standards are not enforced by legal sanctions in any case; they are enforced by the cost of non-conformance. §3.8 (new project required) is the formal escape hatch: if a breaking change is genuinely needed, the editors split the project rather than betray the contract.

### 9.2 "The BDFL / editor-of-record model is a single point of failure."

Pre-v1.0, the project has a single editor of record. Post-v1.0, §6.3 requires rough consensus among **at least three editors of record** listed in `GOVERNANCE.md`. The editor pool is open to recognised conformant implementers (per `manifesto.en.md §16.4`). If the project loses all editors (death, retirement, abandonment), the conformance vectors remain stable forever; an implementation continues to validate even if the spec is no longer maintained. The cost of an abandoned spec is reduced novelty, not broken implementations.

### 9.3 "The 14-day RFC period is too short for international standards."

IETF RFCs typically run multi-month last-call periods; ISO standards run multi-year cycles. ATS's 14-day minimum reflects its current scale (a single editor, a single repository). When ATS approaches IETF / ISO scope (i.e., when §7.2 item 3 is met by multiple implementations and §7.2 item 4 publishes via standards bodies), the RFC period **WILL** be re-evaluated. The 14-day minimum is sufficient for the current cohort of contributors; the floor MAY be raised in future revisions.

### 9.4 "The additive-vector policy prevents fixing errors."

§4.1 addresses this: errors are corrected by **adding** a corrected vector and **marking** the original deprecated. The wrong vector remains in the file (a) so consumers running the old test suite see the deprecation, (b) so the historical record of which behaviour the spec required at v(X) is preserved, and (c) so the additive invariant holds. The cost is verbosity in the vector file; the benefit is auditability.

### 9.5 "The `spec_version` field has no schema validation."

Implementations are free to validate the field with JSON Schema or any other mechanism. The spec itself does not mandate a schema because tooling diversity is a feature (Python implementations, JavaScript, Rust, etc., each use the validator their ecosystem prefers). A reference JSON Schema **MAY** be added in a future MINOR if implementations request one (the request is itself an RFC).

### 9.6 "Why not adopt IETF or W3C process directly?"

ATS is currently a publicly-developed specification, not a recognised international standard (per `manifesto.en.md §16.3`). The §6 RFC procedure is lightweight enough to make progress at the project's current scale; the IETF / W3C processes are designed for working groups of many organisations. The editors INTEND to submit ATS to IETF or W3C **after** v1.0 ships (per `manifesto.en.md §16.3`), at which point the heavier process takes over.

### 9.7 "Implementations might lie about their conformance version."

Conformance is verifiable: the test-vector suite produces a deterministic result. A consumer can run the implementation against the vectors and verify the claim independently. The spec does not police claims; the marketplace does.

### 9.8 "The 7 requirements for v1.0 in §7.2 are arbitrary."

Each requirement targets a specific failure mode:

- (1) `spec_version` field — prevents silent spec drift.
- (2) Multi-planetary annex — fulfils the "designed for multi-planetary" claim in `manifesto.en.md §1`.
- (3) Third-party implementation — prevents single-implementer bias (Python + JS share too much DNA).
- (4) Published artefacts — makes the spec installable, not just downloadable.
- (5) RFC archive — proves the process exists.
- (6) `GOVERNANCE.md` — names accountable parties.
- (7) Lighthouse CI — proves the spec ships as a deployable site, not just a Markdown file.

The list **MAY** be revised by RFC if requirements prove inadequate or excessive in practice.

---

## 10. Normative reference precedence

In case of disagreement between this annex and the manifesto, **`manifesto.en.md` prevails**. In case of disagreement between the English version of this annex and the French translation (`versioning.fr.md`), **the English version prevails**. This annex introduces no new mechanism beyond the manifesto; it codifies stability and process constraints only.

---

## References

- **RFC 2119** — Bradner, S. *Key words for use in RFCs to Indicate Requirement Levels*. IETF (1997).
- **RFC 5234** — Crocker, D., & Overell, P. *Augmented BNF for Syntax Specifications: ABNF*. IETF (2008).
- **RFC 8174** — Leiba, B. *Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words*. IETF (2017).
- **BCP 14** — RFC 2119 + RFC 8174 (requirement levels).
- **SemVer 2.0.0** — Preston-Werner, T. *Semantic Versioning 2.0.0*. https://semver.org/spec/v2.0.0.html.
- **`manifesto.en.md`** — The ATS specification (normative reference).
- **`multi-planetary.en.md`** — Multi-planetary normative annex.
- **`GOVERNANCE.md`** — Project governance and editor list.

All claims in this annex are either derived from the cited sources or are policy decisions of the editors of record. Readers identifying inconsistencies, weak rationale, or missing scenarios are invited to open an RFC per §6.
