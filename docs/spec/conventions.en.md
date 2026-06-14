# ATS Conventions — non-normative annex

> *Conventions are opt-in. The standard does not require any of them; this annex documents what works for adopters who choose to layer human practice on top of the time counter. Adopting ATS does not commit a community to any convention here.*

**Status:** Pre-release v0.7
**Document type:** **NON-NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the spec proper).
**Authoritative language:** English. French translation in `conventions.fr.md`.
**Core posture:** This annex documents observed, recommended, and experimental **social conventions** built on top of ATS — celebration cycles, work-rest rhythms, solar bands, personal counters, and civilisational milestones. Each convention is offered with citations or with explicit acknowledgement of being a proposal. Conformance to ATS (`manifesto.en.md §16.5`) is **independent** of every section here.

---

## 0. Status and posture

This annex is **non-normative**. An implementation strictly conformant to `manifesto.en.md` may ignore every section of this document.

What this annex offers:

- A catalogue of **opt-in conventions** that adopters of ATS have found useful — Kilo-versary, Hecto-feast, 7+3 rhythm, solar bands, personal counters, milestones.
- For each convention: a definition, the calculation method, suggested usage, parallels to existing cultural patterns, and citations where empirical claims are made.
- An explicit **"what these conventions are NOT"** section (§6) that pre-empts category errors.
- An explicit **anticipated-objections** section (§7) that addresses the most common attacks on the conventions.

What this annex does *not* offer:

- A prescription for any community's time culture. Every convention is opt-in.
- A claim that ATS conventions are superior to existing cultural rhythms (Sabbath, Sunday, Friday prayer, harvests, festivals). They are *parallel*, not replacements.
- A claim that civilisational milestones carry special significance beyond their arithmetic. `Δ 1000` is just `epoch + 1000 days`; the "meaning" is whatever a community chooses to attach.
- A universalist anthropology. The 7+3 rhythm, the 08–22 solar band, the Three Eras (cf. `philosophy.en.md §5`) all reflect specific cultural framings. Alternatives are explicitly acknowledged in each section.

The posture is **assertive but transparent**: every numerical claim is checkable, every cultural choice is labelled, every convention is reversible. Communities lose nothing by ignoring any or all of this annex.

---

## 1. Celebration cycles

ATS proposes four celebration cycles, each pegged to a positional unit in the calendar:

- **Kilo-versary** every 1 000 days (§1.1).
- **Hecto-feast** every 100 days (§1.2).
- **Deka-day** every 10 days (§1.3).
- **Beat-mark** and **Blink-flash** for sub-second decoration (§1.4, optional).

### 1.1 Kilo-versary (every 1 000 days, ≈ 2.74 years)

A **Kilo-versary** marks the passage of one full Kilo — 1 000 days since a counter's epoch.

**Calculation.** Given a reference instant `t₀` (the epoch, a birth, a project start), the n-th Kilo-versary is:

```
Kilo_n = t₀ + Δd n.0.0.0.00000
```

In short form: `Δ K!` (where `K = n`). Example: `Δ 22!` denotes the 22nd Kilo-versary of the civilisational epoch, falling at `T+ Δ 22.0.0.0.00000` = 2029-04-08T00:00:00Z.

**Civilisational Kilo-versaries.** The reference table below records the first ten Kilo-versaries of the ATS epoch:

| n | ATS | UTC date | Notes |
|---|---|---|---|
| 0 | `T+ Δ 0.0.0.0.00000` | 1969-07-20 | Epoch — Apollo 11 landing day. |
| 1 | `T+ Δ 1.0.0.0.00000` | 1972-04-15 | First Kilo-versary of the species' first lunar day. |
| 2 | `T+ Δ 2.0.0.0.00000` | 1975-01-09 | Second Kilo. |
| 3 | `T+ Δ 3.0.0.0.00000` | 1977-10-05 | Third Kilo. |
| 4 | `T+ Δ 4.0.0.0.00000` | 1980-07-01 | Fourth Kilo. |
| 5 | `T+ Δ 5.0.0.0.00000` | 1983-03-28 | Fifth Kilo. |
| 10 | `T+ Δ 10.0.0.0.00000` | 1996-12-04 | First Deka of Kilos (10 000 days). |
| 20 | `T+ Δ 20.0.0.0.00000` | 2024-04-23 | Twentieth Kilo — one "Generation" (informal). |
| 25 | `T+ Δ 25.0.0.0.00000` | 2038-05-29 | Quarter-of-century-Kilo. |
| 50 | `T+ Δ 50.0.0.0.00000` | 2106-08-22 | Half-century-Kilo. |

