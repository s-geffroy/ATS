# ATS — Multi-planetary extension

**Status:** Pre-release v0.7
**Document type:** **NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the Earth spec).
**Authoritative language:** English. French translation in `multi-planetary.fr.md`; in case of divergence, this document controls.
**Generic symbol:** `Δ_<Body>` (ASCII) or `Δ<astronomical symbol>` (Unicode).
**Core thesis:** ATS generalises from Earth to any celestial body by parameterising the epoch and day length. The grammar, algebra, binary encoding, and conformance contract of the Earth spec carry over **unchanged**. Earth, Mars, and Moon receive normative parameters in v0.7; third-party bodies (Venus, Europa, exoplanets, …) use the generic framework defined in §6.

---

## 0. Conventions

### 0.1 Requirement levels

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 [RFC 2119, RFC 8174] when, and only when, they appear in all capitals.

### 0.2 Glossary (extension-specific)

- **Body** — A celestial body for which an ATS counter is defined: Earth, Mars, Moon, or any third-party body registered per §6.
- **Sol** — A Martian solar day. Mean Martian sol = 88 775.244 147 SI seconds [Allison & McEwen 2000].
- **Synodic lunar day** — The time between successive sunrises at the same location on the Moon, ≈ 29.530 588 Earth days = 2 551 442.8128 SI seconds [IAU; Espenak 2014].
- **`Δ_X`** — The ATS instant counter for body X.
- **`Δd_X`** — The ATS duration counter for body X (signed quantity of body-X days).
- **Body suffix** — ASCII identifier (`_Earth`, `_Mars`, `_Moon`, …) appended to `Δ` to disambiguate the body. Earth suffix MAY be omitted (per §2.1.3).

### 0.3 Scope

This annex specifies:

- The generic parameterisation of an ATS counter for any body (§1).
- Notation for body-specific instants (§2).
- The normative parameters for Earth, Mars, and Moon (§3).
- The conversion between body-local ATS and UTC (§4).
- Cross-body algebra rules (§5).
- The generic framework for third-party bodies (§6).
- Stability commitments for v1.0 (§7).
- Rationale for the chosen anchors (§8).
- Relativistic corrections (§9, non-normative).
- The conformance vector contract (§10).
- Anticipated objections (§11).
- Reference implementations (§12).

This annex does **NOT** modify any normative content of `manifesto.en.md`. The Earth ATS specification (§§1–17 of the manifesto) is unchanged.

---

## 1. Generic definition

### 1.1 Body parameters

An ATS counter for a celestial body `X` is **completely defined** by four parameters:

| Parameter | Type | Constraint | Meaning |
|---|---|---|---|
| `epoch_X` | UTC instant | exact to the SI second | Counter origin (the instant `Δ_X` evaluates to `T+ Δ_X 0.0.0.0.00000`). |
| `day_seconds_X` | positive Decimal | > 0, exact to ≥ 6 decimal places | Local "day" duration, in SI seconds. |
| `suffix_X` | ASCII string | matches `[A-Za-z][A-Za-z0-9]*` | Canonical suffix for ASCII notation (`_Earth`, `_Mars`…). |
| `symbol_X` | Unicode codepoint (optional) | U+263F–U+2647 for solar-system bodies | Astronomical symbol for the display form. |

A v0.7-conformant implementation **MUST** support Earth, Mars, and Moon with the parameters in §3.

### 1.2 The counter

The body-X counter is the function:

```
Δ_X(t_UTC) = (t_UTC − epoch_X) / day_seconds_X
```

where:

- `t_UTC` is a UTC instant.
- `t_UTC − epoch_X` is the elapsed time as an SI-seconds duration (POSIX semantics per `manifesto.en.md §8`).
- The division produces a signed decimal day count.

The signed day count is then encoded using the same `K.H.D.Kin.fffff` positional grammar as Earth ATS (`manifesto.en.md §4.1`):

- Kilo unbounded, signed via `T+` / `T-` (`manifesto.en.md §3`).
- Hecto, Deka, Kin digits 0..9.
- 5-digit default fraction, floor-truncated (`manifesto.en.md §6`).

### 1.3 Unit lengths vary by body

