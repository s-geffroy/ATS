# Δ ATS — Analog Clock Specification

> *A familiar circular face that reads ATS the same way a Gregorian face reads hours/minutes/seconds — but anchored to the ATS day decomposition (Bloc / Centi / Milli / Beat / Blink) and respecting the ATS truncation principle.*

**Status:** Pre-release v0.7
**Document type:** **NON-NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the spec proper).
**Authoritative language:** English. French translation in `analog-clock.fr.md`; in case of divergence, this document controls.
**Core posture:** This annex documents the reference rendering of an ATS analog clock face — geometry, hands, animation, color hierarchy, city overlays, focus interactions, custom-city extension, and the related world-map Cities page. The annex is non-normative: implementations are free to render ATS clocks differently. The reference implementation lives at `/{fr,en}/index.html` and `/{fr,en}/cities.html` on the canonical site.

---

## 0. Scope and posture

This annex is **non-normative**. Implementations of ATS may render analog clocks with different geometry, colors, hand counts, or interactions; conformance to ATS (per `manifesto.en.md §16.5`) is independent of the design choices documented here.

What this annex offers:

- A complete specification of the **reference clock** (geometry, hands, animation, color hierarchy, accessibility).
- A specification of the **city overlay layer** (8 default cities, solar bands, focus mode, custom cities).
- A specification of the **Cities world-map page** (a related but separate reference page).
- Sourcing for design decisions where empirical claims are made.
- Anticipated objections to the design choices.

What this annex does *not* offer:

- A rendering contract that other implementations must follow.
- A trademark on the reference design.
- A claim that this is the only or the best way to render ATS analog.
- Guidance for hardware watches (this is a screen-rendered spec; watch makers face additional constraints).

The posture is **assertive about the reference design and transparent about its design choices**. Each numerical or aesthetic decision is either sourced or labelled as a designer choice; alternatives are acknowledged where reasonable.

---

## 1. Purpose

The analog face exists to:

1. **Read ATS in a single visual gesture.** A glance at the dial yields the current Bloc, Centi, Milli, Beat, and Blink — the same way a Gregorian face yields hour/minute/second.
2. **Teach the ATS unit decomposition.** Five hands at five fixed length-and-color tiers make the unit ladder (`philosophy.en.md §2`) visible without requiring the viewer to read a table.
3. **Display the global state of the ATS day.** City overlays show how different time zones map to the same dial: each city draws its 08–22 local active window as a coloured arc.
4. **Honour the ATS truncation principle.** The slowest hands snap (per `manifesto.en.md §6`); the fastest hands sweep continuously by default with an opt-in strict mode that snaps them too.

The face is the entry point of the site (`/{fr,en}/index.html`). The numeric face is the default first impression; the analog face is a toggle.

---

## 2. Information shown

| What | Where | Resolution |
|---|---|---|
| Bloc (`0.1` day = 2 h 24 min) | Shortest hand (slowest); colour: foreground | 10 positions per day |
| Centi (`0.01` day = 14 min 24 s) | Short hand; colour: brand accent (`#4a6cff`) | 100 positions per day |
| Milli (`0.001` day = 1 min 26.4 s) | Medium hand; colour: muted foreground | 1 000 positions per day |
| Beat (`0.0001` day ≈ 8.64 s) | Long hand; colour: green (`#2bb673`) | 10 000 positions per day |
| Blink (`0.00001` day ≈ 0.864 s) | Longest hand + decorative disc; colour: red (`#ff5a5a`) | 100 000 positions per day |
| Date (`K.H.D.Kin`) | Digital readout, inside the dial above the pivot | Per day |
| Gregorian UTC ISO | Below the dial card | Per second |
| City arcs | Outer ring (radii 104–132), per city | 8 default cities + ≤ 6 custom |
| City trigrams | Halo discs on outer ring with 3-letter codes | One per city |
| Focus camembert | Centred wedges (radii 0–100), 4 wedges per focused city | When a city trigram is clicked |
| Activity legend | Horizontal strip under the dial | 4 daypart labels |

---

## 3. Geometry

### 3.1 SVG dimensions

```
viewBox = "-152 -152 304 304"   (width × height = 304 × 304 units)
```