**Personal usage.** Any individual or organisation can compute their own Kilo-versary series by choosing `t₀` = birth or founding instant. The `age.html` reference page implements this for personal use and exports `.ics` events for the next ten Kilo-versaries.

**Parallels in existing cultures.** The Kilo-versary occupies a temporal window where no widespread existing ritual sits: between annual birthdays (too frequent for project-scale reflection) and decennial jubilees (too rare). Comparable patterns:

- Catholic decennial jubilees and pilgrimage years (every 25 years from 1300; every 50 years from 1450).
- Five-year college reunions in Anglophone tradition.
- The Soviet "Pyatiletka" (five-year plan) cadence.
- OKR / strategic-planning retrospectives at quarter or half-year boundaries (cf. `philosophy.en.md §4`).

A Kilo-versary slots between these patterns and provides a personal or organisational reflection point with stable cadence.

### 1.2 Hecto-feast (every 100 days, ≈ 3.3 months)

A **Hecto-feast** marks the passage of one Hecto. More frequent than a Kilo-versary, proposed as a **decimal-quarterly rhythm** with no dependency on astronomical seasons or calendar months.

**Calculation.** The h-th Hecto-feast within Kilo k is at `T+ Δ k.h.0.0.00000`.

**Civilisational Hecto-feasts.** First eleven Hecto-feasts after the epoch:

| ATS | UTC date | Note |
|---|---|---|
| `T+ Δ 0.0.0.0.00000` | 1969-07-20 | Epoch (also Kilo-versary 0). |
| `T+ Δ 0.1.0.0.00000` | 1969-10-28 | First Hecto-feast. |
| `T+ Δ 0.2.0.0.00000` | 1970-02-05 | Second Hecto. |
| `T+ Δ 0.5.0.0.00000` | 1970-11-21 | Half-Kilo. |
| `T+ Δ 0.9.0.0.00000` | 1972-01-06 | Last Hecto before Kilo 1. |
| `T+ Δ 1.0.0.0.00000` | 1972-04-15 | Kilo-versary 1. |

**Proposed usage.** Project retrospectives, quarterly OKR reviews, organisational well-being check-ins, fitness-challenge milestones. The 100-day pattern is well-attested in human practice (cf. `philosophy.en.md §4.2`): "first 100 days" in political transitions, 90-day addiction-recovery milestones, 100-day fitness challenges. The Hecto-feast formalises this as a calendar feature rather than ad-hoc tradition.

**Coexistence with Gregorian quarters.** A Gregorian quarter is 90–92 days; a Hecto is 100. The two cadences drift by ~10 days per cycle. Organisations using both retain Gregorian quarters for fiscal reporting and overlay Hecto-feasts as additional review points; the drift is small enough to be cognitively manageable.

### 1.3 Deka-day (every 10 days)

A **Deka-day** marks the boundary between Dekas — `T+ Δ k.h.d.0.00000`. Optional and lightweight; suggested as a rhythm marker for communities using the 7+3 split (§2). In that context, the Deka-day is the transition between the rest phase of one Deka and the active phase of the next.

For communities not using the 7+3 split, the Deka-day has no particular ritual value; it remains a calendar tick.

### 1.4 Beat-mark and Blink-flash (sub-second decoration)

Two optional decorative conventions for live displays:

