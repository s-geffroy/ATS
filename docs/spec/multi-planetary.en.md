# ATS — Multi-planetary extension

**Status:** **normative** annex v0.7 (target v1.0)
**Generic symbol:** `Δ_<Body>` or `Δ_<astronomical symbol>`
**Normative reference:** `manifesto.en.md` (the Earth spec)

---

## 0. Position

ATS v0.6 (cf. `manifesto.en.md`) describes a counter **anchored to Earth**: epoch 1969-07-20T00:00:00Z, POSIX day of 86 400 s. This annex **generalizes** it to other celestial bodies to support the rhetoric of manifesto §1 ("designed for a multi-planetary civilization").

> **Important.** This extension introduces **no change** to the canonical format, short format, §12 binary format, or §11.4 algebra. The same `K.H.D.Kin.fffff` grammar applies to each body — only the **epoch** and **day length** change.

## 1. Generic definition

An ATS counter for a celestial body `X` is entirely determined by:

| Parameter | Type | Meaning |
|---|---|---|
| `epoch_X` | UTC instant | Counter origin (absolute zero). |
| `day_seconds_X` | positive Decimal | Local "day" duration, in SI seconds. |
| `suffix_X` | ASCII | Canonical suffix for notation (`_Earth`, `_Mars`…). |
| `symbol_X` | Unicode (optional) | Astronomical symbol for the display form. |

The counter is then:
```
Δ_X(t_UTC) = (t_UTC − epoch_X) / day_seconds_X
```
with `t_UTC` in seconds since an arbitrary UTC reference (typically POSIX epoch or Earth epoch).

The positional structure `K.H.D.Kin.fffff` is identical to Earth ATS (Kilo unbounded, Hecto / Deka / Kin digits 0..9, 5-digit default fraction). The `Bloc` remains `1/10` of a local day — its absolute duration varies by body.

## 2. Notation

### 2.1 ASCII canonical form

```
T± Δ_Earth K.H.D.Kin.fffff
T± Δ_Mars  K.H.D.Kin.fffff
T± Δ_Moon  K.H.D.Kin.fffff
```

The suffix is mandatory **except** for Earth: `Δ 20.7.8.2.50000` remains equivalent to `Δ_Earth 20.7.8.2.50000` (v0.6 backward compatibility).

### 2.2 Symbolic form (UI / display)

| Body | Symbol | Pronunciation |
|---|---|---|
| Earth | `Δ⊕` | "delta-earth" |
| Mars | `Δ♂` | "delta-mars" |
| Moon | `Δ☾` | "delta-moon" |

The bare symbol `Δ` remains Earth ATS in any ambiguous context (counters, badges, embed).

### 2.3 Short form

Same as v0.6 short form + suffix:
```
Δ_Mars 1.2.3.4/56
Δ☾ 0.7.0.3/45
```

## 3. Parameters for v1.0 bodies

### 3.1 Earth (`Δ_Earth`, `Δ⊕`, or bare `Δ`)

- `epoch_Earth` = **1969-07-20T00:00:00Z** (start of the Apollo 11 day, cf. manifesto §2)
- `day_seconds_Earth` = **86 400** (POSIX day, cf. manifesto §8)

### 3.2 Mars (`Δ_Mars`, `Δ♂`)

- `epoch_Mars` = **1997-07-04T16:56:55Z** — landing of **Mars Pathfinder** in Ares Vallis. First successful modern Mars landing since Viking; symbolic **July 4, 1997** date. (Source: Wikipedia; value matches JPL Mission History.)
- `day_seconds_Mars` = **88 775.244 147** s — **Martian sol** (Allison & McEwen, *Planetary and Space Science* 2000, *"A post-Pathfinder evaluation of areocentric solar coordinates"*).

Numerical consequence: Δ_Mars 0.0.0.0.00000 = **1997-07-04T16:56:55Z** UTC. For instant `2026-06-13T12:00:00Z`, the calculation gives **`T+ Δ_Mars 10.2.8.7.96477`** (5-digit precision).

### 3.3 Moon (`Δ_Moon`, `Δ☾`)

- `epoch_Moon` = **1969-07-20T00:00:00Z** — **shared with Earth**. Doctrinal choice: the Moon is Earth's satellite; its counter naturally aligns with the human event that links both bodies.
- `day_seconds_Moon` = **2 551 442.8128** s — **synodic lunar day** (29.530 588 Earth days; IAU). Synodic chosen (apparent sunrise-to-sunrise from the surface) over sidereal (27.32 d) because it matches local lighting cycle.

