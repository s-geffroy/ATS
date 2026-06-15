# ATS — RFC Archive

**Status:** Pre-release v0.7
**Authoritative language:** English. Each RFC is filed in EN; a FR translation MAY be added.
**Normative anchor:** `versioning.en.md §6` (procedure) · `GOVERNANCE.md §4` (required fields).

This directory is the auditable record of every Request-For-Comment filed against the ATS specification. It exists to satisfy `versioning.en.md §7.2 (5)`: *at least one decided RFC archived under `docs/spec/rfcs/`* is a hard pre-condition for tagging v1.0.0.

## 1. Conventions

### 1.1 Numbering

RFCs are numbered monotonically starting at `0001`. Numbers are assigned at filing time and **MUST NOT** be reused, even if the RFC is later withdrawn (per `GOVERNANCE.md §4.2`). The file name follows the pattern `<NNNN>-<kebab-case-title>.md`.

### 1.2 Status lifecycle

| Status | Meaning |
|---|---|
| **filed** | The proposal text is in the repository and the public comment period (≥ 14 days, `versioning.en.md §6.2`) is open or has just closed. |
| **accepted** | The proposal was merged with the rationale that no editor maintained a sustained technical objection. The spec sections listed in the cross-refs have been (or will be) updated in the same release. |
| **revised** | Consensus was not reached within 30 days; the proposer reworked the text. A revised RFC keeps its number. |
| **rejected** | The proposal was decided against; the rationale is archived alongside the proposal text. |

Per `GOVERNANCE.md §4.3`, the v1.0 acceptance criterion is **any** terminal status (accepted, revised, rejected) — the goal is to exercise the process, not to force a particular outcome.

### 1.3 Required fields

Every RFC file **MUST** include the 7 fields enumerated in `GOVERNANCE.md §4.1`:

1. RFC number and title.
2. Filing date and decision date.
3. Proposing party.
4. Shepherding editor (post-v1.0; `N/A` pre-v1.0 because the BDFL decides).
5. Technical content of the proposal.
6. Decision (accept / revise / reject) with rationale.
7. Cross-references to the spec sections modified.

The template at `0000-template.md` enforces this skeleton.

### 1.4 What does NOT require an RFC

Per `versioning.en.md §6.5` and `GOVERNANCE.md §3.1`, the following changes can be merged by any editor of record without filing an RFC:

- Typo / formatting / broken-link fixes.
- Translations preserving normative meaning.
- Additional conformance vectors at the current `spec_version`.
- Calendar bridge additions (`code/bridges/*.py`).
- Dependency bumps that pass CI.
- Non-normative annex updates.

If in doubt, file an RFC.

---

## 2. Index

| # | Title | Status | Filing date | Decision date |
|---|---|---|---|---|
| [0001](./0001-multi-planetary-normative.md) | Promote the multi-planetary annex from informative to normative | **accepted** | 2026-06-13 | 2026-06-13 |

---

## 3. Filing a new RFC

1. Copy `0000-template.md` to `<NNNN>-<kebab-case-title>.md`, where `<NNNN>` is the next available number (see §2).
2. Fill every field in the template. Sections marked **REQUIRED** must be present even if empty (use `N/A` and explain).
3. Open a GitHub PR titled `RFC-<NNNN>: <title>` and link the discussion thread or issue.
4. Wait **at least 14 calendar days** (`versioning.en.md §6.2`) before requesting a decision.
5. Update §2 of this index with the assigned number, title, and status; refresh the decision date once the editors close the RFC.

Pre-v1.0 the BDFL (`GOVERNANCE.md §1.1`) records the decision and rationale directly in the RFC file. Post-v1.0 the shepherding editor records the rough-consensus summary per `GOVERNANCE.md §3.2`.

---

## 4. See also

- `versioning.en.md §6` — RFC procedure (normative).
- `versioning.en.md §7.2 (5)` — RFC archive as v1.0 acceptance criterion.
- `GOVERNANCE.md §4` — required fields for archived RFCs.
- `GOVERNANCE.md §3` — pre-v1.0 vs post-v1.0 decision rules.
- `manifesto.en.md §16.5` — conformance contract that normative changes must preserve.