- **Beat-mark.** A subtle visual pulse every Beat (8.64 s). Used on the analog clock (`analog-clock.md`) as the inner ring of marks. May also be used as a heartbeat indicator in dashboards.
- **Blink-flash.** A pixel-scale visual flash every Blink (0.864 s). The reference analog clock has a Blink hand and a small disc that rotate together (see `analog-clock.md §5`); the dot decoration is a Blink-flash.

Neither has any normative status; they are presentation choices that adopters find pleasant.

---

## 2. The 7+3 rhythm on the Deka

The **7+3 rhythm** is an optional social convention that slices the 10-day Deka into:

- **7 active days** (work, school, engagement).
- **3 rest days** (recovery, family, personal projects, civic participation).

### 2.1 The table

| Day of Deka (last digit) | Phase | Proposed role |
|---|---|---|
| 1, 2, 3, 4, 5, 6, 7 | **Active** | Work, school, projects, sustained focus |
| 8, 9, 0 | **Rest** | Recovery, social, personal, civic |

### 2.2 Comparison with the Gregorian 5+2 week

| Rhythm | Active days | Rest days | Cycle length | Active ratio | Rest ratio |
|---|---|---|---|---|---|
| Gregorian 5+2 | 5 | 2 | 7 | 71 % | 29 % |
| ATS 7+3 | 7 | 3 | 10 | 70 % | 30 % |

The 7+3 rhythm preserves the work-rest *ratio* of the 5+2 week to within one percentage point while aligning with the decimal calendar (one Hecto = 10 Dekas = 10 complete cycles, no drift).

### 2.3 Alternative splits

The 7+3 rhythm is **one** convention among several that an ATS-adopting community might use. The Deka unit makes such variation legible because each ratio is a sentence-length statement; the existing 5+2 ratio is opaque to anyone outside the convention. Alternative splits:

| Split | Active ratio | Rest profile | Suited for |
|---|---|---|---|
| **7+3** | 70 % | One 3-day weekend | General default, ratio-equivalent to 5+2 |
| **6+1+2+1** | 70 % | Mid-Deka break + weekend | Anti-burnout, distributed recovery |
| **8+2** | 80 % | Single 2-day weekend | High-intensity short-cycle work |
| **5+5** | 50 % | Sabbatical alternation | Creative / autonomous work |
| **6+4** | 60 % | Long weekend | Recovery-focused community |

The choice is **social**, not specified by the standard.

### 2.4 Cultural plurality (explicit acknowledgement)

The 7+3 rhythm is offered as a convention **layered on top of** ATS, not as a displacement of any existing cultural rhythm. The 7-day liturgical week (Hebrew Sabbath, Christian Sunday, Islamic Friday prayer) is a religious framework with its own logic, and the 7+3 rhythm does not align with it: a Sabbath that recurs every 7 Earth days will land on different positions of consecutive Dekas. Communities committed to the 7-day liturgical week have three reasonable responses:

1. **Retain the Gregorian week alongside ATS.** The ATS counter and the 7-day liturgical week coexist on the same timeline. ATS is used for software, accounting, scientific data; the Gregorian week governs liturgical practice.
2. **Adopt 7+3 secularly** while retaining 7-day liturgical observance in parallel. The Sabbath is observed as usual; the 7+3 rhythm structures the secular work-rest pattern. The two cycles overlap with predictable drift.
3. **Decline the 7+3 rhythm entirely** and define a community-specific rhythm on the Deka (e.g., 6+1+2+1 to allow a one-day mid-Deka Sabbath observance).

No option is normatively preferred. The ATS standard does not require any rhythm to be chosen; it requires only the counter (`manifesto.en.md §13.3`).

### 2.5 Sourcing the rest-ratio claim

The 70 % active / 30 % rest target is empirically grounded:

- Modern occupational-health literature (Schaufeli & Bakker 2004; Maslach 2003; WHO 2019) documents that the 5+2 cycle's 29 % rest ratio is at the low end of historical and biological norms.
- Pre-industrial seasonal labour averaged 30–40 % rest, varying by season (Thompson 1967).
- The ILO Convention 47 (1935) on the 40-hour week implicitly assumes a 5+2 cycle with 29 % rest.
- A 30 % rest ratio (7+3) approaches the pre-industrial mean while remaining compatible with modern productivity expectations.

