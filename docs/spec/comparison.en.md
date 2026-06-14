# ATS — Comparison with Alternative Time Standards

> *No standard is adopted on design merit alone. Adoption is engineering plus path-dependence. This annex argues the engineering case honestly — including where ATS loses.*

**Status:** Pre-release v0.7
**Document type:** **NON-NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the spec proper).
**Authoritative language:** English. French translation in `comparison.fr.md`.
**Core posture:** This annex compares ATS to 17 alternative time standards across six families. Each alternative is presented in the strongest version its advocates would recognise. Explicit comparison criteria are stated up front so cherry-picking is visible. A dedicated section (§8) concedes where alternatives win. The intent is auditability, not triumphalism.

---

## 0. Scope and posture

This annex is **non-normative**. Implementations of ATS are not required to accept its comparative claims; conformance (per `manifesto.en.md §16.5`) is judged on the standard's normative content.

What this annex offers:

- A fixed set of **comparison criteria** (§1) applied uniformly across alternatives, so cherry-picking is visible.
- A presentation of each alternative in the **strongest version** its advocates would endorse, sourced where possible.
- An explicit **"where alternatives win"** section (§8) that concedes the criteria on which ATS does not win.
- An explicit **anticipated-objections** section (§9) that pre-empts the most common attacks on the comparison.

What this annex does *not* offer:

