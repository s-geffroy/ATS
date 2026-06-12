# Δ ATS — Analog Clock Specification

**Status:** Draft v0.1
**Scope:** Home page (`/en/`, `/fr/`) gains a numeric ↔ analog toggle. This document specifies the analog face only.

---

## 1. Purpose

Offer a familiar circular clock face that reads ATS the same way a Gregorian face reads hours/minutes/seconds — but anchored to the ATS day decomposition (Bloc / Centi / Milli) and respecting the ATS truncation principle (§6 of the manifesto).

## 2. Information shown

| What | Where | Resolution |
|---|---|---|
| Bloc (`0.1` day = 2 h 24 min) | Long hand | 10 positions per day |
| Centi (`0.01` day = 14 min 24 s) | Medium hand | 100 positions per day |
| Milli (`0.001` day = 1 min 26.4 s) | Short hand | 1 000 positions per day |
| Date (`K.H.D.Kin`) | Digital readout, inside the dial at the bottom | Per day |
| Gregorian UTC ISO | Below the dial card | Per second |

Beat (≈ 8.64 s) and Blink (≈ 0.86 s) are **not displayed** — the analog face is intentionally lighter than the canonical digital one.

## 3. Geometry

SVG `viewBox="-110 -110 220 220"`. All radii are in viewBox units.

| Element | Radius | Style |
|---|---|---|
| Outer dial circle | 100 | `stroke: var(--border); stroke-width: 2` |
| Major tick (each `Bloc`) | 84 → 96 | 10 ticks at 36° increments, `stroke: var(--fg); stroke-width: 2` |
| Minor tick (each `Centi` between Blocs) | 91 → 96 | 100 ticks at 3.6° increments, `stroke: var(--fg); opacity: 0.35; stroke-width: 1` |
| Major tick label (digits 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: var(--fg); opacity: 0.7` (sits between the Centi hand tip and the Bloc hand tip) |
| Center pivot disc | 5 | `fill: var(--fg)` |
| Date readout (inside dial) | center at `(0, 60)` | small mono text, 14 px, `var(--fg)` |

**Angle convention.** Position `p` (`0 ≤ p < 10` for the Bloc dial) maps to SVG angle:

```
angle_deg = (p / 10) × 360 − 90     // 0 at top, clockwise
```

## 4. Hands

All hands originate at `(0, 0)` and point outward. Rotation is **clockwise** (Greg convention).

| Hand | Length | Width | Color | Movement |
|---|---|---|---|---|
| **Bloc** | 88 | 4 | `var(--fg)` (foreground) | Snap on Bloc completion (every 2 h 24) |
| **Centi** | 70 | 3 | `var(--accent)` = `#4a6cff` | Snap on Centi completion (every 14 m 24 s) |
| **Milli** | 55 | 1.6 | `color-mix(in oklab, var(--fg) 50%, transparent)` (muted) | Continuous interpolation at 10 Hz |

**Length convention (ATS-native).** Unlike Gregorian (hour < minute < second), the most meaningful unit gets the longest hand: `Bloc > Centi > Milli`. This puts visual weight on the 2 h 24 reading window — the human attention block.

**Color hierarchy.** Bloc is monochrome (foreground), Centi is the brand accent, Milli is desaturated. The brand color emphasizes the social cycle (14 min ≈ academic quarter hour), which is the unit ATS most differentiates from Gregorian.

## 5. Hand-position mathematics

Let `f` ∈ `[0, 1)` be the current day-fraction (`frac / 100_000` from the reference implementation).

```
bloc_pos   = floor(f × 10)              // 0..9       (truncated)
centi_pos  = floor(f × 100) mod 10      // 0..9       (truncated)
milli_pos  = (f × 1000) mod 10          // 0..9       (continuous; not truncated)
```

Hand SVG transforms:

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
```

Each hand is a `<line>` (or `<path>`) initially pointing up; the SVG `transform="rotate(angle, 0, 0)"` is set to the values above on every tick.

**Truncation rule (spec §6).** The Bloc and Centi positions are floor-truncated, so the hands never anticipate the next position. The Milli hand is *continuously interpolated* — a deliberate, documented exception (see §7).

## 6. Center readout

A small element inside the dial at SVG `(0, 60)` shows the date triplet `K.H.D.Kin` in monospace, two digits per "."-separated group. Example:

```
20.7.8.0
```

If `Kilo > 99`, the readout extends to fit; if it would visually collide with the bottom ticks, the SVG `viewBox` shifts to leave room. A small `Δ` glyph precedes the readout for brand consistency:

```
Δ 20.7.8.0
```

## 7. Movement policy

| Hand | Policy | Rationale |
|---|---|---|
| Bloc | **Snap** (floor) | One snap per 2 h 24 — coherent with "counter of completed units" (manifesto §6). |
| Centi | **Snap** (floor) | One snap per 14 min — still coherent; would feel dead if smooth. |
| Milli | **Continuous** (10 Hz interpolation) | Pure floor would tick every 1 min 26 s; that is visible motion, but the face would feel *too* discrete. We accept a small philosophical exception in exchange for the "alive clock" feeling. |

**Strict mode (opt-in).** A checkbox **inside the `<details>` panel** of the clock card lets the user enable strict mode, which snaps the Milli hand as well (no smooth interpolation). The choice is persisted under `localStorage["ats-strict-analog"]`. Default: off (hybrid). The Web Component MAY also expose this as the attribute `<ats-clock face="analog" strict>`.

## 8. Animation

A single `setInterval` at 100 ms (10 Hz) recomputes the three hand angles. Updates skip the SVG `transform` write when the angle has not changed (Bloc/Centi snap), which keeps DOM churn minimal.

Implementations MAY use `requestAnimationFrame` for the Milli hand for sub-frame smoothness; this is purely a rendering optimization and does not affect the ATS values.

## 9. Toggle UX (home page)

The home page renders a segmented control above the clock card:

```
[ Numeric ] [ Analog ]
```

- The choice is persisted in `localStorage` under the key `ats-face`.
- Default is **Numeric** (preserves existing first impression).
- Switching is instantaneous; only one face is rendered at a time.
- The label `Δ ATS (short)` / `Δ ATS (court)` is replaced by `Δ ATS (analog)` / `Δ ATS (analogique)` when the analog face is active.
- All other parts of the clock card (`<details>` with converter and per-unit values) are **shared** between faces and unchanged.

## 10. Accessibility

- The SVG dial has `aria-label="ATS analog clock"` (translated) and `role="img"`.
- The center digital readout carries `role="timer" aria-live="off" aria-atomic="true"` (same policy as the numeric face).
- The segmented toggle is a `<div role="tablist">` containing two `<button role="tab" aria-selected="…">`, with `aria-controls` pointing to the visible face container.
- Keyboard: `←` / `→` cycle between Numeric and Analog when focus is on the tablist; the global `D` / `N` / `L` shortcuts continue to work.

## 11. Non-goals

- No alarm, no chronometer, no countdown — those are out of scope for the home page.
- No timezone display on the analog face — ATS is UTC by spec (§7).
- No DST animation (DST does not exist in ATS).
- No second face (digital + analog stacked) — the user explicitly chose a toggle, not a side-by-side.

## 12. Open questions

- Should the Milli hand pulse (length oscillation) instead of moving continuously? (Punted to v0.2.)
- Should the dial reflect dark / light theme contrast via `currentColor` only, or use distinct palettes? (Currently `var(--fg)` covers both.)
- Strict mode: opt-in attribute or a separate "Settings" affordance? (Not for v1.)