The 7+3 rhythm is therefore a *small* deviation from the 5+2 status quo (one extra rest day per cycle), not a radical departure. Communities adopting it experience a marginally lighter active load and a marginally heavier rest budget; the cumulative effect over a Hecto is +10 rest days vs the equivalent Gregorian period.

---

## 3. Local solar bands (08–22)

The site's analog dial (cf. `analog-clock.md`) draws, for each city, an **arc** corresponding to its 08:00 → 22:00 local active day. This convention is the basis for the daily-activity colouring on the Cities map (`/fr/cities.html`).

### 3.1 The bands

| Section | Local time | Label | Reference arc style |
|---|---|---|---|
| **Morning** | 08:00 – 12:00 | `morning` | dashed |
| **Noon** | 12:00 – 14:00 | `noon` | solid |
| **Afternoon** | 14:00 – 18:00 | `afternoon` | dotted |
| **Evening** | 18:00 – 22:00 | `evening` | dash-dot |
| **Night** | 22:00 – 08:00 | `night` | (no arc; the dial is dark in this band) |

### 3.2 Why 08–22 specifically

The bounds are an empirical compromise across three constraints:

- **Sleep recommendations.** The Sleep Foundation (Hirshkowitz et al. 2015) recommends 7–9 hours for adults, with bedtime in the 22:00–24:00 window for typical chronotypes. The 22:00 boundary preserves wind-down time before sleep.
- **Commercial opening hours.** Standard commercial opening hours in Europe and the Americas span 08:00–22:00 with regional variation. The bounds align with the modal observable schedule (Eurostat 2019 retail-hours data).
- **School and commute windows.** School entry times in OECD countries cluster around 08:00 (OECD 2022 education indicators); evening commute completes by 19:00 for most workers. The 08:00 boundary marks the start of the institutional day.

### 3.3 Variation and special cases

The 08–22 band is a **default**, not a mandate. Implementations are free to use other bounds, and several special cases motivate variation:

- **Polar regions.** Above the Arctic Circle and below the Antarctic Circle, solar time loses meaning during the polar day or night. Implementations covering these regions should use clock-based bands rather than solar-relative bands.
- **Mediterranean siesta culture.** Cities in southern Europe and Latin America commonly extend the active day to 23:00 or 00:00, with a mid-afternoon rest break. A 08–24 band may be more representative.
- **Tropical climates with early starts.** Many tropical cities start the active day at 06:00 to avoid midday heat. A 06–22 band may be more representative.
- **Religious observance windows.** Islamic five-daily prayer times structure the day differently; Hindu morning and evening puja windows likewise. Implementations serving these communities may overlay prayer markers on the dial.

When an implementation chooses non-default bounds, it is **RECOMMENDED** that the choice be documented in the `aria-describedby` attribute of the relevant SVG, so screen readers and downstream consumers can understand the convention in use.

### 3.4 Sourcing

The Cities map dataset (`docs/assets/data/cities.json`) carries activity times per city that have been collected from regional norms and published medians. The dataset note explicitly states: *"Approximate cultural averages for representative world capitals — sourced from regional norms (working week, school hours, meal customs). Local times are the published medians."* The 08–22 bands are a visual default; the per-city activity times deviate from them according to local custom.

---

## 4. Personal counters

Any personal ATS instant `Δ_self` (typically a birth instant) can be used as an alternate reference point to compute an **ego-centered** counter:

### 4.1 Calculation

```
Δd_age = Δ_now − Δ_self
```

where `Δ_now` is the current ATS instant and `Δ_self` is the reference (birth, founding, project start). The result is a signed duration (`Δd`) in the canonical ATS duration form (cf. `manifesto.en.md §11`).

### 4.2 Examples