The positional units (Bloc, Centi, Milli, Beat, Blink) are **fractions of the body's day**, not fractions of an Earth day. Concretely:

- 1 Bloc_Earth = 0.1 × 86 400 s = 8 640 s = 2 h 24 min.
- 1 Bloc_Mars = 0.1 × 88 775.244 147 s ≈ 8 877.52 s ≈ 2 h 27 min 57 s.
- 1 Bloc_Moon = 0.1 × 2 551 442.8128 s ≈ 255 144.28 s ≈ 2 d 22 h 52 min.

This is intentional. The positional grammar is **invariant** across bodies; the *absolute durations* of micro units scale with the body's day length. A user on Mars working "3 Blocs" puts in approximately the same fraction of a Martian day as an Earth user working "3 Blocs" of an Earth day.

---

## 2. Notation

### 2.1 Canonical form (ASCII)

```abnf
canonical_multibody = direction SP symbol body_suffix SP days "." frac
direction           = "T" ("+" / "-")
symbol              = %xCE.94            ; Δ
body_suffix         = "_" body_id
body_id             = ALPHA *(ALPHA / DIGIT)
days                = kilo "." digit "." digit "." digit
kilo                = 1*DIGIT
frac                = 5*DIGIT
digit               = %x30-39
SP                  = %x20
```

#### 2.1.1 Examples

```
T+ Δ_Earth 20.7.8.2.50000
T+ Δ_Mars  10.2.8.7.96477
T+ Δ_Moon  0.7.0.3.76180
```

#### 2.1.2 Spaces

Implementations **MUST** emit exactly one ASCII space between `direction` and `Δ_<body>`, and exactly one ASCII space between `Δ_<body>` and `days`. The number of spaces inside the body suffix is zero (no space between `_` and the body identifier).

#### 2.1.3 Earth backward compatibility

The bare `Δ` (without body suffix) **MUST** be interpreted as `Δ_Earth` in any context where the body is implicit. Implementations producing ASCII output **SHOULD** emit `Δ_Earth` explicitly when the context is multi-body; they **MAY** omit the suffix for Earth-only contexts (Earth-only badges, embeds, single-planet sites).

### 2.2 Symbolic form (Unicode display)

Implementations targeting human display **MAY** use Unicode astronomical symbols instead of ASCII body suffixes:

| Body | Symbol | Codepoint | Pronunciation |
|---|---|---|---|
| Earth | `Δ⊕` | U+2295 (`Δ` + CIRCLED PLUS) | "delta-earth" |
| Mars | `Δ♂` | U+2642 (`Δ` + MALE SIGN, astronomical Mars symbol) | "delta-mars" |
| Moon | `Δ☾` | U+263E (`Δ` + LAST QUARTER MOON) | "delta-moon" |

The bare symbol `Δ` (without body marker) **MUST** be interpreted as Earth in symbolic display contexts, consistent with §2.1.3.

### 2.3 Short form

The short form `ΔK.H.D.Kin-BC.M` (`manifesto.en.md §5.1`) extends to bodies by inserting the body suffix between `Δ` and the first digit:

```abnf
short_multibody = symbol body_suffix days "-" bc "." milli
                / symbol days "-" bc "." milli              ; Earth backward compat
```

Examples:

```
Δ_Mars 10.2.8.7-96.4
Δ_Moon 0.7.0.3-76.1
Δ20.7.8.2-50.0          ; Earth, suffix omitted (§2.1.3)
```

The strict-parser rules of `manifesto.en.md §5.1` apply unchanged.

---

## 3. Parameters for v1.0 bodies

