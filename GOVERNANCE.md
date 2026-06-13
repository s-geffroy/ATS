# Governance

ATS is currently a **BDFL** project (Benevolent Dictator For Life) maintained by **Sylvain Geffroy** (`@s-geffroy` on GitHub).

This document describes how decisions are made until ATS is stable enough to evolve into a more formal governance (target: post-v1.0, contingent on adoption signals).

## Roles

### BDFL — Sylvain Geffroy

Final authority on:
- Spec changes (`docs/spec/manifesto.{en,fr}.md` and any normative annex).
- Reference implementations (`code/ats.py`, `docs/assets/js/ats.js`).
- Branding (the Δ symbol, the OG card, the site identity).
- Release timing and version numbers.

### Contributors

Anyone who opens an issue, PR, or RFC discussion. Contributions are welcome and accepted via the process below.

## Decision process

### Editorial changes (no RFC)

Typo fixes, translations, additional vectors that strictly conform to the existing spec, non-normative annex updates, calendar bridge additions, dependency bumps:

1. Open a PR with a clear description.
2. BDFL review with one of: ✅ merge, 🟡 request changes, 🔴 close with rationale.
3. Target turnaround: **7 days**.

### Spec changes (RFC required)

Any change to `manifesto.{en,fr}.md` (sections 1–15, excluding §14 list of annexes), to the canonical / short / binary formats, to the §11.4 algebra, to the rounding policy, or to the 12 core vectors:

1. **Open a GitHub Discussion** titled `RFC: <topic>` under the `RFCs` category. The post must include:
   - Problem statement
   - Proposed change (with concrete spec diff)
   - Alternatives considered
   - Migration impact on existing consumers
2. **Minimum 2 weeks** of public comment.
3. The BDFL summarizes the consensus and writes a decision: **accept**, **revise**, or **reject** with rationale.
4. If accepted, a PR implements the change and references the RFC.

**Post-v1.0**: spec freeze (see `docs/spec/versioning.en.md` §3) takes precedence. RFCs that would violate the freeze are automatically rejected — the only path is a new project, ATS 2.

### Implementation-specific changes

A reference implementation (Python or JS) may evolve independently as long as it preserves the conformance contract:

- Round-trip of all `test-vectors*.json` files at its `spec_version`.
- API compatibility within the same MAJOR version.
- Build dependencies remain auditable.

Other implementations (third-party) are free to follow their own governance, provided they pass the same conformance tests and clearly state which `spec_version` they target.

## Disagreement resolution

If a contributor disagrees with a BDFL decision:

1. Re-open the discussion with new arguments (data, comparable standards, real-world adoption signals).
2. If still unresolved after a second round, the change is final until either:
   - A new contributor brings new technical evidence, OR
   - The project transitions to a formal council (see "Evolution" below).

## Evolution

Once ATS reaches **at least one of**:

- 100 GitHub stars + 10 independent forks,
- A documented production deployment by an external organization,
- Inclusion in an ISO / IETF / W3C track,

the BDFL will propose a transition to a **steering committee** of 3–5 members (consensus-based, with the BDFL as initial chair for 1 release cycle). The transition itself follows an RFC.

## Contact

- **Issues / PRs / Discussions**: <https://github.com/s-geffroy/ATS>
- **Security**: see `SECURITY.md`
- **Direct**: `sylvain.geffroy@gmail.com`
