# ATS — Governance

**Status:** Pre-release v0.7
**Document type:** **NORMATIVE PROCESS DOCUMENT** for the ATS project.
**Authoritative language:** English. A French translation MAY be added later; in case of divergence, this document controls.
**Core thesis:** ATS is a specification, not a single implementation. This document names the editors of record, defines their authority, and describes how editorial control transitions from a single founder to a steering committee post-v1.0. It closes `versioning.en.md §7.2 (6)`.

---

## 0. Conventions

### 0.1 Requirement levels

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 [RFC 2119, RFC 8174] when, and only when, they appear in all capitals.

### 0.2 Glossary

- **Editor of record** — A human listed in §1 with authority to merge normative changes to the specification.
- **Implementer** — A party publishing an implementation of ATS that claims conformance against one or more `spec_version` values.
- **Contributor** — Anyone opening an issue, pull request, RFC discussion, or translation. No specific status is required.
- **RFC** (in ATS) — A public request-for-comment as defined in `versioning.en.md §6`. The ATS RFC process is lightweight; it is **NOT** an IETF RFC.
- **BDFL** — Benevolent Dictator For Life, the editor model used **only** pre-v1.0 (see §2).
- **Steering committee** — The 3-or-more-editor body that replaces the BDFL post-v1.0 (see §2).

### 0.3 Scope

This document specifies:

- Editors of record and their authority (§1).
- The pre-v1.0 single-editor model and the post-v1.0 multi-editor transition (§2).
- The decision rule for normative changes (§3).
- The RFC archive (§4).
- Implementer nomination for editor seats (§5).
- Conflict-of-interest disclosure (§6).
- Editor accountability and removal (§7).
- Trademark and licensing posture (§8).
- Anticipated objections (§9).

This document does **not** specify the RFC procedure itself (see `versioning.en.md §6`), security reporting (see `SECURITY.md`), or implementation requirements (see `manifesto.en.md §16.5`).

---

## 1. Editors of record

### 1.1 Current editors (v0.7)

