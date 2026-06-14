# FAQ — Δ ATS

**Status:** Pre-release v0.7
**Document type:** Non-normative FAQ. Conversational complement to the normative spec.
**Normative reference:** `manifesto.en.md`
**Authoritative language:** English. French translation in `faq.fr.md`.

> Each answer below cites the source section in the manifesto or an annex so claims are verifiable. Questions cluster around **foundations** (§1), **format and notation** (§2), **math and precision** (§3), **multi-planetary** (§4), **cultural calendars and adoption** (§5), **implementation and conformance** (§6), **site and UI** (§7), and **versioning and process** (§8). Use the navigation to jump.

---

## 1. Foundations

### Why not just keep the Gregorian calendar?

The Gregorian calendar optimises seasonal alignment for a 16th-century agrarian society. For computing durations, comparing periods, or reasoning about human cycles (focus, rest, project, generation), it adds noise: irregular months (28–31 days), religious weeks (no biological warrant), shifting time zones, summer time. ATS does not replace Gregorian — it offers a cleaner **measurement layer** that coexists with it. See `comparison.en.md §9.1` for the full comparative argument; `philosophy.en.md §1` for the rationale.

### Why 1969-07-20, not a "neutral" date?

The Apollo 11 lunar landing is the most universally positive, technically verifiable event of the 20th century. It marks the first time a member of our species occupied, in person, the surface of a body other than Earth — the discontinuity ATS uses as its anchor. The four properties that make Apollo 11 uniquely suited as the ATS epoch (verifiability, species-scale witness, no human victim, presence-elsewhere discontinuity) are documented in `manifesto.en.md §2.3`. Six rejected alternatives (Sputnik, Hiroshima, Wright, Apollo 11 launch, first step, etc.) are documented at `manifesto.en.md §2.2`.

### Why the start of the day (00:00 UTC), not the touchdown instant (20:17:40 UTC)?

