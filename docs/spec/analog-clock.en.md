# Δ ATS — Analog Clock Specification

**Status:** Draft v0.2
**Scope:** Home page (`/en/`, `/fr/`) gains a numeric ↔ analog toggle. This document specifies the analog face only.

> **v0.2 changes:** 5-hand dial (Beat and Blink now displayed), hand lengths inverted to the classic watchmaker convention (slowest hand is shortest), Blink decorated with a small disc at 80 % of its length, date readout moved above the pivot.

---

## 1. Purpose

Offer a familiar circular clock face that reads ATS the same way a Gregorian face reads hours/minutes/seconds — but anchored to the ATS day decomposition (Bloc / Centi / Milli) and respecting the ATS truncation principle (§6 of the manifesto).

## 2. Information shown

| What | Where | Resolution |
|---|---|---|
| Bloc (`0.1` day = 2 h 24 min) | Shortest hand (slowest) | 10 positions per day |
| Centi (`0.01` day = 14 min 24 s) | Short hand | 100 positions per day |
| Milli (`0.001` day = 1 min 26.4 s) | Medium hand | 1 000 positions per day |
| Beat (`0.0001` day ≈ 8.64 s) | Long hand | 10 000 positions per day |
| Blink (`0.00001` day ≈ 0.864 s) | Longest hand, decorated with a small disc at 80 % of its length | 100 000 positions per day |
| Date (`K.H.D.Kin`) | Digital readout, inside the dial above the pivot | Per day |
| Gregorian UTC ISO | Below the dial card | Per second |

## 3. Geometry

SVG `viewBox="-110 -110 220 220"`. All radii are in viewBox units.