| Editor | GitHub | Role | Since |
|---|---|---|---|
| Sylvain Geffroy | [`@s-geffroy`](https://github.com/s-geffroy) | BDFL (sole editor pre-v1.0) | 2024 |

### 1.2 Authority of an editor

An editor of record **MAY**:

- Merge editorial pull requests per §3.1.
- Decide RFCs per `versioning.en.md §6.3` after the public comment period closes.
- Cut a release and assign a SemVer tag per `versioning.en.md §1`.
- Sign GitHub Releases (`git tag -s`) on behalf of the project.
- Update non-normative annexes without an RFC.

An editor of record **MUST NOT**:

- Merge a change that violates the post-v1.0 freeze (`versioning.en.md §3`) on the v1.x branch. The only path is ATS 2.x.
- Bypass the §3.2 decision rule when more than one editor exists.
- Withhold a rejection rationale from a contributor whose RFC is declined.

### 1.3 Accountability

Editors **MUST** disclose conflicts of interest per §6. Editors that violate §1.2 or §6 are subject to removal per §7.

---

## 2. Pre-v1.0 and post-v1.0 models

### 2.1 Pre-v1.0 — single editor (BDFL)

Until ATS tags v1.0.0, the project operates with a single editor (currently Sylvain Geffroy, §1.1). The BDFL **MUST**:

- Apply the RFC procedure of `versioning.en.md §6` for normative changes.
- Document every accepted, revised, or rejected RFC in the archive (§4).
- Update this document within one release cycle of any change to editor identity, role, or process.

### 2.2 Post-v1.0 — steering committee (minimum 3 editors)

Once v1.0.0 ships, the BDFL model **SHALL** be replaced by a steering committee of **at least 3 editors**, of which **at most 1** may be employed by, contracted to, or otherwise materially affiliated with the same legal entity. The committee includes the founding BDFL by default for one release cycle, after which the seat is subject to the same rotation rules as any other (§5).

### 2.3 Transition trigger

The transition from §2.1 to §2.2 **MUST** happen as part of the v1.0.0 release process. The transition itself **MUST** be filed as an RFC per `versioning.en.md §6` and **MUST** name at least 2 additional editors meeting the §5 criteria before the release is tagged.

### 2.4 Reverting to a smaller committee

If the steering committee falls below 3 editors due to resignation, removal, or unavailability, the remaining editors **MUST** publish a notice on the repository within 30 days, **MUST NOT** merge any normative change (per §3.2) until 3 editors are seated again, and **SHOULD** nominate replacements per §5.

---

## 3. Decision rule

### 3.1 Editorial changes (no RFC)

The following changes do **NOT** require an RFC and **MAY** be merged by any editor of record after standard PR review:

- Typo fixes, broken-link repairs, formatting cleanups.
- Translations (French, or future languages) that do not alter normative meaning.
- Additional conformance vectors that strictly conform to the existing spec (per `versioning.en.md §4.1`).
- Calendar bridge additions (new files in `code/bridges/`).
- Dependency bumps that pass CI.
- Non-normative annex updates that do not introduce new normative claims.

Target turnaround: **7 days** from open to merge or rationale.

### 3.2 Normative changes (RFC required)

Any change to `manifesto.{en,fr}.md` sections 1–15 (excluding §14 list of annexes), to the canonical / short / binary formats, to the §11.4 algebra, to the rounding policy, or to the 12 core vectors **MUST** follow the RFC procedure in `versioning.en.md §6`.

**Pre-v1.0 decision rule:** the BDFL summarizes consensus and decides (accept, revise, reject) with a written rationale.

**Post-v1.0 decision rule — rough consensus (IETF-style, BCP 25):**

1. After the public comment period closes (`versioning.en.md §6.2`), an editor designated as **shepherd** summarizes the discussion and the technical objections.
2. The committee **MUST** seek rough consensus among editors. A change is **accepted** when no editor maintains a sustained technical objection.
3. **Backward-compatibility veto:** any editor **MAY** unilaterally block a change that would violate the post-v1.0 freeze (`versioning.en.md §3`). This veto cannot be overridden; the path forward is ATS 2.x.
4. If consensus cannot be reached within 30 days after comments close, the shepherd publishes the impasse with all positions on record and the RFC is **revised** (not rejected) until consensus emerges or 90 days pass with no movement, after which the RFC is **rejected**.

### 3.3 Implementation-specific changes

A reference implementation (`code/ats.py`, `docs/assets/js/ats.js`) **MAY** evolve independently as long as it preserves the conformance contract:

- Round-trip of all `test-vectors-*.json` files at its `spec_version`.
- API compatibility within the same SemVer MAJOR version.
- Build dependencies remain auditable.

Third-party implementations are free to adopt their own governance, provided they pass the same conformance tests and clearly state which `spec_version` they target (`versioning.en.md §2`).

---

## 4. RFC archive

### 4.1 Location and required fields

All RFCs (accepted, revised, or rejected) **MUST** be archived in `docs/spec/rfcs/` per `versioning.en.md §6.6`. Each archived RFC **MUST** contain, at a minimum:

- The RFC number and title.
- The filing date and decision date.
- The proposing party.
- The shepherding editor (post-v1.0).
- The technical content of the proposal.
- The decision (accept, revise, reject) with rationale.
- Cross-references to the spec sections modified.

### 4.2 RFC numbering

RFCs **SHALL** be numbered monotonically starting at `0001`. Numbers are assigned at filing time and **MUST NOT** be reused, even if an RFC is later withdrawn.

### 4.3 v1.0 acceptance criterion

`versioning.en.md §7.2 (5)` requires at least one decided RFC in the archive before v1.0 ships. The decision **MAY** be acceptance, revision, or rejection — the goal is to exercise the process, not to force acceptance of a particular change.

---

## 5. Implementer rotation

### 5.1 Nominating an editor

Once the project tags v1.0 and the steering committee is seated, additional editors **SHALL** be drawn from active implementers. An implementer is eligible for nomination if all of the following hold:

- They maintain a published implementation passing 100 % of the conformance vectors at the current `spec_version`.
- They have authored or shepherded at least one accepted RFC.
- They have contributed substantive review on at least 3 separate RFCs.
- They satisfy the affiliation constraint of §2.2 with respect to the seated committee.

### 5.2 Nomination procedure

A nomination **MUST** be filed as an RFC (`versioning.en.md §6`) and **MUST** include:

- The nominee's GitHub handle and an explicit statement of acceptance.
- Evidence of the §5.1 criteria.
- A disclosure of any affiliation per §6.

### 5.3 Seat term and rotation

Editor seats are open-ended; no fixed term is required. An editor **MAY** resign at any time by opening a PR removing their entry from §1.1 with a 30-day notice. Editor activity is reviewed at every minor release; an editor inactive (no review, no merge, no public comment) for two consecutive minor releases **SHOULD** be invited to resign or to confirm continued commitment.

---

## 6. Conflict-of-interest disclosure

### 6.1 What MUST be disclosed

Every editor of record **MUST** disclose, in a public section of their GitHub profile or in a file `docs/spec/rfcs/disclosures/<handle>.md`:

- Current employer or principal client.
- Any commercial product that depends on ATS or competes with ATS.
- Any standards body, working group, or trade organization they participate in where ATS is on-agenda.
- Any cryptocurrency, blockchain, or token project they advise or hold in material amount (defined by the editor in good faith) that could plausibly benefit from ATS adoption.

### 6.2 Recusal

An editor with a conflict on a specific RFC **MUST** recuse from the decision per §3.2 and **MUST** document the recusal in the RFC record. Recused editors **MAY** still participate in technical discussion as ordinary contributors.

### 6.3 Disclosure refresh

Disclosures **MUST** be refreshed before each minor release or whenever a material change occurs (new employer, new product launch, new affiliation).

---

## 7. Editor accountability and removal

### 7.1 Grounds for removal

An editor **MAY** be removed for any of the following:

- Sustained violation of §1.2 (acting beyond authority).
- Failure to disclose a conflict per §6 within 30 days of its emergence.
- A pattern of merging changes that bypass §3.2.
- Code-of-conduct violations as defined in the repository's `CODE_OF_CONDUCT.md` (when adopted).
- Six months of unbroken inactivity without notice (per §5.3).

### 7.2 Removal procedure

A removal proposal **MUST** be filed as an RFC. The RFC **MUST**:

- State the grounds per §7.1.
- Provide evidence (links, commit hashes, dated correspondence).
- Allow the named editor a written response of equal length.

The decision rule of §3.2 applies, with the named editor recused. A removal **MUST** receive support from a strict majority of the non-recused committee. The committee **MAY** instead vote a **censure** (formal warning, no removal).

### 7.3 Self-removal

Any editor **MAY** resign at any time per §5.3 without going through §7.2. A resignation is not an admission of fault.

---

## 8. Trademark and licensing posture

### 8.1 Code

All reference implementation code (`code/`, `docs/assets/js/`, `scripts/`) is published under the **MIT License**. Third-party implementations are free to choose any OSI-approved license; the conformance contract (`versioning.en.md §2.3`) is the only requirement.

### 8.2 Documentation

The specification text (`docs/spec/manifesto.{en,fr}.md`, normative annexes, non-normative annexes) is published under **CC-BY-4.0** unless individual files specify otherwise. Attribution to the ATS project and a link to the canonical repository **MUST** be preserved in derivative works.

### 8.3 The Δ symbol and project name

The Δ symbol used by ATS is the Greek capital letter delta (Unicode U+0394) and is **NOT** trademarked. The project name "ATS" and "Apollonian Time System" are **NOT** trademarked. The editors of record reserve the right to publicly object to implementations claiming "ATS conformance" that fail the conformance vectors (`versioning.en.md §2.3`).

### 8.4 Branding kit and logo

The OG card, favicon, and logo SVGs in `docs/assets/img/` are CC-BY-4.0. The colour palette (`#0b0f17 / #4a6cff / #e8eef7`) is published as guidance, not as a registered mark.

---

## 9. Anticipated objections

### 9.1 "The BDFL model is a single point of failure."

Acknowledged. §2 commits explicitly to a multi-editor transition at v1.0, and §2.4 prevents a stealthy revert. Pre-v1.0, the spec is by definition unstable; the SPOF risk is highest before v1.0 but its blast radius is smallest because no production system should rely on a pre-v1.0 frozen contract.

### 9.2 "Three editors is not enough."

Three is a floor, not a ceiling. §2.2 sets the minimum; §5 sets the path to grow. The affiliation cap of "at most 1 editor per legal entity" prevents the common failure mode of a steering committee captured by one employer.

### 9.3 "Rough consensus is too vague."

The IETF has used rough consensus successfully for four decades [BCP 25]. The §3.2 (3) backward-compatibility veto provides a hard guard against the failure mode rough consensus is most often criticized for (sustained-minority objections being overridden by a majority eager to ship).

### 9.4 "Implementer nomination biases the committee toward implementers with existing market share."

Acknowledged. The constraint is that editors **MUST** demonstrate sustained engagement (§5.1), not market share. A solo implementer who consistently authors and reviews RFCs is eligible; an employer-backed implementer who never participates is not.

### 9.5 "What stops the founding BDFL from staying on indefinitely?"

§2.2 strips the BDFL designation at v1.0 by definition; the seat becomes one of three under the affiliation cap. §5.3 makes the seat subject to the same activity review as any other. §7 makes removal possible without the BDFL's consent.

### 9.6 "Why CC-BY-4.0 for docs and not CC0 / public domain?"

Attribution to a canonical source helps consumers detect spec drift (a fork that removes attribution can quietly diverge). CC-BY-4.0 preserves derivative freedom while retaining the citation chain. CC0 was considered and rejected for this reason.

---

## 10. Normative reference precedence

In case of conflict, the following order applies:

1. `manifesto.en.md` (the spec proper).
2. `versioning.en.md` (versioning and process).
3. This document (`GOVERNANCE.md`).
4. `SECURITY.md` (vulnerability handling).
5. Non-normative annexes (`philosophy`, `comparison`, `conventions`, `analog-clock`, `faq`).

This document does **NOT** override the spec; if §3 here contradicts `versioning.en.md §6`, the latter controls.

---

## Contact

- **Issues / PRs / Discussions:** <https://github.com/s-geffroy/ATS>
- **Security:** see `SECURITY.md`
- **Direct (BDFL, pre-v1.0):** `sylvain.geffroy@gmail.com`

## References

- [RFC 2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.
- [RFC 8174] Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, May 2017.
- [BCP 25] Bradner, S., "IETF Working Group Guidelines and Procedures", BCP 25, RFC 2418, September 1998.
- [SemVer 2.0.0] Preston-Werner, T., "Semantic Versioning 2.0.0", <https://semver.org/spec/v2.0.0.html>.
- [MIT] "The MIT License", <https://opensource.org/license/mit/>.
- [CC-BY-4.0] Creative Commons, "Attribution 4.0 International", <https://creativecommons.org/licenses/by/4.0/>.