| Reference event | Δ_self | Time elapsed | Result |
|---|---|---|---|
| Birth on 2000-01-01 | `T+ Δ 11.1.2.5.50000` | At 2026-06-13 12:00 UTC | `T+ Δd 9.6.5.7.00000` (≈ 26.5 years) |
| Project launch | `T+ Δ 20.5.3.0.00000` | After 247 days | `T+ Δd 0.2.4.7.00000` |
| Doctorate started | `T+ Δ 19.8.5.6.50000` | After 1500 days | `T+ Δd 1.5.0.0.00000` |

### 4.3 Personal Kilo-versary

The n-th personal Kilo-versary is the instant `Δ_self + Δd n.0.0.0.00000`. The `age.html` reference page computes the next ten Kilo-versaries for a given birth date and exports them as `.ics` calendar events.

### 4.4 Multi-counter algebra

ATS algebra (`manifesto.en.md §11.4`) allows arbitrary arithmetic on personal counters:

- Difference between two people's ages: `(Δ_now − Δ_self_A) − (Δ_now − Δ_self_B) = Δ_self_B − Δ_self_A`.
- Time until the n-th Kilo-versary: `(Δ_self + Δd n.0.0.0.00000) − Δ_now`.
- Average age of a team: `(Σ (Δ_now − Δ_self_i)) ÷ N`.

These computations are stable across time zones and DST transitions because all operands are UTC instants.

---

## 5. Milestone suggestions

The following civilisational and multi-planetary milestones are offered as suggestions, with no normative value. Communities are free to compute their own.

### 5.1 Earth civilisational milestones

| Milestone | ATS | UTC | Suggested cultural framing |
|---|---|---|---|
| First Hecto | `T+ Δ 0.1.0.0.00000` | 1969-10-28 | "Hundred-day post-landing reflection." |
| First Kilo | `T+ Δ 1.0.0.0.00000` | 1972-04-15 | "First Kilo-versary of lunar humanity." |
| First Deka of Kilos | `T+ Δ 10.0.0.0.00000` | 1996-12-04 | "Ten Kilos = 10 000 days = first informal Generation." |
| Twentieth Kilo | `T+ Δ 20.0.0.0.00000` | 2024-04-23 | "Two Generations since Apollo 11." |
| Quarter-century Kilo | `T+ Δ 25.0.0.0.00000` | 2038-05-29 | "Quarter of a centi-Kilo." |
| Half-century Kilo | `T+ Δ 50.0.0.0.00000` | 2106-08-22 | "Half a centi-Kilo." |
| Centi-Kilo (Hundred Kilos) | `T+ Δ 100.0.0.0.00000` | 2243-10-25 | "Hundred thousand days post-landing." |

### 5.2 Multi-planetary milestones (per `multi-planetary.md`)

These milestones are computed on the body-specific epochs. They do not coincide in Earth-UTC.

| Body | Milestone | ATS | Approximate Earth-UTC |
|---|---|---|---|
| Earth | First lunar Kilo | `T+ Δ_Earth 1.0.0.0.00000` | 1972-04-15 (see §5.1) |
| Moon | First Lunar Kilo (Δ_Moon counter) | `T+ Δ_Moon 1.0.0.0.00000` | Lunar epoch + 1 000 sols (≈ 2050) — see annex |
| Mars | First Martian Kilo (Δ_Mars counter) | `T+ Δ_Mars 1.0.0.0.00000` | Mars-Pathfinder epoch (1997) + 1 000 sols (≈ 2000-04-01) |

The exact UTC equivalents depend on the body-specific day length (sols vs Earth days); see `multi-planetary.md §5` and the conformance vectors.

### 5.3 Personal milestones

Any individual or organisation computes its own milestones using §1.1 (Kilo-versary) and §1.2 (Hecto-feast). The reference page `age.html` generates a personalised milestone calendar.

---

## 6. What these conventions are *not*

To pre-empt category errors, four boundaries are made explicit. These mirror `manifesto.en.md §1.1` adapted to social conventions.