| Element | Radius | Style |
|---|---|---|
| Outer dial circle | 100 | `stroke: var(--border); stroke-width: 2` |
| Major tick (each `Bloc`) | 84 → 96 | 10 ticks at 36° increments, `stroke: var(--fg); stroke-width: 2` |
| Minor tick (each `Centi` between Blocs) | 91 → 96 | 100 ticks at 3.6° increments, `stroke: var(--fg); opacity: 0.35; stroke-width: 1` |
| Major tick label (digits 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: var(--fg); opacity: 0.7` (sits between the Centi hand tip and the Bloc hand tip) |
| Center pivot disc | 5 | `fill: var(--fg)` |
| Date readout (inside dial) | center at `(0, -50)` | small mono text, 14 px, `var(--fg)` (midway between the top `0` and the pivot) |

**Angle convention.** Position `p` (`0 ≤ p < 10` for the Bloc dial) maps to SVG angle:

```
angle_deg = (p / 10) × 360 − 90     // 0 at top, clockwise
```

## 4. Hands

All hands originate at `(0, 0)` and point outward. Rotation is **clockwise** (Greg convention).

| Hand | Length | Width | Color | Movement |
|---|---|---|---|---|
| **Bloc** | 40 | 4 | `var(--fg)` (foreground) | Snap on Bloc completion (every 2 h 24) |
| **Centi** | 55 | 3 | `var(--accent)` = `#4a6cff` | Snap on Centi completion (every 14 m 24 s) |
| **Milli** | 70 | 2 | `color-mix(in oklab, var(--fg) 50%, transparent)` (muted) | Continuous interpolation at 10 Hz (strict-mode snaps it) |
| **Beat** | 82 | 1.4 | `#2bb673` (green) | Continuous interpolation at 10 Hz (strict-mode snaps it) |
| **Blink** | 95 | 1.2 | `#ff5a5a` (red, like a sweep second hand) + filled disc `r=3` at `y=-76` (80 % of length) | Continuous interpolation at 10 Hz (strict-mode snaps it); see §7 for the 864 ms refresh limit |

**Length convention (watchmaker-style).** Hands are ordered by speed: the **slowest unit gets the shortest hand**, the fastest unit gets the longest hand — same convention as a Gregorian watch (hour < minute < second). The longest hand (Blink) carries a small decorative disc that mirrors a sweep second hand's tip ring, making it unambiguous at a glance.

**Color hierarchy.** Bloc is monochrome (foreground), Centi carries the brand accent (`#4a6cff`), Milli is desaturated, Beat is green, Blink is red. Cool-to-warm colors reinforce the visual cue: the warmer the hue, the faster the hand.

## 5. Hand-position mathematics

Let `f` ∈ `[0, 1)` be the current day-fraction (`frac / 100_000` from the reference implementation).

```
bloc_pos   = floor(f × 10)               // 0..9       (truncated)
centi_pos  = floor(f × 100)    mod 10    // 0..9       (truncated)
milli_pos  = (f × 1000)        mod 10    // 0..9       (continuous, unless strict)
beat_pos   = (f × 10 000)      mod 10    // 0..9       (continuous, unless strict)
blink_pos  = (f × 100 000)     mod 10    // 0..9       (continuous, unless strict)
```

Hand SVG transforms:

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
beat_angle_deg  = (beat_pos  / 10) × 360 − 90
blink_angle_deg = (blink_pos / 10) × 360 − 90
```

The Blink decoration (small disc) is part of the same SVG group as the Blink line; rotating the group rotates both. Each line / group is initially pointing up; the SVG `transform="rotate(angle, 0, 0)"` is set to the values above on every tick.

**Truncation rule (spec §6).** The Bloc and Centi positions are floor-truncated, so the hands never anticipate the next position. The Milli / Beat / Blink hands are *continuously interpolated* by default — a deliberate, documented exception (see §7). Strict mode (opt-in) snaps all three to floor positions.

## 6. Center readout

A small element inside the dial at SVG `(0, -50)` shows the date `K.H.D.Kin` in monospace, "."-separated. The position sits midway between the `0` mark at the top of the dial and the central pivot, keeping the lower half free for the longest hands.

```
20.7.8.2
```

A small `Δ` glyph precedes the readout for brand consistency:

```
Δ 20.7.8.2
```

If `Kilo > 99`, the readout extends sideways; the text-anchor stays centered.

## 7. Movement policy

| Hand | Policy | Rationale |
|---|---|---|
| Bloc | **Snap** (floor) | One snap per 2 h 24 — coherent with "counter of completed units" (manifesto §6). |
| Centi | **Snap** (floor) | One snap per 14 min — still coherent; would feel dead if smooth. |
| Milli | **Continuous** (10 Hz interpolation) | Pure floor would tick every 1 min 26 s; visible, but too discrete for the "alive clock" feeling. |
| Beat | **Continuous** (10 Hz interpolation) | Same rationale as Milli at a faster timescale. |
| Blink | **Continuous** (10 Hz interpolation) — see limit below | Same rationale; provides a fast, eye-catching sweep cue. |

**Blink refresh limit.** Because `frac` has 5 decimals (resolution 0.864 s), the Blink position only changes when `frac` actually increments — about once every 864 ms. At a 100 ms (10 Hz) tick rate, the Blink hand therefore visually jumps once per `frac` tick even in "continuous" mode. Sub-tick interpolation would require recomputing `frac` at millisecond precision; this is an allowed but not required optimization.

**Strict mode (opt-in).** A checkbox **inside the `<details>` panel** of the clock card lets the user enable strict mode, which snaps Milli, Beat **and** Blink to floor positions (no smooth interpolation). The choice is persisted under `localStorage["ats-strict-analog"]`. Default: off (hybrid). The Web Component MAY also expose this as the attribute `<ats-clock face="analog" strict>`.

## 8. Animation

A single `setInterval` at 100 ms (10 Hz) recomputes the five hand angles. Updates skip the SVG `transform` write when the angle has not changed (Bloc/Centi snap), which keeps DOM churn minimal.

Implementations MAY use `requestAnimationFrame` for the Milli / Beat / Blink hands for sub-frame smoothness; this is purely a rendering optimization and does not affect the ATS values.

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
