# RFC-NNNN: <Title in imperative — e.g. "Promote the multi-planetary annex from informative to normative">

> Replace `NNNN` with the next monotonic number from `README.md §2`. Do not reuse retired numbers.
> Replace every angle-bracketed placeholder below. Fields are required per `GOVERNANCE.md §4.1`.
> Delete this quoted block before filing.

## 1. Metadata

| Field | Value |
|---|---|
| **Number** | NNNN |
| **Title** | <Imperative-mood title> |
| **Filing date** | YYYY-MM-DD |
| **Decision date** | YYYY-MM-DD (or `pending` until terminal status reached) |
| **Status** | filed · accepted · revised · rejected |
| **Proposer** | `@github-handle` (or organisation + primary contact) |
| **Shepherd** | `@github-handle` (post-v1.0 only; pre-v1.0: `N/A — BDFL decides`) |
| **Spec sections affected** | e.g. `manifesto.en.md §11.4`, `versioning.en.md §7.2 (5)` |
| **Related RFCs** | RFC-NNNN, … (or `none`) |
| **Tracker** | <GitHub issue / PR URL where the public discussion lives> |

## 2. Summary

One paragraph: what the RFC proposes, why now, and the headline impact on conformance.

## 3. Motivation

Explain the problem the RFC solves. Cite the spec sections that motivate the change. State which `versioning.en.md §7.2` requirement (if any) is touched.

## 4. Detailed proposal

The technical content of the change. Include:

- The exact spec edits (sections, paragraphs, normative wording). Quote before/after where useful.
- New conformance vectors that **MUST** be added to `docs/spec/test-vectors-*.json`.
- New algorithms, with worked examples for at least one edge case.
- Any new file paths (e.g. `code/bridges/<name>.py`, `code/rust/ats-<feature>/`).

If the RFC touches the formats, the algebra, the rounding policy, or the 12 core vectors, it falls under `GOVERNANCE.md §3.2` (normative changes) and is mandatory.

## 5. Backward compatibility

State explicitly whether the change is:

- **Additive** (existing `spec_version` continues to validate) — preferred.
- **Breaking** (raises a new `spec_version`) — requires `versioning.en.md §3` analysis and, post-v1.0, the backward-compatibility veto of `GOVERNANCE.md §3.2 (3)`.

If breaking, include a migration note.

## 6. Alternatives considered

List the alternatives the proposer evaluated and explain why they were rejected. RFCs without an alternatives section tend to attract late objections.

## 7. Open questions

List the unresolved points. The shepherding editor (or BDFL pre-v1.0) is responsible for closing each before the decision is recorded.

## 8. Public comment thread

Link to the GitHub issue / PR / discussion thread. After the public comment period closes (`versioning.en.md §6.2`, ≥ 14 calendar days), copy the substantive objections and the proposer's responses here so the archive is self-contained even if the tracker disappears.

## 9. Decision

Record only after the period closes.

- **Status:** accepted · revised · rejected
- **Decided by:** `@github-handle` (BDFL pre-v1.0, shepherding editor post-v1.0)
- **Decision date:** YYYY-MM-DD
- **Rationale:** 1–3 paragraphs. Quote the technical objections that survived comment and explain why each is or is not sustained per `GOVERNANCE.md §3.2`.

## 10. Cross-references

- `manifesto.en.md §…`
- `versioning.en.md §…`
- `GOVERNANCE.md §…`
- `multi-planetary.en.md §…` (if relevant)
- `test-vectors-*.json` files added or amended.