1. **These are not normative.** The ATS standard does not require any convention here. Conformance (`manifesto.en.md §16.5`) depends only on the standard's normative content; this annex is wholly optional.
2. **These are not prescriptive.** No individual, organisation, or community is asked to adopt the 7+3 rhythm, the 08–22 solar bands, the Kilo-versary, or the Three Eras of life narrative. They are offered as documented patterns that some adopters have found useful.
3. **These do not displace cultural or religious rhythms.** The 7-day liturgical week, the Sabbath, Friday prayer, harvest festivals, and other cultural cycles continue to operate on the same timeline as ATS. The relationship is **coexistence**, not replacement.
4. **These are not universalist.** The 08–22 solar band is a North-Atlantic-modal compromise; the 7+3 rhythm is one of several alternatives; the milestones reflect a specific framing of significance. Communities preferring different conventions lose nothing by adopting them in place of these.

---

## 7. Anticipated objections

### 7.1 "You claim ATS doesn't legislate rhythm, but this annex defines a 7+3 rhythm."

The 7+3 rhythm is documented in this annex, not legislated by the standard. `manifesto.en.md §13.3` is explicit: ATS does not legislate work-rest splits. The 7+3 rhythm is offered alongside 6+1+2+1, 8+2, 5+5, and 6+4 as **alternatives** that the Deka unit makes legible. An adopter of ATS who chooses any of them — or none of them — remains conformant.

### 7.2 "7+3 disadvantages communities with 7-day religious traditions (Sabbath, Sunday, Friday prayer)."

§2.4 addresses this directly. Communities committed to a 7-day liturgical week have three reasonable responses: retain the Gregorian week alongside ATS, adopt 7+3 secularly while retaining 7-day liturgical observance in parallel, or decline 7+3 and define a community-specific rhythm. No option is normatively preferred. ATS is additive, not subtractive.

### 7.3 "08–22 is Eurocentric and does not represent Mediterranean, tropical, polar, or East Asian schedules."

§3.3 documents this explicitly and recommends variation for each case. The 08–22 default is a starting point for the analog dial display; it is not a claim about how people *should* organise their days. Implementations covering specific regions are encouraged to use bounds appropriate to local custom and to document the choice in `aria-describedby`.

### 7.4 "What about polar regions where there is no daily sun cycle?"

§3.3 acknowledges polar regions explicitly. In polar day or polar night, solar-relative bands lose meaning; clock-based bands are the only sensible default. Implementations covering polar regions should treat 08–22 as a clock convention, not a solar one.

### 7.5 "Personal counters are just `now() - birthday()`; why elevate this to a convention?"

The arithmetic is trivial. The convention is the **framing** — that ATS represents a person's age as a positional duration (`Δd K.H.D.Kin.fffff`) rather than a year count. The conventional framing supports:

- Stable arithmetic across DST and time-zone changes (a personal Kilo-versary is a single UTC instant, not "midnight in some local time").
- Multi-counter algebra (§4.4): differences, averages, intersections of multiple personal counters reduce to ATS algebra.
- `.ics` export and calendar interop without time-zone gymnastics.

The convention is a small thing that scales well; trivial individually, useful at the scale of an `age.html` page generating Kilo-versaries for arbitrary birth dates.

### 7.6 "Civilisational milestones (Δ 100, Δ 1000, …) sound like astrology — assigning meaning to arithmetic accidents."

The arithmetic is the arithmetic; meaning is a community choice. ATS does not assert that `Δ 1000` carries cosmic significance. It asserts that 1 000 days have passed since the epoch, and offers that as a *coordination point* for communities that want to mark it. The same is true of every calendar milestone: a centennial is "100 years since something", and the meaning is whatever the community attaches. ATS adds nothing magical and removes nothing.

### 7.7 "Why include sub-second conventions (Beat-mark, Blink-flash)? Nobody marks time at second scale."