To keep the day counter aligned with UTC: with the epoch on the midnight boundary, **Bloc 5 = 12:00 UTC** exactly (5 × 2 h 24 min), Bloc 0 = midnight, and so on. Earlier drafts ("RC v1.1") anchored on the touchdown instant; that made Bloc 5 fall at 08:17:40 UTC, which surprised newcomers ("why isn't Bloc 5 noon?"). v0.5 fixed that. The touchdown itself is preserved as a remarkable instant inside Δ 0, at `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6). See `manifesto.en.md §2.1`.

### Why not the first step (1969-07-21T02:56:15Z) as the anchor?

The first step is symbolically heavier than the landing — but it happens 6 h 35 after Eagle has already touched down, and on the *following* UTC day (Δ 1). The world remembers the landing as "July 20, 1969"; picking the start of that day keeps the cultural memory intact while aligning with UTC. The rejection appears in the `manifesto.en.md §2.2` candidate table.

### Why not the tropical year (365.2422 days) as a macro unit?

Because it is not an integer multiple of a day. Forcing it into a positional format requires leap days or fractions — exactly what ATS is designed to eliminate. The same logic rejects the synodic month (29.53 days) as a positional unit on Earth, and applies in reverse on the Moon (where the synodic lunar day *is* the natural unit; see `multi-planetary.en.md §3.3`).

### Why not base 12 or base 20?

Base 12 has divisibility benefits (2, 3, 4, 6); base 20 matches the Mayan Long Count. But the global ecosystem — SI units, currencies, scientific notation, computing, finance — is overwhelmingly base 10. The decimal choice drives adoption friction to near zero. The choice is **engineering, not numerology** — `manifesto.en.md §1.1` is explicit about this.

### Why not the Holocene Era (Year 12026 = agriculture-start anchor)?

Holocene Era keeps Gregorian structure and only shifts the year count by +10 000. It is a cosmetic improvement; it does not address the underlying computational problems (irregular months, time zones, leap rules). ATS keeps a clean decimal counter under the same UTC axis. See `comparison.en.md §5.1` — Holocene wins on archaeological intuition; ATS wins on computational simplicity. The two could coexist (Holocene year + ATS day count).

### Is ATS a religion or a worldview?

No. ATS is a coordinate system on the UTC time axis. It is not a theory about the nature of time, not a replacement for cultural or religious calendars, not a clock synchronisation protocol, and not a metaphysical claim about base 10. The four explicit boundaries are stated in `manifesto.en.md §1.1`. The proposed cultural rituals in `conventions.en.md` (Kilo-versary, Hecto-feast, Generation transitions) are opt-in cognitive scaffolds with no metaphysical content; `philosophy.en.md §8.1` addresses the "secular religion" charge explicitly.

---

## 2. Format & notation

### How do I read `T+ Δ 20.7.8.0.61137` out loud?

The spec does not standardise oral form (`manifesto.en.md §5` describes only written forms). Three observed usages:

- **Digit-by-digit**: "tee-plus delta two-zero dot seven dot eight dot zero dot six-one-one-three-seven".
- **Grouped**: "twenty point seven point eight point zero point sixty-one thousand one hundred thirty-seven".
- **Short conversational** (`Δ20.7.8.0-61.1`): "delta twenty dot seven dot eight dot zero dash sixty-one dot one".

Pick what fits your context.

### What's the difference between the canonical and the short form?

- **Canonical** (`T+ Δ K.H.D.Kin.fffff`): full precision, used for logs, storage, and interchange. Always carries the direction marker (`T+` or `T-`). See `manifesto.en.md §4`.
- **Short** (`ΔK.H.D.Kin-BC.M`, v0.7+): conversational form for UI and watches. No space after Δ, separator `-` between Kin and BC, separator `.` before Milli. No direction marker (T+ implied). See `manifesto.en.md §5`.

### Where does the Milli digit come from? (v0.7 update)

Before v0.7, the short form was `Δ K.H.D.Kin/cc` (e.g., `Δ 20.7.8.2/50`), encoding Bloc and Centi but not Milli — precision ±14 min 24 s. Since v0.7, the format is `ΔK.H.D.Kin-BC.M` (e.g., `Δ20.7.8.2-50.0`), adding the Milli digit and bringing precision to ±1 min 26 s. The Milli digit is **always emitted**, including when its value is 0, so the precision floor is predictable. See `manifesto.en.md §5.1`.

### Why does `Δ20.7.8.2-50` — without the Milli digit — get rejected?

The v0.7 short parser is strict: the trailing `.M` is part of the format. The Milli digit must always be present (even when 0). Refusing a missing Milli prevents ambiguity at the precision boundary — a value with no `.M` looks like it could be from the pre-v0.7 era. The `manifesto.en.md §5.1` ABNF grammar enforces this; the Python and JS reference parsers reject the missing `.M` form with an explicit error.

### "Δ20.7.8-65.1" — which day exactly?

That's still ambiguous on which day, because the Kin digit is missing. v0.1.2 brought **`Kin` back** into the short form precisely to fix this: the v0.7 short form is `Δ20.7.8.5-65.1` (with Kin = 5). The short form is now precise to the day, with the Milli digit (since v0.7) bringing intra-day precision to ±1 min 26 s. See `manifesto.en.md §5.1`.

### Why no time zones?

Because time zones are the #1 source of date-handling bugs in commercial software [Hertel 2011 in `philosophy.en.md` references]. ATS = strict UTC by spec (`manifesto.en.md §7`). To calibrate human activity to the local sun, use the **LST (Local Solar Time)** overlay as a *presentation-layer* convenience only — never store an LST value as part of an ATS instant. Software interfaces transporting ATS values **must not** carry a time-zone field (`manifesto.en.md §7`).

### What about daylight saving time?

Gone, as far as ATS is concerned. DST is a cultural convention applied at the presentation layer; no ATS value moves when DST changes. A society that wants more summer sun shifts its **activity hours** (in ATS), not its clock. The cities-page dataset (`docs/assets/data/cities.json`) reflects activity windows; some cities visibly shift their activity windows summer-to-winter. ATS itself is unchanged.

### What happens during a leap second?

ATS aligns with POSIX: a day is **exactly 86 400 SI seconds**. The leap second is absorbed, just like Unix time. Implementations choose one of three documented smear policies — POSIX-naïve, linear smear, or step-jump — and must document the choice (`manifesto.en.md §8.2`). A future ATS-TAI variant is reserved (`manifesto.en.md §8.3`) for aerospace and high-precision science where leap-second behaviour matters at sub-second scale.

### Why is `Kin` in the integer part, not part of the fraction?

Because the integer part (`Kilo.Hecto.Deka.Kin`) answers "**which day?**" and the fractional part (`Bloc.Centi.Milli.Beat.Blink`) answers "**at what moment in the day?**". Two distinct questions, two distinct halves. In canonical form they are separated by `.`; in short form by `-` (since v0.7). The Kin is the smallest macro unit (1 day) — it belongs with the date, not with the clock.

### What about Kilo > 9?

Kilo has no upper bound. `T+ Δ 124.3.5.7.00000` is valid (124 × 1000 + 357 days = ~344 years after epoch). Internally it is an unbounded integer; the reference Python implementation uses Python `int` (arbitrary precision); the reference JS implementation uses JavaScript `number` up to 2^53. See `manifesto.en.md §4.2`.

### Can I omit the direction marker `T+` in canonical form?

No. `manifesto.en.md §3` and §4.1 are strict: canonical form requires either `T+` or `T-`, never omitted. The omission shorthand exists only in the conversational short form (`manifesto.en.md §5`), where `T+` is implied.

---

## 3. Math & precision

### Won't truncation cause the clock to lag behind reality?

Yes — by design. ATS is a counter of **completed** units. Until the next fraction has fully elapsed, it is not shown. Consequence: the displayed time is always ≤ the actual instant; drift ≤ 864 ms at 5-digit precision. See `manifesto.en.md §6` for the formal invariants. The reference Python implementation passes a property-based test (Hypothesis) on 1000 random instants verifying the drift bound (`tests/test_property.py`).

### Why not banker's rounding (half-even)?

Tried in v0.1.0, reverted in v0.1.1. Half-even can briefly push the display **ahead of** reality — incompatible with a monotonic counter. ATS prioritises truthful monotonicity over averaging symmetry. See `manifesto.en.md §6.4` for the rationale.

### How precise is the short form?

The short form `ΔK.H.D.Kin-BC.M` carries BC (2 digits of Bloc+Centi) plus M (1 digit of Milli) — three digits of intra-day precision, giving ±1 min 26 s. The Beat and Blink digits are not present in the short form. The full canonical form has 5 digits and ±864 ms precision; extended-precision implementations (9 digits) reach ±0.0086 ms. See `manifesto.en.md §4.4`.

### Can the short form round-trip to UTC?

Yes, with the documented precision. Decoding `Δ20.7.8.2-50.0` produces an ATS instant whose UTC interpretation is a half-open interval `[utc_decoded, utc_decoded + 86.4 s)` — exactly one Milli of uncertainty. Decoders must label the result as approximate (`manifesto.en.md §10`). The 5-digit canonical form round-trips with ≤ 864 ms drift.

---

## 4. Multi-planetary

### Why Mars Pathfinder as the Mars epoch?

Mars Pathfinder Sagan Memorial Station touchdown (1997-07-04T16:56:55Z) was the first successful modern Mars landing of the contemporary era, with public records precise to the second. The symbolic July 4 date matches the Apollo 11 cultural framing. Six rejected alternatives — Viking 1, Mars 3, Curiosity, Perseverance, Schiaparelli, future human landing — are documented in `multi-planetary.en.md §8.1`. The first human landing on Mars **may** become the anchor in a future revision via the RFC process.

### Why does the Moon share Earth's epoch?

Doctrinal choice: the Moon is Earth's satellite; the Earth-Moon system is gravitationally and astronomically one system. Using one epoch reflects this. Lunar settlers experience the synodic day (≈ 29.53 Earth days) as the natural intra-day cycle, but the epoch is shared with Earth's so cross-body coordination is simpler. See `multi-planetary.en.md §8.2`.

### Why the synodic lunar day, not the sidereal day?

Three reasons (`multi-planetary.en.md §3.3.2`):

1. Lunar settlers experience the synodic cycle (sunrise–sunset–sunrise), not the sidereal one.
2. The synodic cycle matches the phase cycle observed from Earth — the cultural reference.
3. The NASA Coordinated Lunar Time framework (2024) uses the synodic cycle.

The sidereal day **may** be exposed as an additional non-normative unit by implementations that need it.

### Can I define a Venus ATS or an Europa ATS?

Yes. The generic framework in `multi-planetary.en.md §6` lets any implementation register `Δ_X` for any body by providing four parameters: `epoch_X`, `day_seconds_X`, `suffix_X`, and (optional) `symbol_X`. The reference Python implementation (`code/ats_multi_planetary.py`) provides a `Body` class with this interface. Vector requirements are in `multi-planetary.en.md §6.3`.

### Do relativistic effects matter for ATS?

For 5-digit precision (864 ms resolution), no. The lunar surface clock drifts ≈ 58.7 µs/day faster than UTC [NIST 2024] — about 14 700× smaller than one Blink. Even over 50 years, cumulative drift is ≈ 1.07 s. For default ATS precision, this is negligible. For sub-millisecond precision use (autonomous lunar rover scheduling, deep-space communication), implementations must maintain their own TAI ↔ surface-local correction tables (`multi-planetary.en.md §9.3`). A future ATS-TAI variant is reserved.

---

## 5. Cultural calendars & adoption

### Does ATS replace my religious calendar?

No. ATS is a computational time standard; cultural and religious calendars (Hebrew, Islamic, Hindu, Chinese, Bahá'í, Mayan Long Count, Persian, Ethiopian, etc.) serve cultural and religious functions ATS does not address. The relationship is **interoperation, not displacement** (`manifesto.en.md §13.1`). The reference implementation includes 5 bridges (`code/bridges/*.py`) demonstrating that an ATS instant maps to an instant in any cultural calendar. See `comparison.en.md §7` for the full discussion.

### Does ATS legislate a 10-day week?

No. The Deka (10 days) is a unit of measurement, not a social mandate (`manifesto.en.md §13.3`). The 7+3 work-rest rhythm proposed in `conventions.en.md §2` is one of several alternatives (6+1+2+1, 8+2, 5+5, 6+4); adopting any of them, or none, is compatible with ATS. Communities committed to the 7-day liturgical week (Sabbath, Sunday, Friday prayer) retain it; `conventions.en.md §2.4` documents three reasonable responses for those communities.

### What about the Hebrew/Islamic/Hindu/Chinese calendars?

They coexist with ATS via interop bridges. The bridges are in `code/bridges/{hebrew,islamic,hindu,chinese,maya}.py`. Each maps an ATS instant to its representation in the cultural calendar (and back). Conformance vectors for bridges are in `docs/spec/test-vectors-bridges-*.json`. See `comparison.en.md §7` for the discussion of why cultural calendars are interoperated, not compared.

### Won't decimal time fail like the French Republican calendar (1793)?

The French Republican calendar failed for three documented reasons (`philosophy.en.md §4.1`, `comparison.en.md §4.1`):

1. **Religious-cultural rupture too sharp** — the 10-day week meant 1 rest day per 10 instead of 1 per 7.
2. **Decimal clocks were expensive to manufacture** and the population resisted relearning.
3. **Political symbolism** — the calendar was associated with the Terror.

ATS draws three explicit lessons:

1. ATS does **not** legislate rest rhythms.
2. ATS does **not** abolish the 24-hour civil clock — analog ATS and Gregorian wall clocks coexist.
3. ATS is anchored on a verifiable, non-political event (`manifesto.en.md §2.3`).

None of the 1793 failure modes apply to ATS. The 1793 failure is a *constraint* on the design space (which ATS respects), not a *proof* against decimal time.

### Does ATS work on mobile / in the browser / offline?

Yes. The reference site (`/{fr,en}/index.html`) is a Progressive Web App; the JavaScript reference (`docs/assets/js/ats.js`) is ~10 KB and runs anywhere a `<script>` runs. The site is installable on Chrome Android and Safari iOS; the analog dial works offline once cached.

---

## 6. Implementation & conformance

### How do I verify a third-party library is spec-compliant?

`docs/spec/test-vectors.json` lists 12 reference instants with canonical and short encodings; `test-vectors-arithmetic.json` lists 12 algebra cases; `test-vectors-multi-planetary-{mars,moon}.json` list 10 cases per body. Any implementation must produce **bit-identical** outputs (`manifesto.en.md §16.5`). The project's CI runs this contract against Python and JavaScript on every push; the workflow file is `.github/workflows/ci.yml`.

### What does "conformance" mean exactly?

Conformance to ATS v0.7 means:

1. Passing `test-vectors.json` (Earth) bit-for-bit.
2. Passing `test-vectors-arithmetic.json` (algebra) bit-for-bit.
3. Implementing the strict canonical and short-form parsers.
4. Documenting the chosen leap-second smear policy (`manifesto.en.md §8.2`).
5. Documenting the precision class (default 5-digit or extended).

Multi-planetary support adds passing the Mars and Moon vectors. Conformance is **binary, not graduated**: an implementation is conformant or not. Partial conformance to optional sections must be documented (`manifesto.en.md §16.5`).

### Which leap-second smear policy should I use?

Three policies are normative options (`manifesto.en.md §8.2`):

- **POSIX-naïve smear**: matches `time_t` semantics; RECOMMENDED for general use.
- **Linear smear (Google-style)**: distributes the leap over a 20-hour window; RECOMMENDED for distributed systems where clock-jump tolerance is low.
- **Step-jump (TAI-aligned)**: tracks TAI internally; PERMITTED for aerospace and scientific use.

The reference Python implementation uses POSIX-naïve (inherited from Python's `datetime`). Document your choice in your release notes.

### Is there a JSON schema for `spec_version`?

Not in v0.7 — the field uses `MAJOR.MINOR` syntax (no PATCH) defined informally in `versioning.en.md §2.1`. Implementations are free to validate the field with JSON Schema or any other mechanism. A reference JSON Schema **may** be added in a future MINOR if implementations request one (the request is itself an RFC; see `versioning.en.md §6`).

### Is there a Rust or Go implementation?

Not yet. A third-party reference implementation in Rust or Go is a **v1.0 ship requirement** (`versioning.en.md §7.2 (3)`). It is on the roadmap (`ROADMAP.md` V1.0-B). Contributors are welcome.

---

## 7. Site & UI

### What's the analog clock for?

To make ATS readable in a single visual gesture, the way a Gregorian wristwatch is readable. Five hands (Bloc, Centi, Milli, Beat, Blink) sit at five fixed length-and-colour tiers, with the slowest hand shortest and the fastest hand longest (watchmaker convention). The dial also carries an outer ring of city arcs showing 8 capitals' active-day windows (08–22 local). See `analog-clock.en.md` for the full reference design and `philosophy.en.md §2` for the rationale behind the Bloc unit.

### How do the city arcs work?

Each city draws a coloured arc covering its local 08:00 → 22:00 active day. The arcs use four different stroke styles per slot (morning/noon/afternoon/evening) to make the time-of-day visually scannable. Click a city trigram to enter **focus mode**: a "camembert" overlay appears at the centre of the dial, the other cities' arcs dim, and the focused city's trigram enlarges. See `analog-clock.en.md §9` and §10.

### What's the Cities map page?

A separate reference page at `/{fr,en}/cities.html` showing a world map of ~40 capitals with an emoji per city evolving with the activity in progress locally (sleeping, working, lunching, etc.) at the current ATS instant. A slider lets you scrub through 24 h UTC. See `analog-clock.en.md §12` and `conventions.en.md §3.4`.

### Can I add my own city?

Yes. Open the `<details>` panel below the clock, enter a code (2–4 letters), name, IANA time zone (autocompleted from `Intl.supportedValuesOf('timeZone')`), and pick a colour. Up to 6 custom cities are persisted in `localStorage["ats-custom-cities"]`. Nothing leaves the browser. See `analog-clock.en.md §11`.

### Why does the clock use 10 Hz refresh instead of 60 Hz?

Three reasons (`analog-clock.en.md §8.1`):

1. The Blink position refreshes every ≈ 864 ms, below 10 Hz visibility; faster ticks would not show new information.
2. 10 Hz is cheap on CPU and battery.
3. Mobile browsers throttle background timers to 1 Hz; 10 Hz active gives a headroom margin without visible jitter when the tab returns to focus.

A 60 Hz implementation driven by `requestAnimationFrame` is permitted.

---

## 8. Versioning & process

### What changes between v0.x versions?

Breaking changes are permitted at minor boundaries pre-v1.0; each is recorded in `CHANGELOG.md` with a migration path. The most recent example: v0.6 → v0.7 changed the short-form syntax from `Δ K.H.D.Kin/cc` to `ΔK.H.D.Kin-BC.M`. Post-v1.0, breaking changes are forbidden at minor boundaries; they require a new project (ATS 2) per `versioning.en.md §3.8`.

### Is v1.0 done yet?

No. v1.0 ships when **all** seven requirements in `versioning.en.md §7.2` are met. As of v0.7:

- (1) `spec_version` field on all vectors — **DONE** (v0.6).
- (2) Multi-planetary annex normative — **DONE** (v0.7).
- (3) Third-party implementation (Rust or Go) — TODO.
- (4) Published artefacts (`npm publish`, `twine upload`, signed GitHub Release) — TODO.
- (5) RFC archive (`docs/spec/rfcs/`) — TODO.
- (6) `GOVERNANCE.md` naming editors of record — TODO.
- (7) Lighthouse CI workflow — **DONE** (v0.7).

3 of 7 requirements met; 4 remaining.

### How do I propose a change to the spec?

Open a public GitHub Issue or PR titled `RFC: <topic>` containing the required sections (summary, motivation, specification, migration, backward-compat analysis, vector impact). Public comment period: minimum 14 calendar days. The decision is recorded by the editors of record with written justification. Accepted RFCs are merged and version-bumped. See `versioning.en.md §6` for the full procedure.

### Why isn't ATS an IETF RFC yet?

The editors intend to submit ATS as an Informational RFC to the IETF **after** v1.0 ships (`manifesto.en.md §16.3`). Pre-v1.0 the spec is iterating too rapidly for the IETF process (multi-month last-call periods). The lightweight RFC process documented in `versioning.en.md §6` is sufficient for the current cohort of contributors. An IANA registry for canonical/short-form labels and multi-planetary body identifiers is planned for the IETF submission.

### Is there a governance document?

Not yet. `GOVERNANCE.md` (naming editors of record and the decision procedure) is a v1.0 ship requirement (`versioning.en.md §7.2 (6)`). Pre-v1.0, decisions belong to the document editor of record. Post-v1.0, a multi-editor model with rough consensus and backward-compatibility veto applies (`versioning.en.md §6.3`).

### Is there a public roadmap?

Yes, in `ROADMAP.md` at the project root. It tracks delivered work (v0.6 + v0.7) and remaining v1.0 blockers (V1.0-B Rust/Go, V1.0-C JS converter, V1.0-E i18n, V1.0-F tests, V1.0-G background sync, V1.0-H branding, V1.0-I adoption signal). As of v0.7, 3 of 9 v1.0 blockers are closed.

---

## What this FAQ is *not*

To pre-empt category errors (mirroring the posture of the other annexes):

1. **This is not normative.** Conformance (`manifesto.en.md §16.5`) does not depend on any answer here. The FAQ exists to make the normative content more accessible, not to define new normative content.
2. **This is not exhaustive.** Questions are added as they emerge from user interaction. Submitting a question via GitHub issue is welcome (`manifesto.en.md §16.1`).
3. **This is not legal or financial advice.** ATS is a time representation; how you use it in a regulated context (financial reporting, legal contracts) is your responsibility. The Hanke-Henry calendar may be a better fit for fiscal reporting (`comparison.en.md §3.3`).

---

## Cross-references at a glance

| Topic | Normative section | Non-normative annex |
|---|---|---|
| Epoch and four-property test | `manifesto.en.md §2`, §2.3 | `philosophy.en.md §5`, `comparison.en.md §5` |
| Canonical & short formats | `manifesto.en.md §4`, §5 | — |
| Truncation policy | `manifesto.en.md §6` | — |
| Time zones (UTC strict) | `manifesto.en.md §7` | `conventions.en.md §3` (08–22 bands) |
| Leap seconds | `manifesto.en.md §8` | — |
| Δd algebra | `manifesto.en.md §11.4` | — |
| Binary encoding | `manifesto.en.md §12` | — |
| Multi-planetary | `multi-planetary.en.md` | `philosophy.en.md`, `comparison.en.md §6` |
| Stability / RFC process | `versioning.en.md` | — |
| Rituals (Kilo-versary, etc.) | — | `conventions.en.md §1`, `philosophy.en.md §6` |
| Analog clock design | — | `analog-clock.en.md` |
| Comparison to alternatives | — | `comparison.en.md` |

Every claim in this FAQ either references a spec section or labels itself as the editor's opinion. If you spot an answer that cannot be traced to a normative source, please open an issue.