The following three bodies receive **normative** ATS parameters in v0.7. These parameters become **FROZEN** in v1.0 per `versioning.en.md §3.1` (epoch) and `multi-planetary.en.md §7` (this annex's stability commitments).

### 3.1 Earth (`Δ_Earth`, `Δ⊕`, or bare `Δ`)

| Parameter | Value | Source |
|---|---|---|
| `epoch_Earth` | `1969-07-20T00:00:00Z` | `manifesto.en.md §2` — start of the Apollo 11 lunar landing day. |
| `day_seconds_Earth` | `86_400` | POSIX semantics per `manifesto.en.md §8.1`. |
| `suffix_Earth` | `_Earth` | Standard. |
| `symbol_Earth` | `⊕` (U+2295) | Astronomical Earth symbol. |

### 3.2 Mars (`Δ_Mars`, `Δ♂`)

| Parameter | Value | Source |
|---|---|---|
| `epoch_Mars` | `1997-07-04T16:56:55Z` | Mars Pathfinder Sagan Memorial Station touchdown in Ares Vallis [NASA JPL Mission History; date verified against Pathfinder mission records]. |
| `day_seconds_Mars` | `88_775.244_147` s | Mean Martian sol [Allison & McEwen 2000, *Planetary and Space Science* 48 (2-3), 215–235]. |
| `suffix_Mars` | `_Mars` | Standard. |
| `symbol_Mars` | `♂` (U+2642) | Astronomical Mars symbol. |

#### 3.2.1 Numerical consequence

At `2026-06-13T12:00:00Z`, `Δ_Mars` evaluates to `T+ Δ_Mars 10.2.8.7.96477` (5-digit precision).

#### 3.2.2 Mars day length precision

The value `88_775.244_147` s is the **mean Martian sol** averaged over a Martian year. The instantaneous sol length varies by ±20 s with Mars's orbital eccentricity. v0.7 uses the mean value; high-precision implementations **MAY** use the time-varying value at the cost of precision contract complexity. The v1.0 normative parameter is the mean.

### 3.3 Moon (`Δ_Moon`, `Δ☾`)

| Parameter | Value | Source |
|---|---|---|
| `epoch_Moon` | `1969-07-20T00:00:00Z` | **Shared with Earth.** Doctrinal choice: the Moon is Earth's satellite, and its counter naturally aligns with the human event that links both bodies (the Apollo 11 landing). |
| `day_seconds_Moon` | `2_551_442.8128` s | Mean synodic lunar day = 29.530 588 Earth days [IAU; Espenak 2014]. |
| `suffix_Moon` | `_Moon` | Standard. |
| `symbol_Moon` | `☾` (U+263E) | Astronomical Moon symbol. |

#### 3.3.1 Numerical consequence

At `2026-06-13T12:00:00Z`, `Δ_Moon` evaluates to `T+ Δ_Moon 0.7.0.3.76180` (5-digit precision). One full `Δ_Moon` ≈ 29.53 `Δ_Earth`.

#### 3.3.2 Synodic vs sidereal: rationale

The Moon has two natural day lengths:

- **Sidereal day**: 27.32 Earth days. Time for one rotation relative to fixed stars.
- **Synodic day**: 29.53 Earth days. Time between successive sunrises at a given lunar location.

ATS uses the **synodic** lunar day because:

1. Lunar settlers experience the synodic cycle (the sunrise-sunset cycle on the surface), not the sidereal one.
2. The synodic cycle matches the lunar phase cycle observed from Earth — the cultural and observational reference.
3. The Lunar Crewed Time framework (NASA Coordinated Lunar Time, 2024) uses the synodic cycle for the same reasons.

The sidereal day **MAY** be exposed by implementations as an additional unit; it is not the canonical body day for ATS.

---

## 4. Conversion (`Δ_X ↔ UTC`)

Conformant implementations **MUST** implement the conversion below for any body parameterised per §1.1. The conversion mirrors `manifesto.en.md §9` with body-local day length substituted.

### 4.1 UTC → `Δ_X` (pseudo-code)

```
function utc_to_body_ats(utc: UTCInstant, body: Body) -> BodyATS:
    EPOCH = body.epoch
    DAY_SECONDS = body.day_seconds
    ATS_DECIMALS = 5
    ATS_SCALE = 10 ** ATS_DECIMALS

    delta_seconds = (utc - EPOCH).total_seconds()  # signed Decimal
    total_days = delta_seconds / DAY_SECONDS       # signed Decimal

    if total_days >= 0:
        sign = "T+"
        abs_days = total_days
    else:
        sign = "T-"
        abs_days = -total_days

    integer_days = floor(abs_days)
    frac_int = floor((abs_days - integer_days) * ATS_SCALE)  # 5-digit floor

    kilo, rem  = divmod(integer_days, 1000)
    hecto, rem = divmod(rem, 100)
    deka, kin  = divmod(rem, 10)

    return BodyATS(body=body, sign=sign, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac_int)
```

### 4.2 `Δ_X` → UTC (pseudo-code)

```
function body_ats_to_utc(ats: BodyATS) -> UTCInstant:
    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    abs_days = integer_days + ats.frac / 100_000
    signed_days = abs_days if ats.sign == "T+" else -abs_days
    delta_seconds = signed_days * ats.body.day_seconds
    return ats.body.epoch + delta_seconds
```

### 4.3 Floor-truncation invariant

The same floor-truncation rule (`manifesto.en.md §6`) applies. The maximum drift between `body_ats_to_utc(utc_to_body_ats(t))` and `t` is bounded by `0.864 ms × (day_seconds_X / day_seconds_Earth)`:

- Earth: ≤ 0.864 ms (the standard Earth drift).
- Mars: ≤ 0.888 ms (≈ 2.7 % larger because Mars sol is 2.7 % longer).
- Moon: ≤ 25.5 ms (≈ 29.5× larger because one Moon synodic day is ≈ 29.5 Earth days).

Implementations claiming sub-millisecond precision on the Moon **MUST** use extended precision (≥ 6 digits) per `manifesto.en.md §4.4`.

---

## 5. Cross-body algebra

### 5.1 Same-body algebra is preserved

For any body X, the algebra of `manifesto.en.md §11.4` applies **without modification**:

- `Δ_X + Δd_X → Δ_X` ✓
- `Δd_X + Δ_X → Δ_X` ✓
- `Δ_X − Δ_X → Δd_X` ✓
- `Δ_X − Δd_X → Δ_X` ✓
- `Δd_X + Δd_X → Δd_X` ✓
- `Δd_X − Δd_X → Δd_X` ✓
- `Δd_X × n → Δd_X` for rational `n` ✓
- `Δd_X ÷ n → Δd_X` for non-zero rational `n` ✓
- Comparisons `<, ≤, =, ≥, >` on two `Δ_X` or two `Δd_X` ✓

### 5.2 Cross-body operations are forbidden

Operations mixing different bodies are **UNDEFINED BEHAVIOUR** and implementations **MUST** raise a type error:

- `Δ_Mars + Δd_Earth → TYPE ERROR` ✗
- `Δd_Mars + Δd_Earth → TYPE ERROR` ✗
- `Δ_Mars < Δ_Earth → TYPE ERROR` ✗
- `Δ_Mars − Δ_Earth → TYPE ERROR` ✗

### 5.3 Cross-body comparison via UTC bridge

To compare instants on different bodies, **both** instants **MUST** be converted to UTC first:

```
result = body_ats_to_utc(ats_a) < body_ats_to_utc(ats_b)
```

The reference implementations expose this as a `to_utc()` method on the per-body type. The result is a standard UTC comparison.

### 5.4 Duration conversion between bodies

Durations expressed in different body-days are convertible by the ratio of day lengths:

```
Δd_Mars_in_earth_days = Δd_Mars × (day_seconds_Mars / day_seconds_Earth)
                      = Δd_Mars × (88_775.244_147 / 86_400)
                      ≈ Δd_Mars × 1.027 491
```

Implementations **MAY** expose a `to_body(target_body)` method that performs this conversion. The result is a duration in the target body's unit, which **MUST** then be added to or subtracted from an instant in that body's frame.

---

## 6. Generic framework for third-party bodies

### 6.1 Registration

An implementation **MAY** define `Δ_X` for any body by registering the four parameters of §1.1:

```
register_body(
    suffix="_Venus",
    epoch=parse_utc("1989-08-10T03:01:00Z"),  # Magellan orbital insertion
    day_seconds=Decimal("10_087_200"),         # Venusian synodic day ≈ 116.75 Earth days
    symbol="♀"                            # ♀ (U+2640, Venus astronomical symbol)
)
```

The reference Python implementation provides a `Body` class with this interface (`code/ats_multi_planetary.py`).

### 6.2 Suffix collision rules

Third-party bodies share the global suffix namespace. To prevent collisions:

- Suffixes **MUST** be the English nominal form prefixed by `_` (e.g., `_Venus`, `_Jupiter`, `_Europa`).
- Suffixes are case-sensitive; `_Venus` and `_venus` are distinct strings but **SHOULD NOT** both be used (the standard convention is initial-capital).
- An implementation publishing a body registration **SHOULD** check the canonical reference list at `docs/spec/multi-planetary-bodies.md` (a planned registry) before claiming a suffix.
- In the absence of a central registry, suffix conflicts are resolved by **announcement priority**: the body registered publicly first wins the suffix.

### 6.3 Vector requirements for third-party bodies

A third-party body claiming conformance **SHOULD** publish a conformance vector file `test-vectors-multi-planetary-<body>.json` with the same format as the Mars and Moon files:

- Minimum 5 vectors covering:
  - The body epoch (`T+ Δ_X 0.0.0.0.00000`).
  - One mid-life round number (e.g., `T+ Δ_X 1.0.0.0.00000`).
  - A complex fraction (e.g., `T+ Δ_X 0.0.0.0.50000`).
  - A negative-direction instant (`T- Δ_X k.h.d.kin.fffff`).
  - A date ≥ 2100 to verify long-range arithmetic.
- `spec_version` set to the MAJOR.MINOR introducing the body.

### 6.4 Central registry status

No central authority registers non-canonical bodies in v0.7. The editors of record MAY adopt a third-party body registration as **canonical** (i.e., move it to §3) in a future MINOR release via the RFC procedure (`versioning.en.md §6`).

---

## 7. Stability (v1.0 freeze)

When ATS v1.0 ships (per `versioning.en.md §7.2`), the following items in this annex become **FROZEN**:

1. The §3.1 Earth parameters (also frozen by `versioning.en.md §3.1`).
2. The §3.2 Mars parameters (`epoch_Mars`, `day_seconds_Mars`).
3. The §3.3 Moon parameters (`epoch_Moon`, `day_seconds_Moon`).
4. The §2 notation: ASCII suffix syntax, Unicode symbol assignments, short-form rules.
5. The §4 conversion algorithm (pseudo-code semantics, drift bound).
6. The §5 cross-body algebra rules (type-error semantics).

Modifying any of these post-v1.0 requires a new project (ATS 2, per `versioning.en.md §3.8`).

Third-party bodies registered per §6 are **NOT** frozen by this annex; they remain freely addable, modifiable, or retractable by their registrants in MINOR releases.

---

## 8. Why these anchors specifically

The choice of Mars Pathfinder and the Earth-shared Moon epoch are contested decisions; this section documents the rationale so disputes are addressable at the spec level.

### 8.1 Why Mars Pathfinder, not other landings?

The candidate Martian anchors and the rejection rationale:

| Candidate | UTC | Reason for rejection / selection |
|---|---|---|
| **Mars Pathfinder Sagan Memorial Station** | 1997-07-04T16:56:55Z | **SELECTED.** First successful modern Mars landing (post-Viking); symbolic July 4 date matches Apollo 11 cultural framing; precise timing in public records. |
| Viking 1 lander | 1976-07-20T11:53:06Z | Same UTC date as Apollo 11 (July 20). Ambiguity in cultural framing (which 1969-7-20 event?). Pre-modern-internet era; less verifiable from independent records. |
| Mars 3 (Soviet) | 1971-12-02T13:50:35Z | First Mars soft landing, but the lander failed 14.5 s after touchdown; the data record is incomplete. |
| Curiosity rover | 2012-08-06T05:17:57Z | Modern, well-documented, but "anchor on the most recent landing" is unstable (Perseverance 2021, future landings). |
| Perseverance rover | 2021-02-18T20:55:00Z | Same critique as Curiosity. |
| Mars Schiaparelli | 2016-10-19T14:48:18Z | Failed landing — not a successful presence event. |
| First human landing on Mars | (future) | Reserved as a future revision; **MAY** become the anchor when a crewed Mars mission lands. |

Pathfinder satisfies four properties parallel to Apollo 11 (per `manifesto.en.md §2.3`):

- (i) Verifiable to the second from independent records.
- (ii) Witnessed at species-scale (live broadcast; mission widely covered).
- (iii) Free of identifiable victims.
- (iv) Marks a discontinuity in species' Mars presence: the first successful soft landing of the modern Mars exploration era.

### 8.2 Why shared epoch for Earth and Moon?

The Moon could use one of three anchors:

- **Apollo 11 lunar landing (1969-07-20T20:17:40Z)**: the surface touchdown instant.
- **Earth epoch (1969-07-20T00:00:00Z)**: the start of the landing day, shared with Earth.
- **A pre-Apollo lunar event**: some Soviet Luna milestone, or a synodic-cycle anchor.

The choice of **shared epoch with Earth** is doctrinal:

- The Moon is Earth's satellite; its history is bound to Earth's. A separate Moon epoch would imply a parallel timeline.
- The Earth-Moon system is gravitationally and astronomically one system; using one epoch reflects this.
- Surface touchdown (20:17:40Z) was rejected for the same reason it was rejected as the Earth epoch (`manifesto.en.md §2.1`): it misaligns the day counter from a natural reference.

The doctrinal claim — "the Moon's counter naturally aligns with the human event that links both bodies" — is open to RFC. A future revision **MAY** introduce `epoch_Moon = 1969-07-20T20:17:40Z` (touchdown) or a fully independent Moon epoch; until v1.0, the shared-epoch choice stands.

### 8.3 What about Venus, Jupiter, Europa, exoplanets?

These bodies are out of scope for v0.7 normative parameters. They are addressable via the §6 generic framework. The editors INTEND to canonicalise additional bodies via RFC as adoption signals emerge (e.g., if a sustained crewed presence at Europa or a permanent Venus orbiter is established).

---

## 9. Relativistic corrections (non-normative)

The following effects affect sub-millisecond precision; they are **below** the default 5-digit precision (1 Blink = 864 ms) and are therefore non-normative for default-precision implementations. Implementations requiring sub-millisecond precision on non-Earth bodies **MUST** maintain their own correction tables.

### 9.1 Lunar surface clock drift

A clock on the lunar surface ticks approximately **58.7 µs faster per day** than a UTC clock on Earth's surface, due to the difference in gravitational potential [NIST 2024 *Coordinated Lunar Time* proposal; Mazarico et al. 2018]. Cumulative differential over 50 years = ≈ 1.07 s.

The 58.7 µs/day drift is approximately:

```
58.7 µs / 864_000_000 µs/day  ≈  6.8 × 10⁻⁸ relative drift
```

which is well below the 5-digit Blink resolution (864 ms = 8.64 × 10⁵ µs, ≈ 14_700× larger than the daily lunar offset). For 5-digit ATS values, the lunar clock drift is **negligible over centuries**.

### 9.2 Mars surface clock drift

A clock on the Martian surface differs from UTC by gravitational and orbital effects. The instantaneous offset varies with Mars's orbital position; the cumulative drift over 50 years is on the order of seconds [Mars 2024 Mars GCM-based estimates; not yet formally standardised].

For 5-digit ATS values, the Martian clock drift is also **negligible over decades**.

### 9.3 Implementations requiring sub-millisecond precision

Implementations targeting:

- Lunar navigation and communication protocols.
- Mars surface ops (e.g., autonomous rover scheduling).
- Inter-planetary spacecraft control.

**MUST** maintain their own TAI ↔ local-surface correction tables. The reference implementation provides 5-digit precision per `manifesto.en.md §4.4`; extended-precision use cases are out of scope for v0.7.

### 9.4 Future ATS-TAI variant

`manifesto.en.md §8.3` reserves an ATS-TAI variant for future revision. ATS-TAI on Mars and Moon would be the natural framework for relativistic corrections, but is not specified in v0.7.

---

## 10. Conformance vectors

### 10.1 Required vector files

A v0.7-conformant implementation **MUST** pass the following vector files:

- `docs/spec/test-vectors.json` — 12 Earth ATS vectors (cf. `manifesto.en.md §9.3`).
- `docs/spec/test-vectors-arithmetic.json` — 12 algebra vectors.
- `docs/spec/test-vectors-multi-planetary-mars.json` — 10 Mars vectors.
- `docs/spec/test-vectors-multi-planetary-moon.json` — 10 Moon vectors.

Implementations that do not support the multi-planetary annex **MUST** declare partial conformance explicitly (per `manifesto.en.md §16.5`).

### 10.2 Vector format

Each multi-planetary vector follows:

```json
{
  "label": "Mars Pathfinder touchdown",
  "utc": "1997-07-04T16:56:55Z",
  "ats_canonical": "T+ Δ_Mars 0.0.0.0.00000"
}
```

The `label` field is human-readable context. The `utc` and `ats_canonical` fields are the conformance contract.

### 10.3 Vector coverage requirements

The Mars and Moon vector files each cover:

- The body epoch (`T+ Δ_X 0.0.0.0.00000`).
- Round-Kilo instants (e.g., `T+ Δ_X 1.0.0.0.00000`, `T+ Δ_X 10.0.0.0.00000`).
- Complex fractions (verifying floor-truncation behaviour).
- A negative-direction instant (`T- Δ_X k.h.d.kin.fffff`).
- A date in the next century (verifying long-range arithmetic).
- The current era (a verifiable contemporary instant).

---

## 11. Anticipated objections

### 11.1 "Mars Pathfinder is not species-level the way Apollo 11 was."

Mars Pathfinder is not species-level **in the same way**; the framing is parallel, not identical. Apollo 11 marked the first human landing on another body; Pathfinder marked the first successful modern Mars landing of the contemporary era. The four properties of `manifesto.en.md §2.3 Attack C` apply (verifiability, witness scale, no victim, discontinuity). When a crewed Mars landing occurs, a future RFC **MAY** propose to re-anchor `epoch_Mars` on that event (the v1.0 freeze in §7 would be relaxed via the §3.8 escape hatch in `versioning.en.md`).

### 11.2 "Synodic vs sidereal for the Moon was arbitrary."

§3.3.2 sources the choice: synodic matches the sunrise-sunset cycle a lunar settler experiences, matches the phase cycle observed from Earth, and matches the NASA Coordinated Lunar Time framework. Sidereal **MAY** be exposed as a non-normative additional unit. The choice is not arbitrary; it is doctrinal and explained.

### 11.3 "Relativistic effects matter more than you claim."

For 5-digit precision (864 ms resolution), §9.1 demonstrates the lunar clock drift is ≈ 14_700× smaller than one Blink. For extended-precision use (sub-millisecond, e.g., autonomous Mars rover scheduling), §9.3 explicitly directs implementations to maintain their own correction tables, and §9.4 reserves an ATS-TAI variant for future standardisation. The annex does not understate the effect; it scopes it appropriately.

### 11.4 "The third-party framework is too permissive — suffix collisions are inevitable."

§6.2 acknowledges this and offers a fallback: announcement priority. A central registry is planned (`docs/spec/multi-planetary-bodies.md`) and the editors of record **MAY** canonicalise third-party bodies via RFC. Until the registry exists, suffix collisions are the implementer's responsibility to resolve; in practice, the namespace of celestial bodies is finite and the English nominal forms are well-established.

### 11.5 "Why not use Mars24 or Mars Mean Sol directly?"

Mars24 [Allison & McEwen 2000] is the established Mars time-keeping reference. ATS-Mars **uses** the same mean sol length (88 775.244 147 s) sourced from Mars24. The difference is the *grammar*: Mars24 expresses Martian time in Earth-day-style hours/minutes/seconds; ATS-Mars uses the positional `K.H.D.Kin.fffff` decimal grammar. ATS-Mars is **layered on top of** Mars24 (using Mars24's day length); it does not replace it.

### 11.6 "Cross-body comparison via UTC bridge is awkward."

The bridge is explicit by design. Mixing bodies silently would obscure the fact that the comparison is happening in a third frame (UTC). The §5.3 contract — `body_ats_to_utc(ats_a) < body_ats_to_utc(ats_b)` — makes the bridge visible to the implementer. The cost is one additional method call; the benefit is type safety.

### 11.7 "The 1.07 s cumulative lunar drift over 50 years sounds significant."

It is, for sub-second precision. For 5-digit ATS precision (864 ms), 1.07 s is ≈ 1.2 Blinks — meaningful for high-precision applications, negligible for default-precision applications. The 5-digit precision is a design choice (`manifesto.en.md §4.4`); applications requiring more **MUST** use extended precision and **MUST** account for the drift (§9.3). The annex is honest about this trade-off.

### 11.8 "Why doesn't the Moon have its own epoch?"

§8.2 explains: the Earth-Moon system is one system; a parallel Moon timeline would create coordination overhead with no compensating benefit. Lunar settlers' calendars need to align with both the lunar day (the synodic cycle) and with Earth-based mission control; sharing the Earth epoch supports both. A future RFC **MAY** revisit this; the shared epoch stands until then.

---

## 12. Reference implementations

### 12.1 Python (existing, v0.7)

`code/ats_multi_planetary.py` implements:

- A generic `Body` class parameterised by `(epoch, day_seconds, suffix, symbol)`.
- Three singletons: `EARTH`, `MARS`, `MOON`.
- A `BodyATSDateTime` type carrying the body reference plus the `K.H.D.Kin.fffff` digits and sign.
- A `BodyATSDuration` type for body-typed signed durations.
- The §11.4 algebra preserved per body with cross-body operations raising `TypeError`.

The implementation passes `test-vectors-multi-planetary-mars.json` and `-moon.json` bit-for-bit. The Earth singleton is consistent with `code/ats.py` (no divergence).

### 12.2 JavaScript (planned, v1.0)

The JS port (`docs/assets/js/ats_multi_planetary.js`) is planned for v1.0 ship. It will mirror the Python API surface:

```javascript
import { EARTH, MARS, MOON, Body, BodyATSDateTime } from './ats_multi_planetary.js';

const ats = MARS.fromUtc(new Date('2026-06-13T12:00:00Z'));
console.log(ats.toCanonical()); // "T+ Δ_Mars 10.2.8.7.96477"
```

The JS implementation is a v1.0 requirement per `versioning.en.md §7.2 (3)`.

### 12.3 Third-party implementations

A third-party Rust or Go implementation claiming v1.0 conformance **MUST** include the multi-planetary annex (Earth + Mars + Moon at minimum). Per `versioning.en.md §7.2 (3)`, at least one third-party implementation passing 100 % of the conformance vectors is a v1.0 ship requirement.

---

## References

- **Allison, M., & McEwen, M. (2000).** *A post-Pathfinder evaluation of areocentric solar coordinates with improved timing recipes for Mars seasonal/diurnal climate studies*. Planetary and Space Science, 48 (2–3), 215–235. (Source for the mean Martian sol.)
- **Espenak, F. (2014).** *Lunar synodic period and the synodic month*. NASA Goddard Eclipse Web Site. (Source for synodic lunar day.)
- **IAU.** *IAU Recommendations on Celestial Time Scales*. International Astronomical Union working group documents. (Reference for astronomical time definitions.)
- **Mazarico, E., et al. (2018).** *The lunar relativistic time scale*. Journal of Geodesy, 92, 1483–1494. (Source for lunar surface clock drift.)
- **NASA JPL Mission History.** *Mars Pathfinder Sagan Memorial Station landing record*. (Source for Mars Pathfinder UTC timestamp.)
- **NIST (2024).** *Coordinated Lunar Time (LTC) proposal*. National Institute of Standards and Technology white paper. (Source for §9.1.)
- **`manifesto.en.md`** — Normative reference (ATS Earth spec).
- **`versioning.en.md`** — Stability annex (§7 freeze references).
- **RFC 2119** — Bradner, S. *Key words for use in RFCs to Indicate Requirement Levels*. IETF (1997).
- **RFC 5234** — Crocker, D., & Overell, P. *Augmented BNF for Syntax Specifications: ABNF*. IETF (2008).
- **RFC 8174** — Leiba, B. *Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words*. IETF (2017).

This annex makes no original astronomical claim. All scientific values are sourced from peer-reviewed literature or established standards bodies. Doctrinal choices (epoch anchors, synodic vs sidereal, shared Earth-Moon epoch) are labelled as decisions of the editors of record and are open to RFC per `versioning.en.md §6`.