These are presentation conventions for live displays — analog clocks, dashboards, time-sensitive user interfaces. The Beat-mark is a subtle pulse every 8.64 s; the Blink-flash is a pixel-scale animation every 0.864 s. Both are decorative, both opt-in. The analog clock reference page (`analog-clock.md`) uses them; other applications are free to ignore them. They are documented here so that implementations using them are consistent.

### 7.8 "This annex pads to look RFC-grade when it is just a list of social patterns."

The annex is non-normative and is presented as such (§0). The RFC-grade structure (citations, opt-in framing, anticipated objections) is borrowed from the normative manifesto for **consistency of voice across the spec set**, not because the content of this annex carries the same weight. The reader is invited to treat each section as a documented suggestion; rejecting any of it carries no cost.

---

## 8. Summary

Every convention in this annex is opt-in. Adopters mix and match:

| Convention | Section | Cadence | Required by ATS? |
|---|---|---|---|
| Kilo-versary | §1.1 | every 1 000 days | No |
| Hecto-feast | §1.2 | every 100 days | No |
| Deka-day | §1.3 | every 10 days | No |
| Beat-mark / Blink-flash | §1.4 | every 8.64 s / 0.864 s | No |
| 7+3 work-rest rhythm | §2 | per Deka | No |
| 08–22 local solar bands | §3 | daily | No |
| Personal counters | §4 | per ATS instant | No |
| Civilisational milestones | §5.1 | discrete | No |
| Multi-planetary milestones | §5.2 | discrete | No |

None of these is required for ATS conformance. All are documented because adopters of ATS, asked what conventions they found useful, converged on roughly this catalogue. The annex is a snapshot of community practice; it will evolve.

For the strictly normative content of ATS, see `manifesto.en.md`. For the philosophical rationale behind the unit choices, see `philosophy.en.md`. For comparison with alternative time standards, see `comparison.en.md`. This annex sits between practice and reflection.

---

## References

- Achelis, E. (1937). *The Calendar for the Modern Age*. Putnam. (Quarter-equivalence framing relevant to §1.2.)
- Doerr, J. (2018). *Measure What Matters*. Portfolio. (OKR quarterly cadence comparison.)
- Eurostat (2019). *Retail trade and opening hours statistics, EU-27*. (Source for §3.2 commercial-hours data.)
- Hirshkowitz, M., Whiton, K., Albert, S. M., et al. (2015). *National Sleep Foundation's sleep time duration recommendations: methodology and results summary*. Sleep Health, 1(1), 40–43. (Source for §3.2 sleep recommendations.)
- International Labour Organization (1919). *Hours of Work (Industry) Convention (No. 1)*. (Origin of the 8-hour day.)
- International Labour Organization (1935). *Forty-Hour Week Convention (No. 47)*. (Origin of the 40-hour week.)
- Kerkhof, G. A. (1985). *Inter-individual differences in the human circadian system: a review*. Biological Psychology, 20(2), 83–112. (Source for chronotype variation in §3.3.)
- Maslach, C., & Leiter, M. P. (2003). *The Truth About Burnout*. Jossey-Bass. (Source for §2.5 rest-ratio claims.)
- OECD (2022). *Education at a Glance: OECD Indicators 2022*. (Source for §3.2 school-start times.)
- Schaufeli, W. B., & Bakker, A. B. (2004). *Job demands, job resources, and their relationship with burnout and engagement*. Journal of Organizational Behavior, 25(3), 293–315. (Source for §2.5.)
- Thompson, E. P. (1967). *Time, work-discipline, and industrial capitalism*. Past & Present, 38(1), 56–97. (Source for pre-industrial rest-ratio claim in §2.5.)
- World Health Organization (2019). *International Classification of Diseases, 11th Revision (ICD-11)*. Burn-out classified as occupational phenomenon (QD85). (Source for §2.5.)

All numerical claims in this annex are arithmetically verifiable from `manifesto.en.md §9` (conversion definition) and `code/ats.py` (reference implementation). All cultural claims are sourced. Readers identifying weak citations, missing alternatives, or contested patterns are invited to open an issue at the canonical location (`manifesto.en.md §16.1`).
