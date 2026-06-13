# ATS — Stability contract and versioning

**Status:** v0.6.0
**Normative reference:** `manifesto.en.md` (the spec)

---

## 1. SemVer scheme

ATS follows **[SemVer 2.0.0](https://semver.org/)** strictly, with a **reinforced** stability policy once v1.0 ships:

- **MAJOR** (`X.0.0`) — incompatible format change. **Forbidden post-v1.0** (cf. §3).
- **MINOR** (`0.X.0`) — backwards-compatible additions: new annexes, new agreement units, new calendar bridges.
- **PATCH** (`0.0.X`) — editorial fixes, additional vectors, clarifications.

## 2. `spec_version` field in vectors

All `docs/spec/test-vectors*.json` files carry a root-level field:

```json
{
  "spec_version": "0.6",
  "...": "..."
}
```

Consumers check this field to detect which spec the vector set was produced against. The value follows `MAJOR.MINOR` (no PATCH; patches never touch existing vectors).

## 3. Post-v1.0 commitments (frozen)

When v1.0 ships, **the following are frozen forever**:

1. **The epoch**: `1969-07-20T00:00:00Z` (start of the Apollo 11 landing day).
2. **The canonical format**: `T+ Δ K.H.D.Kin.fffff` — seven positions, ordering, separators, `T+/T-` sign window.
3. **The short format**: `Δ K.H.D.Kin/cc` — floor-truncation rules.
4. **Truncation**: strict `ROUND_FLOOR` (§6).
5. **The §11.4 algebra**: signatures `Δ + Δd → Δ`, `Δ − Δ → Δd`, `Δd ± Δd → Δd`, `Δd × n / Δd ÷ n → Δd`, `−Δd`, `|Δd|`, comparisons `< ≤ = ≥ >`.
6. **The binary §12 format**: 64 bits big-endian, two's complement on the day counter.
7. **The 12 core vectors**: `docs/spec/test-vectors.json`. None will be modified; only additions.

**Breaking any of these requires a new project (ATS 2) with a new, distinct epoch.** ATS 1.x will never become ATS 2.x.

## 4. Vector policy

- **Additive only.** A published vector is never removed or modified.
- A new vector set (e.g. a new calendar annex) ships its own JSON file with a `spec_version` matching the spec that introduces it.
- Consumers MAY (recommended: SHOULD) test against the full set; they MUST test against all vectors whose `spec_version` is ≤ the version they claim to support.

## 5. Non-normative annexes

**Non-normative annexes** (cf. `conventions.en.md` §0) are **explicitly exempt** from these commitments. They may be added, modified, or removed between minor versions. Their role is purely documentary.

## 6. Modification process (lightweight RFC)

1. Open a **GitHub Discussion** titled "RFC: <topic>" with a full proposal.
2. **Minimum 2 weeks** of public comment.
3. If consensus, a PR materializes the changes (manifesto + vectors as needed).
4. The PR is reviewed by the **BDFL** (cf. `GOVERNANCE.md`) who accepts or rejects with a written justification.
5. Once merged, the PR triggers a version bump in the next release.

**No RFC required for**: typo fixes, additional vectors, translations, non-normative annex additions, new calendar bridges (these are additive by construction).

## 7. v0.x → v1.0 migration

The v0.x → v1.0 transition will introduce **no format change** by construction — the entire v0.6 vector battery will validate against v1.0. The only differences:
- `spec_version` fields (already added in v0.6).
- Multi-planetary annex (§3.1 of the roadmap, in progress).
- At least one certified third-party implementation (Rust or Go).
- Published artifacts (npm, PyPI, signed GitHub Release).

## 8. Normative reference

In case of disagreement between this document and `manifesto.en.md` or the French translation (`versioning.fr.md`), **the English manifesto (`manifesto.en.md`) prevails**. This annex introduces no new mechanism; it codifies stability constraints only.