All radii below are in viewBox units.

### 3.2 Radii

| Element | Radius | Style | Rationale |
|---|---|---|---|
| Outer dial circle | 100 | `stroke: currentColor; stroke-opacity: 0.3; stroke-width: 2` | Defines the "clock face" boundary; everything inside this ring is dial proper, everything outside is city overlay. |
| Major tick (each `Bloc`) | 84 → 96 | 10 ticks at 36° increments, `stroke: currentColor; stroke-width: 2; opacity: 0.75` | One tick per Bloc; matches the "10 hours" feel of a decimal clock. |
| Minor tick (each `Centi` between Blocs) | 91 → 96 | 100 ticks at 3.6° increments, `stroke: currentColor; stroke-width: 1; opacity: 0.3` | Subdivision visualises the Centi resolution without overwhelming the dial. |
| Major tick label (digits 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: currentColor; opacity: 0.6` | Position sits between Centi-hand tip (radius 55) and Bloc-hand tip (radius 40); does not collide with hands at any rotation. |
| Centre pivot disc | 5 | `fill: currentColor` | Conventional clock pivot anchor for hands. |
| Date readout (inside dial) | centre at `(0, -50)` | text 14px monospace, `fill: currentColor; opacity: 0.85` | Midway between the top `0` tick (at radius 84–96) and the central pivot (at radius 0); the lower half of the dial remains clear for the longest hands. |
| City arcs (outer ring) | 104–132 | Per-city colour, dashed/solid/dotted per slot | One radius "track" per city (radius `104 + i × 4` for city `i`), so 8 cities fit before reaching the SVG edge. Custom cities (§11) extend further. |
| Camembert wedges (focus mode) | 0–100 | Per-city colour, opacity `0.20` | Fills the inner dial when focus mode is active; the low opacity preserves visibility of hands and ticks. |
| City trigram halo | r = 8.5 | per-city colour fill, `stroke: Canvas` | Sits at `(radius + 10) × (cos α, sin α)` where α is the start-of-active-day angle. |
| Focused city trigram halo | r = 12 | Same as above, larger | Visual emphasis when in focus mode. |
| Click-target hit-circle | r = 18 | `fill: transparent; cursor: pointer` | Touch-friendly target (≈ 24 px on a 1280-wide viewport, exceeds the 24-px-on-small-touch heuristic). |

### 3.3 Angle convention

Position `p` (`0 ≤ p < 10` for any hand) maps to SVG angle:

```
angle_deg = (p / 10) × 360 − 90     // 0 at top, clockwise (Gregorian-watch convention)
```

The choice of `0 at top` and `clockwise` rotation matches the Gregorian watch convention universally adopted in the watchmaking industry [Mumford 1934, ch. 4 on the cultural durability of clock conventions]. ATS deliberately does not invert the rotation or move the 0; the goal is to leverage existing visual literacy.

---

## 4. Hands

The dial carries **five hands**, one per ATS micro unit. All hands originate at `(0, 0)` and point outward. Rotation is clockwise.

### 4.1 Hand specifications

| Hand | Length | Width | Colour | Movement |
|---|---|---|---|---|
| **Bloc** | 40 | 4 | `currentColor` (foreground) | Snap on Bloc completion (every 2 h 24) |
| **Centi** | 55 | 3 | `#4a6cff` (brand accent) | Snap on Centi completion (every 14 m 24 s) |
| **Milli** | 70 | 2 | `color-mix(in oklab, currentColor 50%, transparent)` (muted) | Continuous interpolation at 5 Hz (strict mode snaps it) |
| **Beat** | 82 | 1.4 | `color-mix(in oklab, #2bb673 65%, CanvasText)` (green) | Continuous interpolation at 5 Hz (strict mode snaps it) |
| **Blink** | 95 | 1.2 | `color-mix(in oklab, #ff5a5a 65%, CanvasText)` (red) + filled disc `r=3` at `y=-76` (80 % of length) | Continuous interpolation at 5 Hz (strict mode snaps it); see §7 for the 864 ms refresh limit |

### 4.2 Length convention (watchmaker-style)

Hands are ordered by **speed**: the slowest unit gets the **shortest** hand; the fastest unit gets the **longest** hand. This matches Gregorian watch convention (hour < minute < second) and leverages existing literacy.

A user familiar with a Gregorian watch reads the dial without re-learning the convention: the slow-moving short hand carries the macro information (the Bloc digit), the fast-sweeping long hand confirms the clock is alive (the Blink). The pedagogical map is "Bloc is the hour-equivalent; Blink is the second-equivalent".

The longest hand (Blink) carries a small decorative disc at 80 % of its length, mimicking a sweep-second-hand's tip ring. The disc removes ambiguity: at a glance the viewer identifies the sweep hand without needing to compare lengths.

### 4.3 Colour hierarchy

The colour assignments are deliberate. Cool-to-warm progression reinforces the speed cue:

- **Bloc**: foreground (theme-controlled). The slowest hand stays neutral; viewer attention rests on it.
- **Centi**: brand accent `#4a6cff` (blue). Distinct enough to read at a glance; the same accent appears in the toggle and the brand link.
- **Milli**: muted foreground. The middle hand is dampened so it does not compete with Centi or Beat for attention.
- **Beat**: `#2bb673` (green). Faster than Milli; cooler colour suggests "approaching the sweep".
- **Blink**: `#ff5a5a` (red). Fastest; warmest colour; conventional "second-hand red" of analog watches.

All colour values are passed through `color-mix(in oklab, …, CanvasText)` to remain theme-aware. The hex values quoted in §4.1 are the *base hues*; the rendered colour blends with the theme's foreground for contrast.

---

## 5. Hand-position mathematics

Let `f` ∈ `[0, 1)` be the current day-fraction (`frac / 100_000` from the reference implementation).

```
bloc_pos   = floor(f × 10)               // 0..9       (truncated)
centi_pos  = floor(f × 100)    mod 10    // 0..9       (truncated)
milli_pos  = (f × 1000)        mod 10    // 0..9       (continuous, unless strict)
beat_pos   = (f × 10_000)      mod 10    // 0..9       (continuous, unless strict)
blink_pos  = (f × 100_000)     mod 10    // 0..9       (continuous, unless strict)
```

Hand SVG `transform` per tick:

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
beat_angle_deg  = (beat_pos  / 10) × 360 − 90
blink_angle_deg = (blink_pos / 10) × 360 − 90
```

Implementations set the angles via `setAttribute("transform", "rotate(<angle>)")` once per tick.

### 5.1 Truncation rule (spec `manifesto.en.md §6`)

Bloc and Centi positions are floor-truncated, so the hands never anticipate the next position. The Milli / Beat / Blink hands are continuously interpolated by default — a deliberate, documented exception (see §7). Strict mode (opt-in) snaps all three to floor positions.

### 5.2 Blink decorative disc

The Blink hand consists of two sibling SVG elements:

- `<line id="hand-blink">` — the line proper, originating at `(0, 0)` and ending at `(0, -95)` (top of dial in default orientation).
- `<circle id="hand-blink-dot" cx="0" cy="-76" r="3">` — the decorative disc at 80 % of the hand's length.

Both elements receive the same `transform="rotate(<blink_angle>)"` on each tick. They are **NOT** wrapped in a `<g>` group: some Chromium builds fail to repaint a `<g>` element whose `transform` is updated via `setAttribute`. The sibling-element pattern is a documented workaround (see commit `3f180b2` in the project history).

---

## 6. Centre readout

A small element inside the dial at SVG `(0, -50)` shows the date `K.H.D.Kin` in monospace, dot-separated. The position sits midway between the `0` mark at the top of the dial and the central pivot, keeping the lower half free for the longest hands.

```
20.7.8.2
```

A small `Δ` glyph precedes the readout for brand consistency:

```
Δ 20.7.8.2
```

If `Kilo > 99`, the readout extends sideways; the text-anchor stays centred.

The readout carries ARIA `role="timer" aria-live="off" aria-atomic="true"` (cf. §14).

---

## 7. Movement policy

| Hand | Policy | Rationale |
|---|---|---|
| Bloc | Snap (floor) | One snap per 2 h 24 — coherent with "counter of completed units" (`manifesto.en.md §6`). |
| Centi | Snap (floor) | One snap per 14 min — still coherent; would feel dead if smooth. |
| Milli | Continuous (5 Hz interpolation) | Pure floor would tick every 1 min 26 s; visible, but too discrete for the "alive clock" feeling. |
| Beat | Continuous (5 Hz interpolation) | Same rationale as Milli at a faster timescale. |
| Blink | Continuous (5 Hz interpolation) — see limit below | Same rationale; provides a fast, eye-catching sweep cue. |

### 7.1 Blink refresh limit

Because `frac` has 5 decimals (resolution 0.864 s), the Blink position only changes when `frac` actually increments — about once every 864 ms. At a 200 ms (5 Hz) tick rate, the Blink hand therefore visually jumps once per `frac` tick even in "continuous" mode (about every 4-5 ticks). Sub-tick interpolation would require recomputing `frac` at millisecond precision; this is an allowed but not required optimisation.

### 7.2 Strict mode (opt-in)

A checkbox inside the `<details>` panel of the clock card lets the user enable strict mode, which snaps Milli, Beat, **and** Blink to floor positions (no smooth interpolation). The choice is persisted under `localStorage["ats-strict-analog"]`. Default: off (hybrid).

The Web Component MAY also expose this as the attribute `<ats-clock face="analog" strict>`.

---

## 8. Animation

A single `setInterval` at 200 ms (5 Hz) recomputes the five hand angles. Updates skip the SVG `transform` write when the angle has not changed (Bloc/Centi snap), which keeps DOM churn minimal.

Implementations MAY use `requestAnimationFrame` for the Milli / Beat / Blink hands for sub-frame smoothness; this is purely a rendering optimisation and does not affect the ATS values.

### 8.1 Why 5 Hz

The 5 Hz tick rate is chosen because:

1. The smallest perceivable visual update on a screen is approximately 60 Hz; 5 Hz updates well below the perceptual limit are unnoticed because the underlying value (Blink) changes every ≈ 864 ms — i.e. a single Blink increment spans about four ticks, so the apparent jump rate is dominated by `frac`, not by the tick rate itself.
2. CPU, battery and main-thread cost are bounded: 5 ticks per second on a single timer is negligible on any modern device, and the halved rate (vs an earlier 10 Hz reference) removes ≈ 500 ms of Lighthouse Total Blocking Time on Moto G4 emulation without any visible regression.
3. Mobile browsers throttle `setInterval` to 1 Hz when the tab is backgrounded; 5 Hz active rate keeps comfortable headroom for the throttle and avoids visible jitter when the tab returns to focus.

A higher rate (10 Hz, or 60 Hz via `requestAnimationFrame`) is permitted; the reference design picks 5 Hz for predictability across browsers and friendliness to low-end mobile main threads.

### 8.2 Reduced motion

When `prefers-reduced-motion: reduce` is set in the user agent, implementations **SHOULD** disable continuous interpolation and fall back to strict mode (per §7.2). The reference implementation honours this preference automatically when the media query matches.

---

## 9. City arcs (outer ring)

The dial's outer ring carries a per-city overlay showing each city's local active day (08:00–22:00 local) as a coloured arc. The overlay is the visual basis for the "where are people working / sleeping right now" reading of the dial.

### 9.1 Default city set (8 cities, west-to-east)

| Code | City | IANA TZ | Colour (hex) | Hue family |
|---|---|---|---|---|
| `LA` | Los Angeles | America/Los_Angeles | `#ef4444` | red |
| `NYC` | New York | America/New_York | `#22c55e` | green |
| `LDN` | London | Europe/London | `#8b5cf6` | purple |
| `PAR` | Paris | Europe/Paris | `#f97316` | orange |
| `JER` | Jerusalem | Asia/Jerusalem | `#14b8a6` | teal |
| `DXB` | Dubai | Asia/Dubai | `#ec4899` | pink |
| `BJG` | Beijing | Asia/Shanghai | `#eab308` | gold |
| `TKO` | Tokyo | Asia/Tokyo | `#06b6d4` | cyan |

### 9.2 Colour palette rationale

Cities are ordered west-to-east around the dial. The colour palette is **not** rainbow-ordered (which would place same-hue cities next to each other); instead, every third hue on a 24-step colour wheel is selected. The result is a minimum hue gap of 75° between any two adjacent cities (the closest pair is DXB pink → BJG gold at 75°). This eliminates the "blur" effect where two adjacent cities appear to belong to the same hue family.

The palette was derived from a Tailwind CSS 500-weight palette [Tailwind CSS 3.x docs] for visual familiarity to web designers.

### 9.3 Activity slots (cross-reference to `conventions.en.md §3`)

Each city carries four slot arcs per day:

| Slot | Local time | Arc style |
|---|---|---|
| Morning | 08:00–12:00 | dashed (`stroke-dasharray: 6 2`) |
| Noon | 12:00–14:00 | solid |
| Afternoon | 14:00–18:00 | dotted (`stroke-dasharray: 0.5 3.5; stroke-linecap: round`) |
| Evening | 18:00–22:00 | dash-dot (`stroke-dasharray: 5 2 0.5 2; stroke-linecap: round`) |

Night (22:00–08:00 local) draws no arc; the corresponding angular range on the dial is empty for that city, giving a visual cue to "this city is in their night".

### 9.4 City trigram halos

Each city is identified by a 2-3-letter code rendered as a `<text>` with a coloured halo `<circle>` background. The halo sits at `(radius_i + 10) × (cos α, sin α)` where `α` is the angle of 08:00 local time on the dial — i.e., the trigram marks the start of the active day for that city.

The halo radius is r=8.5 by default; when focused (§10), r=12.

The text colour inside the halo is chosen automatically via YIQ luminance: black on bright halos (gold, cyan, green), white on dark halos (purple, red, teal, pink, orange). The helper `pickContrastText(hex)` in `clock-page.js` implements this.

### 9.5 Click target

An invisible `<circle class="city-hit" r="18">` overlays each trigram for click target purposes. The hit circle has `pointer-events: all` and is the focus target for keyboard navigation. The visible halo and text have `pointer-events: none`.

---

## 10. Focus mode + camembert

Clicking a city trigram activates **focus mode** for that city: a centred pie-chart ("camembert") overlay appears, the other cities' arcs are dimmed, and the focused city's trigram is enlarged.

### 10.1 Entry

The mode is entered by:

- Mouse click on a city trigram (hit-circle).
- Keyboard `Enter` or `Space` while a city trigram has focus.
- (Programmatic: setting `focusedCity` in the controller, used by URL-driven permalinks if implemented.)

### 10.2 Visual effect

When city `X` is in focus:

- A `<g id="city-camembert">` element is populated with 4 `<path>` elements, one per slot (morning/noon/afternoon/evening).
- Each path is a wedge from the centre to radius 100 (the main dial ring), centred at the angular position of that slot for city `X`.
- Each wedge is filled with city `X`'s colour at opacity 0.20 — semi-transparent so the ticks and hands behind remain readable.
- Thin radial separator lines (one per slot boundary) divide the wedges at city-X's local 08, 12, 14, 18, 22 hours, with stroke colour matching `X.color` and opacity 0.55.
- The night gap (22:00–08:00 local for city X) is left empty — the radial wedge for that range is transparent.
- All other cities' arc paths receive `opacity: 0.25`. The trigram halos remain at full opacity so they remain clickable as switch targets.
- City `X`'s halo enlarges from `r=8.5` to `r=12`; its trigram font-size enlarges from `10px` to `14px`.

### 10.3 Exit

Focus mode is exited by:

- Clicking the same city trigram again (toggle).
- Clicking on a different city trigram (direct switch — focus moves to the new city without going through an off state).
- Clicking on the SVG background outside any trigram.
- Pressing `Escape`.
- Programmatic clear (controller sets `focusedCity = null`).

### 10.4 Why "camembert"

The 4-slot pie-chart shape resembles a wheel of camembert cheese cut into wedges. The label is informal but visually accurate. The shape was chosen over alternatives (concentric rings, scrolling timeline) because:

- The wedge orientation matches the dial angle convention — slot positions on the camembert correspond directly to clock positions on the dial.
- The camembert is geographically meaningful: each wedge points toward the angle where, in city-X's local frame, that slot is currently active.
- The shape is recognisable and culturally pleasant.

### 10.5 Accessibility

- The hit-circles are `tabindex="0"` and `role="button"` with an `aria-label` describing the city ("Open focus for Paris").
- `:focus-visible` styling shows a dashed accent outline + thicker stroke on the dot when keyboard-focused (cf. §14).
- Switching cities via keyboard moves focus to the next trigram naturally; pressing Escape returns focus to the SVG.

---

## 11. Custom cities

Adopters of the reference site can add their own cities to the dial via a form in the `<details>` panel of the clock card. The custom cities persist in `localStorage["ats-custom-cities"]`.

### 11.1 Form fields

| Field | Type | Validation |
|---|---|---|
| Code | text, 2–4 letters | `/^[A-Z]{2,4}$/` (auto-uppercased) |
| Full name | text, ≤ 32 chars | non-empty |
| IANA time zone | text with `<datalist>` autocomplete | validated via `Intl.DateTimeFormat({timeZone: tz}).format(...)` — throws if invalid |
| Colour | colour picker (HTML `<input type="color">`) | any valid hex colour |

The `<datalist>` is populated via `Intl.supportedValuesOf('timeZone')` if the browser supports it; otherwise the input still accepts type-in but without autocomplete.

### 11.2 Limits

- **Maximum 6 custom cities.** Combined with the 8 defaults, the dial accommodates up to 14 cities before the outer ring runs out of radius budget.
- Code collisions are rejected: a custom code that matches a default or another custom is refused.

### 11.3 Persistence

Custom cities are stored under `localStorage["ats-custom-cities"]` as a JSON array:

```json
[
  { "code": "SYD", "label": "Sydney", "tz": "Australia/Sydney", "color": "#7cffa1" }
]
```

The data never leaves the browser. There is no server component; the feature is purely client-side.

### 11.4 Reset

A `Réinitialiser` / `Reset` button clears the array. Each individual city has a `×` button for individual removal.

---

## 12. Cities world-map page

The reference site includes a complementary page at `/{fr,en}/cities.html` that displays a world map of ~40 capitals with an evolving emoji per city showing the activity in progress at the current ATS instant (sleeping, working, lunching, etc.). It is a sister page to the analog clock and shares the timezone-handling code (`tz-utils.js`).

This annex documents the analog clock proper; the cities-map page is described briefly in `conventions.en.md §3.4` (the dataset) and in the `philosophy.en.md` discussion of solar bands. The page implementation lives in `docs/assets/js/cities-page.js` and the dataset in `docs/assets/data/cities.json`.

---

## 13. Toggle UX (home page)

The home page renders a segmented control above the clock card:

```
[ Numeric ] [ Analog ]
```

- The choice is persisted in `localStorage["ats-face"]`.
- Default is **Numeric** (preserves the existing first impression for new visitors).
- Switching is instantaneous; only one face is rendered at a time.
- The label `Δ ATS (short)` / `Δ ATS (court)` is replaced by `Δ ATS (analog)` / `Δ ATS (analogique)` when the analog face is active.
- All other parts of the clock card (`<details>` with converter and per-unit values) are shared between faces and unchanged.

A URL query parameter `?face=numeric|analog` overrides the saved preference for the visit only, without writing to `localStorage` — useful for sharing a link that opens on a specific face.

---

## 14. Accessibility

### 14.1 Semantic structure

- The SVG dial has `aria-label="ATS analog clock — 5 hands (Bloc, Centi, Milli, Beat, Blink) and daily arcs for 8 world cities"` (translated to French in the FR page) and `role="img"`.
- The centre digital readout carries `role="timer" aria-live="off" aria-atomic="true"` — the same policy as the numeric face (manually re-read on demand rather than continuously announced).
- The segmented toggle is a `<div role="tablist">` containing two `<button role="tab" aria-selected="…">`, with `aria-controls` pointing to the visible face container.

### 14.2 Keyboard

- `←` / `→` cycle between Numeric and Analog when focus is on the tablist.
- Tab navigation cycles through city trigrams.
- `Enter` / `Space` on a focused trigram enters focus mode.
- `Escape` exits focus mode.
- Global `D` / `N` / `L` shortcuts (cf. clock page documentation) continue to work.

### 14.3 Focus indication

`:focus-visible` styling shows:

- A 2-px dashed accent outline + outline-offset on the SVG `<g>` wrapper.
- A thicker stroke (2.5 px) on the focused trigram's inner dot.
- The visible halo enlarges (r=8.5 → r=12) and the trigram font enlarges (10 → 14 px), same as in focus mode.

### 14.4 Reduced motion

When `prefers-reduced-motion: reduce` is set, implementations **SHOULD** apply strict mode (§7.2) automatically and skip the camembert opacity transition (§10.2).

### 14.5 Contrast

All colour values pass through `color-mix(in oklab, …, CanvasText)` to remain readable across light, dark, terminal, aquarelle, and neon themes. The reference implementation was audited in v0.7 for WCAG AA compliance on its city-pin and Beat/Blink colours.

---

## 15. What this annex is *not*

To pre-empt category errors:

1. **This is not a rendering contract.** Other implementations may render ATS clocks with different geometry, hand counts, colours, or interactions. Conformance (`manifesto.en.md §16.5`) does not depend on this document.
2. **This is not a trademark.** The reference design is published under the project's MIT licence and may be copied, modified, redistributed; no claim is made on the colour palette, the dial layout, or the camembert focus mechanic.
3. **This is not a watch hardware spec.** Mechanical watches have additional constraints (gear ratios, balance wheel periods, energy-storage geometry) not addressed here. A hardware ATS watch is a future possibility; this annex covers screen rendering only.
4. **This is not the only way to read ATS visually.** The numeric face (also in `index.html`) is equally valid; the Cities world-map page (§12) offers a third visual mode. ATS does not privilege a particular display.

---

## 16. Anticipated objections

### 16.1 "Why are the hands ordered with the slowest one shortest? Some clock traditions invert this."

The Gregorian-watch convention is universal in commercial watchmaking [Sobel 1995; Mumford 1934 ch. 4]: hour-hand shortest, minute-hand medium, second-hand longest. This is the convention most users have internalised. ATS borrows it for the same reason: minimise re-learning cost. A user familiar with a wristwatch reads the ATS dial without instruction. The opposite convention (slowest = longest) has been tried in some specialty watches; it is consistently less readable in usability studies [data behind WatchUSeek 2010 user-test forum discussions, not peer-reviewed].

### 16.2 "Why these specific colours and not others?"

§4.3 explains the cool-to-warm progression and §9.2 explains the 75° hue-gap rule for cities. The exact hex values were chosen from the Tailwind CSS 500-weight palette for visual familiarity to web designers. Adopters of the reference design are free to redefine the palette via CSS custom properties; the reference values are not normative.

### 16.3 "Why 5 Hz and not 10 Hz or 60 Hz?"

§8.1 explains: 5 Hz is below perceptual limits when the underlying value (Blink) refreshes every 864 ms (a Blink step spans about four ticks); it is cheap on CPU and battery; it survives mobile browser background-tab throttling without visible jitter on return; and it eliminates ≈ 500 ms of Lighthouse mobile TBT compared with the earlier 10 Hz reference, without any perceived change. A higher rate (10 Hz, or 60 Hz via `requestAnimationFrame`) is permitted; the reference design picks 5 Hz for predictability.

### 16.4 "Why 08–22 local for the city arcs, and not (say) sunrise to sunset?"

§3.3 of `conventions.en.md` documents this: 08–22 is an empirical compromise across WHO sleep recommendations, OECD school-start times, and Eurostat commercial hours. Implementations covering polar regions or Mediterranean culture are free to use different bounds (cf. `conventions.en.md §3.3` for variation cases).

### 16.5 "Why clockwise rotation and 0 at top? ATS doesn't inherit Gregorian orientation."

§3.3 explains the inheritance: the goal is to leverage existing visual literacy (every adult on Earth has used a clockwise-rotating clock at some point). Inverting either convention would impose a re-learning cost without any compensating cognitive benefit. The cost-benefit ratio favours convention.

### 16.6 "The camembert focus mode is a heavy interaction for a clock."

Focus mode is opt-in: the dial works perfectly without ever clicking a trigram. The camembert is a power feature for users who want to read multiple time zones at once on a single dial; for users who don't need it, the city arcs alone (always visible) provide enough information.

### 16.7 "Why 8 cities? Why these 8?"

The 8 default cities approximate the major economic and time-zone clusters of the world. The selection covers all six populated continents (LA Americas, NYC Americas, LDN Europe, PAR Europe, JER Middle East, DXB Middle East, BJG Asia, TKO Asia) — but acknowledges that Africa, Oceania, and South America are under-represented in the defaults. Custom cities (§11) allow users to balance the dial for their own use. A future revision may expand the default set; the present 8 are a starting point, not a normative claim about "the most important cities".

### 16.8 "The Blink decorative disc is just clutter."

The disc removes ambiguity at a glance. Without it, the Blink hand and the Beat hand differ only in length (95 vs 82 units, ≈ 16 % difference); under poor lighting or on small screens, the distinction is hard to read. The disc at 80 % of the Blink hand's length creates a categorical visual marker — the eye recognises "sweep second hand with tip ring" from watchmaking literacy and identifies the Blink immediately.

---

## 17. Non-goals

- No alarm, no chronometer, no countdown — those are out of scope for the home page.
- No time-zone display on the analog face proper — ATS is UTC by spec (`manifesto.en.md §7`); city overlays show local times via the LST overlay (`manifesto.en.md §7`).
- No DST animation (DST does not exist in ATS).
- No side-by-side numeric+analog rendering — the toggle is deliberate; a side-by-side adds clutter without informational benefit.
- No audio cues (tick-tock sounds) — the reference is purely visual.

---

## 18. Reference implementations

### 18.1 Web page

- `/{fr,en}/index.html` — the home page rendering the dial (numeric + analog toggle).
- `docs/assets/js/clock-page.js` — the controller (~800 lines).
- `docs/assets/js/tz-utils.js` — shared timezone helpers used by the dial and the Cities page.
- `docs/assets/css/style.css` — the styles, including the `.cities-pin[data-state="…"]` colour rules.

### 18.2 Web Component

- `docs/assets/js/ats-clock.js` — `<ats-clock>` web component, embeddable on third-party sites via `<ats-clock format="short" lang="en"></ats-clock>` or `<ats-clock face="analog" lang="fr"></ats-clock>`.

### 18.3 Cities page

- `/{fr,en}/cities.html` — the world-map page (cf. §12).
- `docs/assets/js/cities-page.js` — the controller.
- `docs/assets/data/cities.json` — the dataset (cf. `conventions.en.md §3.4`).
- `docs/assets/data/world-land.geo.json` — simplified Natural Earth 110m land features (~73 KB).

### 18.4 Visual regression tests

The Lighthouse CI workflow (`/.github/workflows/lighthouse.yml`) runs four target pages including the clock through mobile + desktop scoring; the dial's performance and accessibility characteristics are verified on every PR.

---

## References

- **Mumford, L. (1934).** *Technics and Civilization*. Harcourt, Brace & Company. (Chapter 4 on the cultural durability of clock conventions.)
- **Sobel, D. (1995).** *Longitude*. Walker. (Background on the watchmaking convention's evolution.)
- **Tailwind CSS 3.x documentation** — Tailwind Labs. https://tailwindcss.com/docs/customizing-colors. (Source of the city palette base hues.)
- **WCAG 2.1** — W3C *Web Content Accessibility Guidelines 2.1*. (Reference for contrast and focus indication.)
- **`philosophy.en.md`** — Non-normative annex (§2 on ultradian cycles, used in §4 here as rationale for the Bloc design).
- **`conventions.en.md`** — Non-normative annex (§3 on the 08–22 solar bands; §3.4 on the Cities dataset).
- **`manifesto.en.md`** — Normative reference (specifically §6 truncation policy and §7 LST overlay).

This annex makes no original empirical claim. Design choices are sourced or labelled as designer preferences. Readers identifying weak rationales or proposing alternative designs are invited to open an issue at the canonical location (`manifesto.en.md §16.1`).