Consequence: 1 Δ_Moon = ≈ 29.53 Δ_Earth. At `2026-06-13T12:00:00Z`, **`T+ Δ_Moon 0.7.0.3.76180`**.

## 4. `Δ_X ↔ UTC` conversion

Canonical formula for a body `X` parameterized by `(epoch_X, day_seconds_X)`:

```
total_days = (utc − epoch_X).total_seconds() / day_seconds_X
sign       = T+ if total_days ≥ 0 else T-
abs_days   = |total_days|
integer    = floor(abs_days)
frac_5dig  = floor((abs_days − integer) × 100 000)
K.H.D.Kin  = standard divmod pipeline (cf. manifesto §9)
```

The §6 truncation rule (`ROUND_FLOOR`) applies unchanged.

## 5. Cross-body comparisons and algebra

**Δ_X and Δ_Y of different bodies are not directly comparable.** To compare two instants expressed on two different bodies, convert **both** to UTC first.

In practice:
- `Δ_Mars + Δd_Mars → Δ_Mars` ✓ (§11.4 algebra preserved per body)
- `Δ_Mars + Δd_Earth → undefined` ✗
- `Δ_Mars < Δ_Earth → undefined` ✗
- `Δ_Mars.to_utc() < Δ_Earth.to_utc() → bool` ✓ (comparison via the UTC bridge)

The `Δd` (duration) unit is **typed by body**: `Δd_Mars` = a quantity of Martian sols; `Δd_Earth` = a quantity of Earth days; conversion possible via the `day_seconds` ratio.

## 6. Generic framework for third-party bodies

An implementation **MAY** define `Δ_X` for any body by registering:

| Field | Venus example |
|---|---|
| `epoch_X` (UTC ISO 8601) | `1989-08-10T03:01:00Z` (Magellan orbital insertion) |
| `day_seconds_X` (positive Decimal) | `10 087 200` (Venusian synodic day ≈ 116.75 Earth days) |
| `suffix_X` (short ASCII) | `_Venus` |
| `symbol_X` (optional Unicode) | `♀` |

The implementation **SHOULD** provide a vector set `test-vectors-multi-planetary-<body>.json` with ≥ 5 instants, following the same format as Mars and Moon. See §10.

**No central authority registers non-canonical bodies.** Suffix conflicts are resolved by nominal convention (`_Venus`, `_Jupiter`, etc. in English). Astronomical Unicode symbols (U+263F to U+2647) are the reference for the symbolic form.

## 7. Stability (v1.0 freeze)

Once v1.0 ships, **Mars and Moon parameters are frozen** (at the same level as the §3 freezes of `versioning.en.md`). Third-party bodies remain free; a new body `_Venus` can be added in a minor release without an RFC (additive, like a new calendar bridge).

Outside the freeze: any change to `epoch_Mars`, `epoch_Moon`, `day_seconds_Mars`, `day_seconds_Moon` requires a new project (ATS 2).

## 8. Non-normative annex — relativistic corrections

A clock on the lunar surface ticks **roughly 58.7 µs faster per day** than a UTC clock on Earth's surface (cf. NIST 2024, NASA *Coordinated Lunar Time* proposal). Cumulative differential over 50 years = ≈ 1.07 s.

A clock on the Martian surface (1 g_Mars + equatorial altitude) is even more complex (Mars 2024 GCM model).

**These corrections are below the default `ATS_DECIMALS = 5` precision** (1 / 100 000 day ≈ 864 ms, or 864 000 µs ≈ 14 700× larger than the daily lunar offset). For a 5-digit instant, **they are negligible over centuries**.

Implementations requiring sub-millisecond precision on non-Earth bodies **must** maintain their own TAI ↔ local-surface correction tables.

## 9. Conformance vectors

Two additional sets:
- `docs/spec/test-vectors-multi-planetary-mars.json` — 10 UTC ↔ Δ_Mars instants covering the epoch, round sols, complex fractions, dates ≥ 2050.
- `docs/spec/test-vectors-multi-planetary-moon.json` — 10 UTC ↔ Δ_Moon instants with the same profiles.

Each vector:
```json
{
  "label": "Description",
  "utc": "1997-07-04T16:56:55Z",
  "ats_canonical": "T+ Δ_Mars 0.0.0.0.00000"
}
```

## 10. Reference implementations

- `code/ats_multi_planetary.py` (Python) — generic `Body` class parameterized by `(epoch, day_seconds)`, plus `EARTH`, `MARS`, `MOON` singletons. Δ/Δd algebra preserved per body.
- JS: port planned for v1.0 (cf. ROADMAP).

Conversions rely on the existing `_split_abs_days_floor` helper — no change to `code/ats.py` is needed for Earth (full backward compatibility).