- A claim of total superiority. ATS wins on a specific set of criteria (multi-planetary, computational simplicity, biological alignment); other systems win on others (cultural alignment, deployment inertia, astronomical heritage).
- A comparison with living cultural and religious calendars (Hebrew, Islamic, Hindu, Chinese, Bahá'í, Mayan Long Count). These serve functions that ATS does not address; the relationship is **interoperation, not displacement**. See §7 and the conformance bridges in `code/bridges/*.py`.
- A prediction of adoption. Standards adoption is path-dependent and only partially predictable from design. The comparison argues the engineering case; the marketplace of standards judges the rest.

---

## 1. Comparison criteria

The following eight criteria are applied to every alternative in §§2–6. Each criterion is observable and definable; the comparison verdicts in §10 use these criteria explicitly.

| # | Criterion | Question it answers |
|---|---|---|
| **C1** | Computational simplicity | How complex is arithmetic on durations and instants? Is `t₂ − t₁` a single subtraction or does it require calendar-aware logic? |
| **C2** | Time-zone elimination | Does the standard define a single global instant per moment, or does it carry a time-zone field? |
| **C3** | Unit regularity | Are the macro and micro units fixed-length, or do they vary (months 28–31, leap weeks, blank days)? |
| **C4** | Adoption inertia | What is the estimated deployed base and the years of operation? |
| **C5** | Multi-planetary generality | Does the standard generalise to celestial bodies other than Earth? |
| **C6** | Biological / cognitive alignment | Do the unit boundaries match measured human cycles (circadian, ultradian, attention, recovery)? See `philosophy.en.md §2–5`. |
| **C7** | Cultural neutrality of anchor | Is the anchor or unit naming derived from a specific religion, nation, or empire? |
| **C8** | Precision contract | Does the standard prescribe deterministic sub-second behaviour (rounding, leap-second policy, smearing)? |

These criteria do not weight equally for every use case. For software interchange C1+C2+C8 dominate; for cultural use C6+C7 dominate; for space coordination C5 dominates. The comparison is **multi-dimensional**, not scalar.

---

## 2. Family A — Computational time scales (ATS's actual cousins)

These are the **honest comparison targets**: linear counters anchored on a singular point, no months or weeks, used by software and astronomy. ATS shares the most DNA with this family; its differentiation against them is the most load-bearing.

### 2.1 Unix Epoch (POSIX time)

- **Anchor.** 1970-01-01T00:00:00Z (UTC).
- **Unit.** SI seconds (linear count).
- **Range.** Signed 32-bit (overflows in 2038, the "Y2038 problem"); 64-bit on modern systems.
- **Advocates.** Originated in Unix Version 6 (1975); now the *de facto* standard for software timestamps. Estimated deployed base: every Unix-family system, every JVM, every database, billions of devices [Lewine 1991 on POSIX semantics].
- **Where it wins.** **C1, C4, C8.** Single subtraction for `t₂ − t₁`. Unmatched adoption inertia (~50 years, ~10¹⁰ deployed instances). POSIX leap-second semantics are deterministic (the leap is absorbed).
- **Where ATS differs.** **C3, C5, C6, C7.** Unix Epoch has no positional readout — it is a raw counter, opaque to humans. ATS is Unix Epoch *with a decimal positional grammar*: `K.H.D.Kin.fffff` displays the same information as `seconds_since(epoch_unix)`, but addresses to a human. Both are linear; only one is conversational. ATS also offers multi-planetary anchors (C5) and biologically-meaningful units (C6, see philosophy annex); Unix Epoch has neither.

### 2.2 Julian Day Number (JDN) and Modified Julian Day (MJD)

- **Anchor.** JDN: −4712-01-01T12:00:00 (proleptic Julian noon), i.e., 4713 BCE in proleptic Gregorian. MJD: 1858-11-17T00:00:00 UTC (defined as JDN − 2_400_000.5).
- **Unit.** Days (linear, can be fractional).
- **Range.** Practically unbounded; the JDN epoch covers all of recorded astronomy.
- **Advocates.** Joseph Scaliger (1583) for JDN; introduced by IAU in 1957 for MJD. Universal in astronomy, astrodynamics, and historical chronology [Doggett 1992 in the *Explanatory Supplement to the Astronomical Almanac*].
- **Where it wins.** **C1, C7 (partial), C5 (heritage).** Single subtraction for durations. The 4713 BCE anchor is so old that no cultural or political group claims it; functionally neutral. Astronomers have used JDN for Mars-related computation; the heritage of multi-body time-keeping in JDN is real.
- **Where ATS differs.** **C3, C5 (explicit), C6, C8.** JDN expresses days as `2_460_476.5`, a continuous decimal — useful for astronomy, opaque to a human reader. ATS makes the same information positional (`Δ K.H.D.Kin.fffff`) which is *legible* (a human can say "Kilo 20, Hecto 7, Deka 8…"). JDN does not address multi-planetary explicitly; it's de-facto Earth-centric (Julian *date*, on Earth). ATS makes the multi-body extension explicit (`multi-planetary.md`). JDN has no leap-second policy of its own; it inherits from UTC or TAI depending on the variant.

### 2.3 GPS Time

- **Anchor.** 1980-01-06T00:00:00 UTC.
- **Unit.** SI seconds (since GPS week zero); week + second-of-week as wire format.
- **Range.** 10-bit week counter (overflows every ~20 years, see "GPS week rollover" 1999 and 2019); modern receivers use 13-bit or longer.
- **Advocates.** Defined by the GPS operational signal (ICD-GPS-200); used by all GNSS-dependent infrastructure [Misra & Enge 2010].
- **Where it wins.** **C8.** GPS Time is **leap-second-free**: it tracks TAI minus 19 seconds with no smearing. Sub-microsecond precision is the design point.
- **Where ATS differs.** **C5, C6, C7.** GPS Time is Earth-fixed (Earth-orbiting satellites). It has no positional grammar (it's a count of seconds since week zero plus a week index). It is functionally neutral on culture (anchor is an engineering convenience date), but the format is engineer-only. ATS provides positional readout, leap-second smearing options (`manifesto.en.md §8.2`), and multi-planetary extension.

### 2.4 TAI (International Atomic Time)

- **Anchor.** 1958-01-01T00:00:00 UT (TAI = UTC at that instant, by definition).
- **Unit.** SI seconds, with no leap seconds — TAI runs uniformly.
- **Range.** Practically unbounded.
- **Advocates.** Defined by BIPM; the master reference for SI time [BIPM CCTF 1971; Allan, Ashby & Hodge 1997].
- **Where it wins.** **C8.** TAI is the deepest deterministic time scale available. No leap seconds, no smearing, no policy choices.
- **Where ATS differs.** **C5, C6, C7 (partial).** ATS-UTC is the v0.7 default; an ATS-TAI variant is reserved (`manifesto.en.md §8.3`) for future use, particularly for aerospace and high-precision science. For most software use, ATS-UTC suffices because the difference is bounded (currently 37 seconds and accumulating).

### Family A summary

The Unix Epoch, JDN/MJD, GPS Time, and TAI are the actual functional competitors to ATS. **ATS does not claim to replace them.** It claims to offer a *positional grammar* over the same time axis — a human-readable layer that addresses the cognitive gap between "1750_000_000" (Unix seconds) and a conversational form. The relationship is **complementary**: a system can store Unix seconds and emit ATS for display.

---

## 3. Family B — Calendar reforms (solar optimisation)

Twentieth-century proposals that kept the civil structure (months, weeks) but rationalised its irregularities. None achieved wide adoption.

### 3.1 International Fixed Calendar (IFC)

- **Anchor.** Co-aligned with Gregorian; reform of structure only.
- **Structure.** 13 months × 28 days + 1 "Year Day" (intercalary, blank), + 1 leap day in leap years. Every month identical, every date a fixed weekday. The 13th month named "Sol" was proposed.
- **Advocates.** Auguste Comte (1849, "Positivist calendar"), Moses B. Cotsworth (1902), George Eastman (Eastman Kodak adopted IFC internally 1928–1989) [Eastman 1923 *Yearbook*; Cotsworth 1905 *The Rational Almanac*].
- **Where it wins.** **C3.** Months are regular (28 days, no exceptions). Weekday alignment is permanent — a given date always falls on a given weekday. Statistical comparability across months is preserved.
- **Where ATS differs.** **C1, C5, C6.** IFC keeps months and weeks (calendrical structure → calendar-aware arithmetic still required). It does not address time zones (C2 unaddressed). It does not generalise to other planets. The 28-day month does not match measured biological cycles better than the 30-day month; the unit ladder is unrelated to attention or work-rest research. IFC is a "better Gregorian" — ATS is a different family.
- **Verdict.** IFC remains a better Gregorian for cultures committed to the month/week structure. ATS proposes a structurally different system; the comparison is not "ATS replaces IFC" but "ATS is in a different category".

### 3.2 World Calendar

- **Anchor.** Co-aligned with Gregorian.
- **Structure.** 12 months of 30 or 31 days organised in four equal quarters of 91 days + 1 "Worldsday" (intercalary, blank) + 1 leap day. Every quarter identical; every year identical [Achelis 1937].
- **Advocates.** Elisabeth Achelis (1930), World Calendar Association. The UN Economic and Social Council considered the proposal in 1955 but did not adopt it (the US opposed, citing religious objection to the blank day breaking the 7-day Sabbath cycle).
- **Where it wins.** **C3.** Quarters are regular (91 days, fixed). Date arithmetic simplifies for finance and planning.
- **Where ATS differs.** Same as IFC: months and weeks preserved, no time-zone treatment, no multi-planetary extension, no biological alignment claim.
- **Verdict.** A more conservative IFC. Failed for the same religious-cultural reason that blocks all "blank day" reforms.

### 3.3 Hanke-Henry Permanent Calendar

- **Anchor.** Co-aligned with Gregorian.
- **Structure.** 364 days/year = 52 weeks exactly. Months: 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31. Every 5–6 years, a leap week ("Xtra") is appended in December.
- **Advocates.** Richard Henry & Steve Hanke (Johns Hopkins, 2012) [Henry & Hanke 2012].
- **Where it wins.** **C3 (per-year), C8 (intra-year arithmetic).** Within a year, dates and weekdays are stable; financial calculations simplify (52 weeks × 5 days = 260 trading days per year, exactly).
- **Where ATS differs.** **C2, C5, C6.** The leap week reintroduces multi-year irregularity. Time zones unaddressed. Multi-planetary unaddressed. Biological alignment unaddressed.
- **Verdict.** Hanke-Henry optimises for finance. ATS optimises for distributed computation and multi-planetary use. Both could coexist (Hanke-Henry for human-facing finance, ATS for software-facing computation), but they target different problems.

### 3.4 Pax Calendar

- **Anchor.** Co-aligned with Gregorian.
- **Structure.** 13 months of 28 days + 1 leap week ("Pax") inserted before December in years divisible by 100 unless divisible by 400 (similar to Gregorian leap-year logic).
- **Advocates.** James Colligan (1930). Less widely promoted than IFC; technically similar.
- **Where it wins.** Same as IFC for regular months; cleaner leap-rule than IFC's "blank day" approach.
- **Where ATS differs.** Same as IFC.
- **Verdict.** IFC's lesser-known sibling. Same category, same fate.

---

## 4. Family C — Decimal time experiments

Two prior attempts at decimal time. Their failures are instructive; ATS borrows their wins and avoids their losses.

### 4.1 French Republican Calendar (1793–1805)

- **Anchor.** 1792-09-22 ("Vendémiaire 1, Year I" — the autumnal equinox, the day after the proclamation of the First French Republic).
- **Structure.** 12 months × 30 days + 5 or 6 "sansculottides" at year-end. Each month: 3 décades (10-day weeks). Each day: 10 hours × 100 minutes × 100 seconds (a "decimal day").
- **Advocates.** French National Convention 1793; designed by Charles-Gilbert Romme, Joseph Lagrange, Pierre-Simon Laplace, Gaspard Monge, and others. Used officially 1793–1805; restored briefly under the Paris Commune (1871, 18 days) [Shaw 2011 *Time and the French Revolution*].
- **Why it failed.** Three documented reasons:
  1. **Religious-cultural rupture too sharp.** The 10-day week meant 1 rest day per 10 vs the 7-day week's 1 rest per 7. Workers had less rest, and the Sunday Sabbath was eliminated.
  2. **Decimal time on the clock failed faster than the calendar.** Decimal-time clocks were expensive to manufacture; the population resisted relearning. Napoleon abolished decimal time in 1795, six years before retiring the calendar in 1806.
  3. **Political symbolism.** The calendar was associated with the Terror; its rejection was partly a rejection of revolutionary excess, not of decimal logic.
- **Where ATS borrows.** Decimal time-of-day grammar; positional clarity; commitment to base 10 (`manifesto.en.md §1.1` on engineering rationale).
- **Where ATS diverges.** Three explicit lessons:
  1. **ATS does not legislate rest rhythms** (`manifesto.en.md §13.3`). The Deka is a unit of measurement; the work-rest split is left open (`philosophy.en.md §3.2`).
  2. **ATS does not abolish the 24-hour clock for civil time.** ATS Bloc/Centi/Milli are positional readouts of UTC; existing 24-hour clocks continue to work. Adoption is additive, not subtractive.
  3. **ATS is anchored on a verifiable, non-political event** (Apollo 11 landing day, `manifesto.en.md §2`). The Republican anchor was tied to a regime; ATS's is tied to a species-level act with broad recognition.
- **Verdict.** The Republican Calendar was the first serious decimal time experiment and remains instructive. ATS is its descendant on the technical side and its student on the political side.

### 4.2 Swatch Internet Time (1998)

- **Anchor.** No epoch; the day is divided into 1000 `.beats`. `@000` is midnight at Biel Mean Time (UTC+1). No date system — Gregorian dates retained.
- **Structure.** 1 day = 1000 .beats. 1 .beat = 86.4 seconds (= 1 ATS Centi).
- **Advocates.** Swatch (Swiss watchmaker), with Nicholas Negroponte (MIT) and Yoshiyuki Naito. Promoted as a "universal Internet time" 1998–2000s [Negroponte 1998 *Wired* column].
- **Why it failed.** Three documented reasons:
  1. **Marketing-driven rather than infrastructure-driven.** Pushed by a watchmaker selling decorative pieces, not adopted by Internet standards bodies. No reference implementation in any major OS or programming language.
  2. **Biel Mean Time is Swiss-centric.** A "universal" standard anchored in one country undermines its own universalism. (The same critique applied to UTC vs Greenwich; UTC adopted explicitly to avoid the issue.)
  3. **No date grammar.** Swatch handled only the intra-day fraction. Cross-day arithmetic required reverting to Gregorian. The standard was incomplete.
- **Where ATS borrows.** The intuition that decimal intra-day units are useful; the abolition of time zones (Swatch Internet Time was correct that the Internet needed UTC-only readouts).
- **Where ATS diverges.**
  1. **Universal anchor.** ATS's epoch is UTC, not BMT.
  2. **Complete date grammar.** ATS positional readout covers Kilo to Blink; no Gregorian fallback needed.
  3. **Infrastructure path.** ATS's reference implementations target software interchange (Python, JavaScript), not consumer watches. Software adoption is path-dependent; consumer goods adoption is brand-dependent. The former is the harder but more durable path.
- **Verdict.** Swatch Internet Time was structurally a sketch of ATS's intra-day system, marketed in a way that prevented adoption. ATS is the engineered version: complete, anchored on UTC, with conformance vectors.

---

## 5. Family D — Era and epoch reforms

Three proposals that keep Gregorian structure but shift the epoch / count.

### 5.1 Holocene Era (HE / Human Era)

- **Anchor.** −10_000 BCE (approximate start of the Holocene, the current geological epoch and the start of agriculture).
- **Structure.** Gregorian calendar unchanged; year count shifted by exactly +10 000. 2026 CE = 12026 HE.
- **Advocates.** Cesare Emiliani (1993, *Calendar Reform*) [Emiliani 1993; promoted recently in popular video by Kurzgesagt].
- **Where it wins.** **C6 (archaeological intuition), C7 (no religious anchor).** "Year 12026" places the listener in the long arc of agriculture rather than in a sectarian count. The Holocene anchor is non-political (geological).
- **Where ATS differs.** **C1, C3, C5, C8.** Holocene is a *cosmetic shift* of Gregorian: the same months, weeks, leap rules, and time zones are preserved. None of the underlying computational problems are addressed. Holocene is paint; ATS is structure.
- **Verdict.** Holocene wins on archaeological framing. ATS does not compete with Holocene on that axis; they could coexist (a Holocene year + ATS day count). For most software use, Holocene offers no computational benefit and ATS provides no archaeological benefit.

### 5.2 Cosmic Calendar (Sagan)

- **Anchor.** Big Bang (≈ 13.8 billion years ago), mapped to "January 1 00:00:00".
- **Structure.** All of cosmological history scaled to one calendar year.
- **Advocates.** Carl Sagan, *Cosmos* (1980).
- **Where it wins.** **C7 (cosmological neutrality).** Pure pedagogy; no political or cultural anchor.
- **Where ATS differs.** Cosmic Calendar is a **pedagogical scale**, not a computational time standard. It does not address dates, instants, time zones, or arithmetic. Comparing it to ATS is a category error; included here only because it appears in popular discourse.

### 5.3 Anno Mundi / Anno Hijri (era-counter forms of living cultural calendars)

Hebrew calendar uses Anno Mundi (year from creation: 5786 in 2026). Islamic Hijri calendar uses years from the Hijra (1448 AH in 2026). These are *era counts*, not reform proposals; ATS coexists with them via interop bridges (`code/bridges/hebrew.py`, `islamic.py`).

Where they win: cultural and religious alignment for their communities. Where ATS differs: ATS is **computational**, not cultural; the two serve disjoint purposes. See §7.

---

## 6. Family E — Planetary-specific

### 6.1 Darian Calendar (Mars)

- **Anchor.** Spring equinox of Mars Year 209 (1953-12-19 Earth date in some implementations; varies by Darian variant).
- **Structure.** 24 Martian months (each ~28 sols) + various intercalations to track Mars's 668.59-sol year. Seven-sol weeks. Designed to feel familiar to Earth-acclimatised humans on Mars.
- **Advocates.** Thomas Gangale (1985; refined 1986, 2006) [Gangale 1986 *Journal of the British Interplanetary Society*].
- **Where it wins.** **C6 (for Mars settlers).** Darian's month and week boundaries are tuned to Mars's local seasons. For agriculture, festivals, and biological rhythms on Mars, Darian is more meaningful than any Earth-anchored standard.
- **Where ATS differs.** **C5 (explicit), C2.** Darian is *local* — useful only on Mars. ATS-Mars (`multi-planetary.md`) provides a parallel coordinate system that aligns Mars time with the universal ATS counter, enabling Earth-Mars synchronisation. The two could coexist on Mars: Darian for civil and biological purposes, ATS-Mars for inter-planetary coordination.
- **Verdict.** Use Darian for Martian agriculture and festivals; ATS for Earth-Mars communication. The relationship is **complementary**.

### 6.2 Sol counters (mission-specific)

NASA missions (Viking, Mars Pathfinder, MER, Curiosity, Perseverance) use linear sol counters from landing: "Sol 1, Sol 2, …". These are mission-private timekeeping; they do not propose a general standard.

- **Where they win.** Pure simplicity; one counter per mission.
- **Where ATS differs.** ATS-Mars uses a *shared* epoch (Mars Pathfinder landing, 1997-07-04, per `multi-planetary.md`) so cross-mission and Earth-Mars arithmetic is universal. Mission sol counters are per-mission silos.

---

## 7. Family F — Living cultural and religious calendars (interoperated, not compared)

The Hebrew (lunisolar), Islamic (lunar Hijri), Hindu (multiple regional lunisolar systems), Chinese (lunisolar), Bahá'í (solar 19×19), Mayan Long Count (linear count of days from 3114 BCE), Persian (solar), Ethiopian (solar), and many others are **living systems serving cultural and religious functions**. They are not in the same comparison space as ATS.

- ATS is computational and culturally neutral by design (`philosophy.en.md §5.4`).
- Living cultural calendars carry religious, agricultural, and identity functions that ATS explicitly does not address (`manifesto.en.md §13`).
- The relationship is **interoperation**: every ATS instant maps to an instant in any cultural calendar via bridges. The reference implementation includes five bridges (Hebrew, Islamic, Chinese, Hindu, Mayan) in `code/bridges/*.py`.

Including these calendars in a "comparison" matrix would be a category error. They are not competing for the same role ATS fills; they coexist with it.

---

## 8. Where alternatives win — honest concessions

ATS does not claim total superiority. The following are criteria on which other systems beat ATS today, with no quibble:

- **Adoption inertia (C4):** Unix Epoch wins decisively. Half a century of deployed devices, billions of timestamps in production. ATS is pre-v1.0; its deployed base is the reference implementations + this site. Any honest assessment ranks ATS as "early adopter only" on C4 today.
- **Astronomical heritage (C4 in a specific niche):** Julian Day Number wins. Astronomers have used JDN since 1583; every star catalogue, ephemeris, and orbit propagator emits JDN. ATS does not compete in this niche; it complements (an astronomer can store JDN and emit ATS for inter-domain communication).
- **Cultural alignment within communities (C7 for that community):** Hebrew, Islamic, Hindu, Chinese, and other cultural calendars win within their adopting communities. ATS is culturally neutral *globally* but is not culturally aligned with any specific community. This is by design (`manifesto.en.md §2.3 Attack A`); it is also a real cost for adoption within those communities.
- **Weekday stability (C3 for liturgical use):** International Fixed Calendar and World Calendar win. The 7-day liturgical week, mapped to fixed dates, simplifies recurring religious observance. ATS deliberately abandons the 7-day week as a normative unit; communities that need it use the Gregorian calendar in parallel.
- **Financial calendar alignment (C3 for finance):** Hanke-Henry wins for financial-quarter reporting. ATS's Hecto is close (100 days ≈ 1 financial quarter) but not identical; financial systems already calibrated to Hanke-Henry-like patterns gain little from switching to ATS Hecto.
- **Local Martian agriculture and ecology (C6 for Mars):** Darian Calendar wins. Mars settlers planting crops will care about Martian seasons, not Earth-centric units. ATS-Mars provides the *coordinate system* for inter-planetary work; Darian provides the *civil calendar* for local life.
- **Pedagogical reach (C7 for cosmic discourse):** Cosmic Calendar (Sagan) wins. ATS does not offer a 13.8-billion-year scaled pedagogy; it operates on the human time scale.

ATS wins on a different and specified set: **C1 (computational simplicity), C2 (time-zone elimination), C5 (multi-planetary generality), C6 (biological alignment), C8 (precision contract)**. It is the system that **maximally combines** these five criteria. For use cases where any subset of these dominates, ATS is the best engineered option in v0.7. For use cases dominated by C4 (inertia) or community-specific C7, ATS does not yet win, and may never win.

---

## 9. Anticipated objections

### 9.1 "Your comparison omits the actual incumbent — the Gregorian calendar."

Gregorian is the baseline against which all the §3 reforms are defined (IFC, World, Hanke-Henry, Pax all start "co-aligned with Gregorian"). The standard is implicit in §3. Explicitly: Gregorian wins on **C4 (decisive)** and **C7 (within Christian-derived societies)**. ATS wins on **C1, C2, C5, C6, C8**. The Gregorian calendar continues to work for agricultural, ecclesiastical, and civic purposes; ATS provides parallel coordinates for computational and multi-planetary purposes. See `philosophy.en.md §1` for the full argument.

### 9.2 "You omit Unix Epoch and Julian Day Number — the real cousins of ATS."

§2.1 and §2.2 cover both extensively. ATS is *positioned* against them in the same family, with explicit concessions on adoption (Unix) and astronomical heritage (JDN). ATS does not claim to replace either; it claims to offer a *positional grammar* over the same time axis.

### 9.3 "The verdict column is cherry-picked."

The verdicts in §3–6 use the C1–C8 criteria stated in §1. Each comparison cites the criterion on which ATS differs. Where alternatives win on a criterion, §8 concedes it explicitly. If a reader disagrees with a specific verdict, the C-criterion that grounds it is identifiable and the objection becomes specific rather than rhetorical.

### 9.4 "Decimal time was tried in 1793 and failed. ATS will fail too."

§4.1 documents the three reasons for the Republican failure (religious-cultural rupture, decimal-clock manufacturing cost, political symbolism) and the three lessons ATS draws from them:
1. ATS does not legislate rest rhythms.
2. ATS does not abolish 24-hour civil clocks.
3. ATS's anchor is non-political (`manifesto.en.md §2.3`).
None of the 1793 failure modes apply to ATS. The 1793 failure is a *constraint* on the design space (which ATS respects), not a *proof* against decimal time.

### 9.5 "Swatch Internet Time failed in 1998. ATS will fail too."

§4.2 documents the three reasons for Swatch's failure (marketing-only push, Swiss-centric anchor, no date grammar) and the three differentiations of ATS (universal anchor, complete grammar, infrastructure path). Swatch was a sketch; ATS is the engineered version with conformance vectors and reference implementations.

### 9.6 "Hanke-Henry has actual financial backing (Johns Hopkins); ATS doesn't."

Backing has not produced adoption: Hanke-Henry was proposed in 2012 and has no deployed users 14 years later. The adoption mechanism for ATS is open-source-software-style, not academic-endorsement-style: reference implementations, conformance suites, public RFC process (`manifesto.en.md §16`). The two strategies are different; both are unproven for time standards in the 21st century.

### 9.7 "Holocene Era is intuitive (you are in year 12026 of agriculture). ATS isn't."

Holocene wins on archaeological intuition (§5.1). ATS does not compete on that axis. A community that prefers a 12026 HE year count and an ATS day count can have both: Holocene is purely a year-count shift, and ATS coexists.

### 9.8 "Why are the Hebrew, Islamic, Chinese, Hindu, Bahá'í, Mayan, Persian, Ethiopian, etc., calendars not in your comparison?"

§7 addresses this directly. These are **living systems** serving cultural and religious functions ATS does not address. The relationship is **interoperation, not comparison**. The reference implementation provides five bridges (`code/bridges/*.py`); the standard does not propose to displace any of them. Treating a religious calendar as a "competitor" to a computational standard is a category error.

### 9.9 "ATS is presented as universal but is actually Western-engineered."

The Apollo 11 anchor is American in origin (`manifesto.en.md §2.3 Attack A`). The unit naming (Kilo, Hecto, Deka, Centi, Milli) is from the SI prefix family, also Western-origin. The standard is open to RFC process from any community (`manifesto.en.md §16.2`). The cultural neutrality claim (C7) is **functional**: ATS does not embed religious or national content in its semantics. The origin of the *editors* is acknowledged; the *standard* is portable.

---

## 10. Summary

The table below scores each alternative on the C1–C8 criteria. **+** = clearly wins, **−** = clearly loses, **=** = roughly equivalent, **N/A** = criterion does not apply.

| Standard | C1 Comp | C2 TZ | C3 Reg | C4 Inertia | C5 Multi-pl | C6 Bio | C7 Neutral | C8 Precision |
|---|---|---|---|---|---|---|---|---|
| **Gregorian** | − | − | − | **+** | − | − | =* | − |
| Unix Epoch | **+** | **+** | **+** | **+** | − | − | **+** | **+** |
| Julian Day | **+** | **+** | **+** | =* | =* | − | **+** | = |
| GPS Time | **+** | **+** | **+** | **+** | − | − | **+** | **+** |
| TAI | **+** | **+** | **+** | =* | − | − | **+** | **+** |
| IFC / World / Pax | − | − | **+** | − | − | − | − | − |
| Hanke-Henry | − | − | =* | − | − | − | =* | − |
| Republican (1793) | =* | − | **+** | N/A | − | − | − | − |
| Swatch (.beat) | =* | **+** | **+** | − | − | =* | − | − |
| Holocene Era | − | − | − | =* | − | − | **+** | − |
| Cosmic (Sagan) | N/A | N/A | N/A | N/A | N/A | N/A | **+** | N/A |
| Darian (Mars) | − | − | =* | − | =* | =*-on-Mars | =* | − |
| **ATS v0.7** | **+** | **+** | **+** | − | **+** | **+** | **+** | **+** |

*Notes:*
- C7 for Gregorian is "=" rather than "−" because, while the Gregorian *origin* is sectarian (calendar of the Catholic Church, anchored on Christ), the *current global usage* has detached the count from the origin for most users (the year 2026 is just a number; few users invoke Christ when saying it).
- C6 (biological alignment) for Unix Epoch and JDN is "−" because they have *no* positional readout; the question doesn't apply meaningfully. ATS's positional readout is the differentiator.

**ATS is the unique system in this comparison that scores positively across {C1, C2, C5, C6, C8} simultaneously.** Its weakness is C4 (adoption), which is path-dependent and addressable only over time and by the cumulative engineering of reference implementations, bridges, and conformance vectors.

This annex is offered as the comparative argument for ATS, presented honestly. The marketplace of standards will judge; the engineering case is on the record.

---

## References

- Achelis, E. (1937). *The Calendar for the Modern Age*. Putnam.
- Allan, D. W., Ashby, N., & Hodge, C. C. (1997). *The Science of Timekeeping* (Hewlett-Packard Application Note 1289).
- BIPM (1971). *CCTF Recommendation: Time scale TAI*. Bureau International des Poids et Mesures.
- Cotsworth, M. B. (1905). *The Rational Almanac*. Cotsworth Educational Publishing.
- Doggett, L. E. (1992). *Calendars*. In Seidelmann (Ed.), *Explanatory Supplement to the Astronomical Almanac*. University Science Books.
- Eastman, G. (1923). *Eastman Kodak Yearbook* (description of internal IFC adoption).
- Emiliani, C. (1993). *Calendar Reform*. Nature, 366, 716.
- Gangale, T. (1986). *Martian standard time*. Journal of the British Interplanetary Society, 39, 282–288.
- Gangale, T. (2006). *The Darian calendar for Mars*. ASCE Engineering, Construction, and Operations in Challenging Environments.
- Henry, R. C., & Hanke, S. H. (2012). *The Permanent Earth Calendar (Hanke-Henry)*. Johns Hopkins.
- Lewine, D. (1991). *POSIX Programmer's Guide*. O'Reilly. (Description of POSIX time semantics.)
- Misra, P., & Enge, P. (2010). *Global Positioning System: Signals, Measurements, and Performance* (2nd ed.). Ganga-Jamuna Press.
- Negroponte, N. (1998). *Beyond digital* (column on Swatch Internet Time). *Wired*, 6.12.
- Sagan, C. (1980). *Cosmos*. Random House. (Chapter on the Cosmic Calendar.)
- Scaliger, J. J. (1583). *De emendatione temporum*. (Origin of Julian Day Number.)
- Shaw, M. (2011). *Time and the French Revolution: The Republican Calendar, 1789–Year XIV*. Boydell Press.

This annex makes no original empirical claim. All claims about competing systems are sourced or labelled as the editors' assessment. Readers identifying weak comparisons, missing alternatives, or contested verdicts are invited to open an issue at the canonical location (`manifesto.en.md §16.1`).
