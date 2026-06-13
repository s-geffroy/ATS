# ATS Conventions — non-normative annex

> **Non-normative annex.** Nothing in this document is **required** by the Δ ATS spec. An implementation conformant to `manifesto.en.md` may ignore it entirely. It documents **observed, recommended, or experimental social conventions** — useful for adoption, outside the conformance contract.

**Status:** v0.6+
**Symbol:** Δ
**Normative reference:** `manifesto.en.md`

---

## 1. Celebration cycles

### 1.1 Kilo-versary (Δ K.0.0.0)

A **Kilo-versary** marks the passage of one full Kilo — 1 000 days since a counter's epoch (ATS instant), or since a personal instant (birth date, organization founding, project start).

- Humanity's first Kilo-versary (Apollo 11 anchor): **Δ 1.0.0.0 = 1972-04-15** (UTC). See timeline page.
- The n-th personal Kilo-versary: add `n × Δd 1.0.0.0` to the reference date.
- **Short form:** `Δ K!` (e.g. `Δ 22!` for the 22nd Kilo-versary).

### 1.2 Hecto-feast (Δ K.H.0.0)

A **Hecto-feast** marks the passage of one Hecto (100 days). More frequent than a Kilo-versary (~3.3 per Gregorian year), proposed as a **decimal-quarterly rhythm** with no dependency on astronomical seasons.

- For civilization: Hecto-feast `Δ 0.1.0.0` = **1969-10-28** UTC.
- For a personal counter: `Δ k.h.0.0` is a Hecto-feast (h ≠ 0) or a Kilo-versary (h = 0).

### 1.3 Deka-day (Δ K.H.D.0)

Optional — a **Deka-day** (10 days) can serve as a "decade" cycle midway between a week and a month. Suggested in contexts where the 7+3 rhythm (§2) is used.

---

## 2. The 7+3 rhythm on the Deka

A **Deka** is 10 days. The **7+3 rhythm** is an optional social convention that slices a Deka into:

- **7 active days** (work, school, engagement).
- **3 rest days** (recovery, family, personal projects).

| Position in the Deka | Position | Proposed role |
|---|---|---|
| 1, 2, 3, 4, 5, 6, 7 | Active phase | Work, school, projects |
| 8, 9, 0 | Rest phase | Recovery, social, personal |

Compared to the Gregorian 5+2 week, the 7+3 keeps a close ratio (70 % active vs 71 %) while aligning naturally with the decimal clock: one Hecto = 10 Dekas = 10 complete cycles.

**This convention is not required.** A conformant implementation may translate ATS durations into any local rhythm (weekly Sabbath, Fri-Sun, 10-day market cycle, etc.).

---

## 3. Local solar bands (08–22)

The site's analog dial (cf. `analog-clock.en.md`) draws, for each city, an **arc** corresponding to its 08:00 → 22:00 local active day. This annex formalizes that social convention:

| Section | Local time | Label | Arc style |
|---|---|---|---|
| Morning | 08:00–12:00 | `morning` | dashed |
| Noon | 12:00–14:00 | `noon` | solid |
| Afternoon | 14:00–18:00 | `afternoon` | dotted |
| Evening | 18:00–22:00 | `evening` | dash-dot |

**Why 08–22?** Empirical compromise between:

- WHO healthy-sleep guidelines (7–9 h adult, recommended 22:00–07:00),
- standard commercial opening hours (08:00–22:00 in Europe / Americas),
- the range of school commute windows (08:00–18:00).

**This convention is not required by the spec.** It only serves to visualize the "active day" per timezone on the analog dial. An implementation may choose other bounds (06–20, 09–23, etc.) — when it does, it is recommended to document the choice in the SVG's `aria-describedby` attribute.

---

## 4. Personal counters

Any personal ATS instant (`Δ_self`) can be used as a new local epoch to compute an **ego-centered** counter:

```
Δd_age = Δ_now − Δ_self
```

Examples:

- "I have lived Δd 18.5.4.2.50000" = a personal instant relative to one's own birth.
- "This project has Δd 0.2.4.7.00000" = 247 days since launch.

The site's "Mon âge" / "My age" calculator (`age.html`) implements this convention by exporting Kilo-versaries and Hecto-feasts in `.ics` format.

---

## 5. Ritual milestones

A few notable milestone suggestions, with no normative value:

- **Δ 100** (original Hecto-feast, 1969-10-28) — anniversary of "lunar" humanity.
- **Δ 1000** (1st Kilo-versary, 1972-04-15) — first post-landing millennium.
- **Δ 10000** (Δ 10.0.0.0, 1996-12-04) — first decade of Kilos.
- **Δ 20000** (Δ 20.0.0.0, 2024-04-23) — twentieth Kilo, ATS generation.
- **Δ 50000** (Δ 50.0.0.0, 2106-08-22) — first half of a centi-Kilo.

Implementations are free to compute their own milestones via §11.4 (Δ/Δd algebra).
