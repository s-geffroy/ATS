# The Apollonian Time System (ATS)

**Status:** Pre-release v0.7
**Symbol:** Δ (U+0394 GREEK CAPITAL LETTER DELTA)
**Authoritative language:** English. The French translation (`manifesto.fr.md`) is provided for accessibility; in case of divergence, this document controls.
**Document type:** Normative specification with non-normative annexes.
**Canonical location:** `https://github.com/s-geffroy/ATS` — file `docs/spec/manifesto.en.md`.
**Core assertion:** ATS is the universal computational time standard for networked, multi-site, and multi-planetary civilisation. It replaces the Gregorian *year / month / week + local time* model with a single, decimal, linear counter anchored on a species-level technological milestone.

---

## 0. Conventions

### 0.1 Requirement levels

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14 [RFC 2119, RFC 8174] when, and only when, they appear in all capitals.

### 0.2 Notation

- Grammars are expressed in ABNF [RFC 5234].
- Pseudo-code uses a Python-flavoured imperative form for legibility; conformant implementations **MAY** use any programming language.
- Hexadecimal literals are prefixed `0x`. Integer literals use the `123_456` underscore-separator convention.
- UTC instants are written in ISO 8601 / RFC 3339 form (`YYYY-MM-DDTHH:MM:SS.ssssssZ`).
- Time intervals expressed as "seconds" refer to **SI seconds on the UTC time scale**, not TAI seconds, unless otherwise noted.

### 0.3 Glossary (condensed)

The full glossary is §17. Quick reference:

- **ATS** — Apollonian Time System; this standard.
- **Epoch** — The reference instant `1969-07-20T00:00:00Z` (§2).
- **Δ** — The ATS symbol, U+0394, UTF-8 bytes `0xCE 0x94`. Used as the instant prefix.
- **Δd** — Duration prefix (§11).
- **T+, T-** — Direction markers: post-epoch, pre-epoch (§3).
- **Kin, Deka, Hecto, Kilo** — Macro positional units (1, 10, 100, 1 000 days).
- **Bloc, Centi, Milli, Beat, Blink** — Micro positional units (0.1, 0.01, 0.001, 0.0001, 0.00001 day).
- **Canonical form** — Fully-qualified positional representation (§4).
- **Short form** — Conversational truncated representation (§5).
- **UTC** — Coordinated Universal Time as defined by ITU-R TF.460 and aligned via POSIX semantics in §8.

---

## 1. Scope

ATS is a **continuous coordinate system on the UTC time axis**: a deterministic, bijective mapping from a UTC instant `t` to a positional base-10 string `ats(t)`. The mapping is:

- **Linear** — `ats(t)` is the count of elapsed days (and day-fractions) since the epoch. There is no cyclic component.
- **Decimal** — all positional units are powers of 10; there is no mixed radix.
- **Universal** — there is exactly one ATS value per UTC instant. The system has no time-zone, locale, or calendar parameter.

Implementations **MUST** treat ATS values as identifiers of UTC instants. Implementations **MUST NOT** attach time-zone, locale, or calendar metadata to a stored ATS value. Software interfaces transporting ATS values **MUST NOT** carry a time-zone field.

The benefits ATS delivers, in order of priority:

1. **Unambiguous interchange** — two systems exchanging ATS values cannot disagree about the instant being referenced.
2. **Computational simplicity** — duration arithmetic, scheduling, and statistical comparison reduce to ordinary base-10 arithmetic.
3. **Long-horizon scalability** — Kilo is unbounded; the format remains stable across centuries and across celestial bodies (per the multi-planetary annex).
4. **Cultural neutrality** — the system has one anchor and one set of units, identical for every user.

### 1.1 What ATS is not

To prevent category errors and pre-empt avoidable disputes, four boundaries are made explicit:

1. **ATS is not a theory about the nature of time.** Relativistic effects (gravitational time dilation, frame dragging, simultaneity disagreements) apply to UTC and therefore to ATS unchanged. ATS inherits UTC's coordinate semantics; it asserts nothing additional about physics. The word "linear" in this document **MUST** be read as "linear coordinates on the UTC time axis", not as a metaphysical claim.

2. **ATS is not a replacement for cultural, religious, or civic calendars.** Lunar (Hebrew, Islamic), lunisolar (Chinese, Hindu), ecclesiastical (Liturgical), fiscal, academic, and civic calendars **MAY** coexist with ATS as independent presentations of the same UTC instant. ATS provides interoperability between such systems; it does not displace them. See §13.

3. **ATS is not a clock-synchronisation protocol.** NTP [RFC 5905], PTP [IEEE 1588], GNSS, and TAI dissemination feed ATS implementations. They do not compete with ATS. ATS is a *representation*, not a *clock*.

4. **ATS does not assert that base 10 is metaphysically privileged.** Base 10 is selected because its adoption friction across SI units, currencies, financial reporting, scientific notation, and digital computing is the lowest of any positional base. The choice is engineering, not numerology.

### 1.2 Biological alignment

ATS is not only convenient for computation; its unit ladder **tracks empirical biological cycles**. This alignment is not a coincidence of base-10 — it reflects the fact that the natural unit of human life is the solar day, and that human physiology subdivides that day in approximate base-10 ratios. Each ATS unit corresponds to a measured granularity of human cognition or behaviour.

**Micro units (intra-day) and chronobiology:**

| ATS unit | Duration | Biological correlate |
|---|---|---|
| **Kin** (1 day) | 24 h | Circadian cycle — sleep/wake, cortisol, core body temperature |
| **Bloc** (0.1 day) | 2 h 24 min | Ultradian rest–activity cycle — the natural span of deep focus before measurable fatigue, validated across vigilance, EEG, and basal hormonal studies (BRAC, Kleitman) |
| **Centi** (0.01 day) | 14 min 24 s | Micro-task focus — the span of sustained attention on a single task, congruent with the Pomodoro micro-block and meditation "sit" intervals |
| **Milli** (0.001 day) | 1 min 26 s | Slow respiratory regulation — 12 breaths at the calm pace of 6 breaths/min, the standard breathwork and meditation cadence |
| **Beat** (0.0001 day) | 8.64 s | Attention beat — the span of a single conversational turn, one inhale-exhale at active rest, or one heartbeat coupling cycle (HRV LF band) |
| **Blink** (0.00001 day) | 0.864 s | Reaction window — close to the upper bound of choice-reaction time and one slow voluntary eye blink |

**Macro units (cross-day) and chronosociology:**

| ATS unit | Duration | Biological / social correlate |
|---|---|---|
| **Kin** (1 day) | 24 h | The solar day — the reference unit of every chronobiological measurement |
| **Deka** (10 days) | ≈ 1.4 weeks | Work-rest oscillation — the practical span over which fatigue accumulates and recovery is meaningful (training periodisation, shift work studies) |
| **Hecto** (100 days) | ≈ 3.3 months | Season / planning quarter — the practical limit of human medium-term planning before priorities drift (OKR cadence, academic terms) |
| **Kilo** (1 000 days) | ≈ 2.7 years | Multi-year project — the typical span of focused research projects, electoral mandates short of legislative cycles, or sustained skill acquisition (10 000 hours ≈ 1.25 Kilo at 8 h/day) |
| Generation (informal, ≈ 10 000 days) | ≈ 27.4 years | Demographic generation turnover — useful only for multi-generational discourse (cf. §4.2 note) |

ATS is therefore not merely *imposed* on biology; the ladder is *legible* against biology. The Pomodoro Technique (≈ 25 min, between Centi and 2× Centi), the ultradian rhythm (90–120 min, close to one Bloc), the OKR quarter (≈ Hecto), and the "10 000-hour mastery" heuristic (≈ 1 Kilo of professional time) were all discovered independently of ATS. Each finds a normalised place in the ATS coordinate system.

> This alignment is **non-normative** — implementations cannot test for it, and the standard does not require any user to follow these correspondences. But the alignment is **integral to the rationale**: §1.1 states ATS does not assert base 10 is metaphysical; §1.2 explains why base 10 nonetheless lines up with measured human cycles once the solar day is the anchor.

---

## 2. Epoch (Point Zero)

ATS uses a verifiable, species-level technological milestone as its single reference instant: **the day on which a member of the human species first occupied, in person, the surface of a body other than Earth**.

- **Epoch event** — The Apollo 11 lunar landing day. Eagle touchdown is the witnessed instant; the epoch is set on the UTC midnight that begins that day.
- **Epoch in UTC** — `1969-07-20T00:00:00Z`.
- **Epoch in ATS** — `T+ Δ 0.0.0.0.00000`.
- **Touchdown instant** — `1969-07-20T20:17:40Z` is preserved as a remarkable point inside Δ 0 at `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6 in the intra-day breakdown).

### 2.1 Why the start of the day, not the touchdown instant

The epoch **MUST** be anchored on the UTC midnight of the landing date. The alternative (touchdown instant) would offset the day counter from UTC and make Bloc 5 fall at 08:17:40 UTC instead of 12:00 UTC. The chosen anchor preserves the property:

```
Bloc 5  ≡  12:00 UTC exactly
Bloc 0  ≡  00:00 UTC exactly
```

This property is load-bearing for the analog dial (`analog-clock.md`), for human pedagogy, and for the cron-driven `/api/now.json` snapshot. The touchdown moment is preserved as a celebrated point within Δ 0 so the cultural meaning is not lost.

### 2.2 Rejected alternative anchors

| Candidate | UTC | Reason for rejection |
|---|---|---|
| Apollo 11 touchdown instant | 1969-07-20T20:17:40Z | Misaligns the day counter from UTC: Bloc 5 falls at 08:17:40 UTC. Pedagogically and computationally confusing. |
| Sputnik 1 launch | 1957-10-04T19:28:34Z | Robotic; no member of the species left the planet. Marks human capability, not human presence elsewhere. |
| Hiroshima | 1945-08-06T08:15:00Z | Civilisation-marking, but the species would justifiably object to dating itself from harm. Rejected on humanistic grounds. |
| First powered flight (Wright) | 1903-12-17T15:35:00Z | Atmospheric only; species had not left its envelope. |
| Apollo 11 launch | 1969-07-16T13:32:00Z | Departure, not arrival. The relevant event is arrival on a body other than Earth. |
| First lunar EVA (Armstrong) | 1969-07-21T02:56:15Z | Symbolic but the landing precedes it; the EVA falls on the next UTC day (Δ 1). |
| Year 0 of any existing calendar | various | Religious or arbitrary; none provides species-level consensus. |
| Holocene start (≈ −10 000 BCE) | unknown to seconds | Fails verifiability to the second from independent records. |

### 2.3 The epoch withstands four common attacks

The choice of epoch is the most-contested decision in this specification. Four attacks recur and are answered normatively here, so dispute on the anchor is resolved at the level of the standard rather than carried into each implementation.

**Attack A — "Apollo 11 is American; the choice is nationalist."**
The *event* is dated; the *standard* is not. ATS uses Apollo 11 as the dating anchor only — not as a claim of national priority over time. Compare UTC: time is defined at the prime meridian, but no party claims UTC is "British". A standard is identified by the integer counter it emits, not by the cultural origin of its anchor. Conformant implementations and conformant users of ATS make no assertion about national priority.

**Attack B — "An anchor in 1969 makes pre-epoch dates inconvenient (large T- numbers)."**
All calendars share this problem: Gregorian uses negative years (BC/BCE); Hebrew, Islamic, and Holocene calendars push their epochs back to make positive numbers cover modern usage at the cost of pre-epoch dates being even further back. ATS deliberately privileges *post-epoch* dates because the post-Apollo era is when networked, multi-site computation begins — which is when a universal time standard becomes operationally necessary. Pre-epoch dates use T- and are mechanically symmetric (§3); the conversion is identical in both directions.

**Attack C — "Why not an abstract event (Big Bang, Holocene start, year zero of some calendar)?"**
A valid ATS epoch event **MUST** satisfy four properties:

  i. Verifiable to the second from independent records;
  ii. Witnessed at the scale of the species (live to hundreds of millions);
  iii. Free of identifiable human victims, so the standard does not commemorate harm;
  iv. Marks a discontinuity in the species' situation, not merely in its perception.

No XXth- or XXIst-century alternative satisfies all four. Abstract astronomical events fail (i). Religious events fail to be consensus-neutral. Acts of war fail (iii). The Apollo 11 landing is the unique consensual candidate.

**Attack D — "The Moon and Mars landings are also arbitrary. Why these and not Curiosity, Voyager, Cassini?"**
The multi-planetary annex (`multi-planetary.md`) addresses this. Each celestial body that requires its own ATS counter receives its own anchor, justified by the same four properties applied to that body's history. The Earth anchor and the Mars anchor are independent decisions; conflating them is a category error.

---

## 3. Directionality: T+ and T-

ATS is symmetric around the epoch.

- **T+** denotes elapsed time **after** the epoch.
- **T-** denotes elapsed time **before** the epoch.

In the **canonical form** (§4), the direction marker is REQUIRED. Implementations **MUST** emit either `T+` or `T-` and **MUST NOT** omit it. The shorthand "`Δ` alone" is forbidden in canonical form.

In the **short form** (§5), the direction marker is omitted; `T+` is assumed. Implementations decoding the short form **MUST** assume `T+` and **MAY** flag negative-direction usage as unsupported.

`T+ Δ 0.0.0.0.00000` and `T- Δ 0.0.0.0.00000` denote the same instant (the epoch). Implementations **MUST** treat them as equal.

---

## 4. Canonical representation

### 4.1 Canonical syntax (normative)

Canonical syntax in ABNF [RFC 5234]:

```
canonical    = direction SP delta SP days "." frac
direction    = "T" sign
sign         = "+" / "-"
delta        = %xCE.94            ; Δ (U+0394, UTF-8 0xCE 0x94)
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT            ; unbounded non-negative integer, no leading zeros except "0"
frac         = 5*DIGIT            ; default precision; longer is permitted (§4.4)
digit        = %x30-39
SP           = %x20               ; one ASCII space
```

Examples (current era, ≈ 57 years post-epoch, 12:00 UTC, 13 June 2026):

```
T+ Δ 20.7.8.2.50000
```

Implementations **MUST** emit exactly one ASCII space between `direction` and `delta`, and exactly one ASCII space between `delta` and `days`. Implementations **MUST** accept additional inner whitespace on input only if explicitly documented as a tolerance; the strict parser **MUST** reject extra whitespace.

### 4.2 Macro-time units (calendar)

ATS counts **days** using fixed base-10 places:

| Position | Name | Value | Function |
|---|---|---|---|
| `....X` | **Kin** | 1 day | The solar day |
| `...X.` | **Deka** | 10 days | Work-rest cycle |
| `..X..` | **Hecto** | 100 days | Season / planning quarter |
| `X....` | **Kilo** | 1 000 days | Mandate / multi-year project |

`Kilo` has no upper bound. As decades pass, the leading number grows freely (`20.x.x.x`, `100.x.x.x`, `1000.x.x.x`).

> **Informal vocabulary — "Generation".** ~10 000 days (≈ 27.4 years) is colloquially called a **Generation**. It is **NOT** a positional digit; it exists only in social and philosophical discourse (see Philosophy annex).

### 4.3 Micro-time units (clock)

The fraction of the day is decomposed into named places:

| Position | Name | Fraction | Approx. duration |
|---|---|---|---|
| `.X....` | **Bloc** | 0.1 day | 2 h 24 min |
| `..X...` | **Centi** | 0.01 day | 14 min 24 s |
| `...X..` | **Milli** | 0.001 day | 1 min 26.4 s |
| `....X.` | **Beat** | 0.0001 day | 8.64 s |
| `.....X` | **Blink** | 0.00001 day | 0.864 s |

### 4.4 Precision (variable)

The default canonical precision is **5 fractional digits** (down to Blink). Implementations **MAY** extend precision (e.g., 9 digits ≈ 0.0086 ms for scientific or network synchronisation use cases) by emitting additional digits after Blink. Implementations **MUST** declare the precision they emit, either out-of-band (schema, header) or by the count of digits actually present. Implementations **MAY** shorten precision for display; in that case the rounding policy of §6 applies.

---

## 5. Conversational format (human UI)

### 5.1 Short syntax (normative)

Short syntax in ABNF:

```
short        = delta days "-" bc "." milli
delta        = %xCE.94
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT
bc           = 2DIGIT             ; the 2-digit Bloc+Centi pair, zero-padded
milli        = DIGIT              ; single Milli digit
digit        = %x30-39
```

Example:

```
Δ20.7.8.2-50.0
```

**Mandatory properties of the short form** (implementations **MUST** enforce):

- There is **no whitespace** anywhere in the short form. A parser receiving inner whitespace **MUST** reject the input.
- There is **no direction marker**. `T+` is implied (§3).
- `Kin` is always emitted, even when zero, so the calendar reference is never lost.
- `bc` is always 2 digits, zero-padded; the value `5` is written `05`.
- `.milli` is always emitted, even when the Milli digit is `0`; the suffix is part of the format and pins the precision floor at ±86.4 s.
- The separator between `Kin` and `bc` is `-`; the separator between `bc` and `milli` is `.`. No other separators are permitted.

The legacy short form `ΔK.H.D.Kin/cc` (pre-v0.7) is **rejected**. Implementations **MUST NOT** accept it; they **MAY** emit a diagnostic suggesting the equivalent canonical form for conversion.

### 5.2 When to use which form

- **Canonical** — logs, storage, cryptographic signing, cross-system interoperation. URL-safe and filename-safe (only digits, dots, spaces).
- **Short** — UI, watches, conversation. Uses `-` between calendar and daily fraction, `.` before the Milli digit, no spaces.

Encoding both forms is REQUIRED of any user-facing implementation.

---

## 6. Rounding policy

ATS uses **strict floor truncation** when reducing precision for display.

### 6.1 Definition

Let `t` be the true elapsed-days value (a real number) and `p` an integer precision (number of fractional digits). The displayed value at precision `p`, denoted `display(t, p)`, is defined as:

```
display(t, p) = floor(t × 10^p) / 10^p
```

### 6.2 Invariants

For any `t ≥ 0` and any precision `p ≥ 0`:

- `display(t, p) ≤ t`         (monotonicity: never anticipate)
- `t − display(t, p) < 10^(−p)` (drift bound: at most one unit of precision)
- `display(t, p) ≤ display(t, p+1)` (refinement: more digits is never worse)

For `t < 0` (T- side), the same definition applies to `|t|` and the sign is preserved separately. Equivalently, on the T- side, `display` brings the value *toward* the epoch (since the magnitude shrinks under floor truncation).

### 6.3 Requirements

- Implementations **MUST** use floor truncation when reducing precision.
- Implementations **MUST NOT** use round-half-up, round-half-even, round-half-down, or any rounding mode that can produce `display(t, p) > t` (on the T+ side).
- The internal counter (the elapsed-days value) **MUST** be maintained at exact precision (rational or arbitrary-precision Decimal). Truncation applies only to *displayed* digits.

### 6.4 Rationale (against half-even)

Half-even ("banker's") rounding is correct when averaging measurements: it eliminates long-run statistical bias. It is incorrect for a monotonic counter: a half-even step can produce a displayed value strictly greater than the true elapsed time, even briefly. ATS prioritises truthful monotonicity over averaging symmetry. The cost is a fixed, deterministic bias of at most one unit of displayed precision *toward the past*; this bias is exposed as a contract (§6.2) and is acceptable to all use cases that prioritise determinism over symmetry.

---

## 7. Time zones

ATS has **no internal time zones**.

- ATS timestamps are *global instants* expressed in UTC. The same ATS value identifies the same UTC instant everywhere in the universe.
- Implementations **MUST NOT** carry a time-zone field on an ATS value. A wire format, database column, or in-memory type for an ATS value **MUST NOT** include a time-zone identifier or offset.
- Implementations **MAY** present a Local Solar Time (LST) overlay for human convenience (for example, "in New York, the dial currently reads `.55` of the local day"), but LST **MUST NOT** be stored as part of the ATS value. LST is a presentation-layer convenience defined as:

```
LST(tz, t) = t + tz_offset_at(tz, t)
```

Where `tz_offset_at` consults the IANA Time Zone Database for the offset (including daylight-saving rules) at instant `t` in time zone `tz`. The underlying ATS value is unchanged. LST is non-normative; the only normative content of an ATS value is its UTC instant.

---

## 8. Leap seconds

### 8.1 Day length

ATS aligns with UTC POSIX semantics: every ATS day **MUST** contain exactly **86 400 SI seconds**.

UTC leap seconds — both positive (insertions) and negative (deletions, theoretical) — **MUST** be absorbed into the standard day. ATS **MUST NOT** emit a 23:59:60 or analogous "leap" indicator.

### 8.2 Smearing policy

When a leap second occurs in UTC, implementations **MUST** choose, document, and apply deterministically one of the following smear policies for the affected ATS day:

- **POSIX-naïve smear**: the inserted leap second is mapped to the same POSIX timestamp as the preceding second; ATS values therefore "freeze" for the leap second. RECOMMENDED for general use because it matches `time_t` semantics.
- **Linear smear (Google-style)**: the leap second is distributed uniformly across a 20-hour window centred on the leap; each ATS Blink during the window is slightly extended in wall-clock terms. RECOMMENDED for distributed systems where clock-jump tolerance is low.
- **Step-jump (TAI-aligned)**: the implementation tracks TAI internally and emits ATS values offset by the current TAI-UTC delta; the leap event causes a discrete +1 / −1 second jump in the UTC mapping but not in TAI. PERMITTED for aerospace and scientific use cases.

Implementations **MUST** document their choice in their public documentation. Implementations interchanging ATS values **MUST NOT** assume the receiver shares the same smear policy; sub-second-accurate interchange around a leap event REQUIRES out-of-band coordination on TAI-UTC offset.

### 8.3 Reserved: ATS-TAI variant

A future revision **MAY** define an ATS-TAI variant whose epoch is anchored on TAI rather than UTC. ATS-TAI would not require smearing and would diverge from ATS-UTC by the current TAI-UTC offset. This variant is reserved; it is not part of v0.7.

---

## 9. Conversion definition

The conversion from a UTC instant to ATS, and back, **MUST** be implemented according to the pseudo-code below. Conformant implementations produce bit-identical results on the conformance vectors (`docs/spec/test-vectors.json`).

### 9.1 UTC → ATS (gregorian_to_ats)

```
function gregorian_to_ats(utc: UTCInstant) -> ATS:
    # Required precision: the host's UTC representation MUST resolve to at
    # least microseconds. Sub-microsecond resolution is OPTIONAL and only
    # meaningful at extended precision (§4.4).
    EPOCH_UTC = "1969-07-20T00:00:00Z"
    US_PER_DAY = 86_400_000_000
    ATS_DECIMALS = 5
    ATS_SCALE = 10 ** ATS_DECIMALS              # = 100_000

    delta_us = microseconds_since(utc, EPOCH_UTC)   # signed integer

    if delta_us >= 0:
        sign = "T+"
        abs_us = delta_us
    else:
        sign = "T-"
        abs_us = -delta_us

    integer_days, remainder_us = divmod(abs_us, US_PER_DAY)
    # frac_int has exactly ATS_DECIMALS = 5 digits, in [0, 100_000).
    frac_int = floor((remainder_us * ATS_SCALE) / US_PER_DAY)

    kilo, rem  = divmod(integer_days, 1000)
    hecto, rem = divmod(rem, 100)
    deka, kin  = divmod(rem, 10)

    return ATS(sign, kilo, hecto, deka, kin, frac_int)
```

### 9.2 ATS → UTC (ats_to_gregorian)

```
function ats_to_gregorian(ats: ATS) -> UTCInstant:
    EPOCH_UTC = "1969-07-20T00:00:00Z"
    US_PER_DAY = 86_400_000_000
    ATS_SCALE = 100_000

    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    abs_us = integer_days * US_PER_DAY + ats.frac * (US_PER_DAY / ATS_SCALE)
    # Note: US_PER_DAY / ATS_SCALE = 864_000 exactly; no rounding.

    if ats.sign == "T+":
        return EPOCH_UTC + abs_us microseconds
    else:
        return EPOCH_UTC - abs_us microseconds
```

### 9.3 Conformance contract

A conformant implementation **MUST** satisfy:

```
for every (utc, ats) pair in test-vectors.json:
    assert gregorian_to_ats(utc) == ats
    assert ats_to_gregorian(ats) == truncate_to_blink(utc)
```

Where `truncate_to_blink(utc)` truncates `utc` to the nearest multiple of 864 microseconds (one Blink) in the past. The 12 base vectors in `test-vectors.json` cover Earth ATS; the 10 vectors each in `test-vectors-multi-planetary-mars.json` and `-moon.json` cover the multi-planetary annex.

A reference implementation in Python lives in `code/ats.py`. A reference implementation in JavaScript lives in `docs/assets/js/ats.js`. Both **MUST** produce bit-identical output on all conformance vectors.

---

## 10. Decoding the short form

The short form `ΔK.H.D.Kin-BC.M` is intentionally lossy. Implementations decoding it **MUST** apply the following contract:

### 10.1 Decoding contract

```
function decode_short(short_str: str) -> ATS:
    # Parse per §5.1 ABNF. Reject malformed input with an explicit error.
    match = strict_short_regex.match(short_str)
    if match is None:
        raise InvalidShortForm(short_str)
    kilo, hecto, deka, kin, bc, milli = parse(match)
    # The short form encodes Bloc+Centi as a 2-digit pair and Milli as
    # a single digit; Beat and Blink are unknown and MUST default to 0.
    frac = bc * 1000 + milli * 100
    return ATS("T+", kilo, hecto, deka, kin, frac)
```

### 10.2 Precision contract

The decoded ATS value corresponds to a half-open UTC interval. Let `decoded` be the result of decoding short string `s`. The true UTC instant that produced `s` lies in:

```
[ats_to_gregorian(decoded), ats_to_gregorian(decoded) + 86.4 seconds)
```

That is, **exactly one Milli of uncertainty**. Implementations exposing the decoded result to other systems **MUST** label it as approximate (precision: ±86.4 s).

### 10.3 Strict parsing

Implementations **MUST** reject:
- The legacy `/cc` form (pre-v0.7 separator).
- Whitespace anywhere in the input.
- Direction markers (`T+` or `T-`).
- Missing leading `Δ` symbol.
- A `bc` field with fewer or more than 2 digits.
- A missing `.M` suffix (a short form without the Milli digit is malformed).
- A non-digit character anywhere in the positional fields.

---

## 11. Durations (Δd)

ATS up to §10 describes **instants**. A separate notation is defined for **durations** (signed differences between instants).

### 11.1 Syntax

```
duration     = direction SP "Δd" SP days "." frac
direction    = "T" sign
sign         = "+" / "-"
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT
frac         = 5*DIGIT
```

- The prefix `Δd` ("delta-duration") distinguishes a duration from an instant. `Δ` alone always denotes an instant.
- The direction marker is REQUIRED, even on durations. A duration is **signed**.
- The absolute value of a duration is denoted `|Δd|` in informal text; the canonical form always carries the explicit sign.

### 11.2 Examples

- One Hecto: `T+ Δd 0.1.0.0.00000` (100 days).
- One year of Gregorian usage (≈ 365 days): `T+ Δd 0.3.6.5.00000`.
- "I have lived for 7 Kilos and 893 days" → `T+ Δd 7.8.9.3.00000`.
- Step back half a day: `T- Δd 0.0.0.0.50000`.

### 11.3 Constraints

Durations are written only in canonical form; no short form is defined. Their precision matches the instants from which they are derived — the floor-truncation rule (§6) applies on both sides.

### 11.4 Algebra (normative)

The following operations are the only legal operations on `Δ` (instant) and `Δd` (signed duration) types. Any other combination is undefined behaviour; implementations **MUST** raise a type error.

**Signatures.**

| Operation | Types | Result | Description |
|---|---|---|---|
| `Δ + Δd` | (instant, duration) | `Δ` | Advance an instant by a duration. |
| `Δd + Δ` | (duration, instant) | `Δ` | Commutative form of the above. |
| `Δ − Δd` | (instant, duration) | `Δ` | Step back by a duration. |
| `Δ − Δ` | (instant, instant) | `Δd` | Signed difference between two instants. |
| `Δd + Δd` | (duration, duration) | `Δd` | Duration sum. |
| `Δd − Δd` | (duration, duration) | `Δd` | Duration difference. |
| `Δd × n` | (duration, scalar) | `Δd` | Scale a duration by a rational `n`. |
| `Δd ÷ n` | (duration, scalar) | `Δd` | Inverse scale. |
| `−Δd` | (duration) | `Δd` | Negation. |
| `|Δd|` | (duration) | `Δd ≥ 0` | Absolute value. |

`n` is any integer or rational. Implementations exposing durations via floating-point **MUST** document the float precision used and the resulting bound on accumulated rounding error.

**Comparisons.** `< ≤ = ≥ >` are defined:
- On two `Δ` values: ordered by the signed elapsed-day counter (`T-` < `T+`).
- On two `Δd` values: ordered by the signed duration value.
- **Not defined** on a mixed `Δ` × `Δd` pair: they are disjoint types. Implementations **MUST** raise a type error.

**Overflow semantics.** Any operation that produces an instant or a duration **MUST** re-emit the canonical form with:
- Kilo unbounded (may grow arbitrarily);
- Hecto, Deka, Kin digits in 0..9;
- `frac` floor-truncated to `ATS_DECIMALS = 5` digits by default.

**Identities.**
- `T+ Δd 0.0.0.0.00000 == T- Δd 0.0.0.0.00000` (the zero duration is unique).
- `T+ Δ 0.0.0.0.00000 == T- Δ 0.0.0.0.00000` (the epoch is sign-invariant).

**Conformance vectors.** `docs/spec/test-vectors-arithmetic.json` (12 cases) covers the seven operations, the Kin → Deka and Deka → Hecto → Kilo carries, the epoch crossing (T+ → T-), and the cross-sign comparisons.

---

## 12. Binary encoding

For storage, IoT, and binary interchange, ATS defines a **fixed 64-bit** layout.

```
┌──────┬────────────────────────────────────────────────┬──────────────────────────────┐
│ bit  │            high 40 bits (days, signed)         │   low 24 bits (fraction)     │
│      │  two's complement, big-endian                  │  unsigned big-endian          │
│      │  range: −2^39 .. 2^39 − 1                      │  0 .. 16_777_215             │
└──────┴────────────────────────────────────────────────┴──────────────────────────────┘
```

### 12.1 Fields

- **`days`** (signed int40, two's complement, big-endian) — number of full ATS days elapsed since the epoch. Range: ±(2^39 − 1) ≈ ±1.5 × 10¹¹ days, ≈ ±400 million years. Far beyond any practical horizon.
- **`frac24`** (unsigned uint24, big-endian) — fraction of the current day, scaled to 24 bits: `frac24 = floor(day_fraction × 2^24)`. Resolution: 1/16 777 216 day ≈ 5.15 ms.

### 12.2 Encoding (normative pseudo-code)

```
function encode_binary(ats: ATS) -> bytes:
    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    days_signed = integer_days if ats.sign == "T+" else -integer_days
    day_fraction = ats.frac / 100_000        # exact when ats.frac < 100_000
    frac24 = floor(day_fraction * 16_777_216) # 0 .. 16_777_215
    # Pack as 64-bit big-endian: top 40 bits = days (two's complement),
    # bottom 24 bits = frac24.
    return pack_big_endian_int40(days_signed) || pack_big_endian_uint24(frac24)
```

### 12.3 Properties

- A canonical ATS value at default 5-fractional-digit precision (≈ 864 ms resolution) round-trips through the binary form **without loss**, because 5.15 ms (24-bit fraction) is finer than 864 ms.
- **Within one sign class**, bytewise (`memcmp`) comparison gives chronological order. For two `T+` instants (non-negative days), `memcmp` is equivalent to chronological order. For two `T-` instants, `memcmp` is also chronological (closer to the epoch sorts after, matching "less far in the past").
- **Across sign classes**, raw `memcmp` does NOT yield chronological order, because two's-complement negative values start with `0xFF…` and sort after non-negative values starting with `0x00…`. Mixed `T+`/`T-` comparison **MUST** use signed-integer comparison on the day field. A future revision **MAY** introduce a biased-offset encoding (`days + 2^39`) to make `memcmp` globally chronological; it is not yet defined.
- The all-zeros 8-byte value (`0x00 00 00 00 00 00 00 00`) is the epoch.

### 12.4 Reference octets (test vectors)

| Instant | Binary (hex, big-endian) |
|---|---|
| Epoch (`T+ Δ 0.0.0.0.00000`) | `00 00 00 00 00 00 00 00` |
| Epoch + 1 day | `00 00 00 00 01 00 00 00` |
| Epoch − 1 day | `FF FF FF FF FF 00 00 00` |
| Epoch + 0.5 day | `00 00 00 00 00 80 00 00` |
| Epoch − 0.5 day | `FF FF FF FF FF 80 00 00` |
| `T+ Δ 20.7.8.2.50000` | `00 00 00 51 1F 80 00 00` |
| `T- Δ 0.0.0.1.00000` | `FF FF FF FF FF 00 00 00` (= epoch − 1 day) |

### 12.5 Interoperability

- Wire formats **MUST** use big-endian byte order. Little-endian storage in memory is permitted only with explicit conversion at I/O boundaries.
- Implementations **SHOULD** prefer the 64-bit form for embedded and IoT use; the textual canonical form (§4) **SHOULD** be used for logs and human-readable interchange.

---

## 13. Non-goals

ATS is a coordinate system, not a culture. The following are explicitly out of scope:

1. **ATS does not preserve months, weekdays, or religious cycles.** Cultural calendars (Hebrew, Islamic, Chinese, Hindu, Mayan, Liturgical, Baha'i, etc.) **MAY** express the same UTC instant in their own positional systems. ATS provides interoperability between such systems; it does not displace them. The conformance bridges (`code/bridges/*.py`) demonstrate that an implementation can express an ATS instant in any cultural calendar.

2. **ATS does not encode local solar noon directly.** Sunrise, sunset, and local noon are functions of geographic position. They are presentation-layer concerns. See §7 on LST.

3. **ATS does not legislate a work-rest rhythm.** The Deka (10 days) is a measurement unit, not a social mandate. Any social convention laid over the Deka (e.g., 7+3 work-rest, 6+4, 5+5) is a *convention* (see `conventions.md`), never normative.

4. **ATS does not take a position on religious observance.** The Sabbath, Friday prayer, Easter, Eid al-Fitr, Diwali, and other observances are events on the wall clock; an ATS implementation can store and report them, but ATS does not interpret them or rank them.

5. **ATS does not replace UTC.** ATS is a *representation* of UTC instants. Migrating from a UTC-based representation (ISO 8601, Unix epoch) to ATS leaves the underlying timeline unchanged. UTC remains the source of truth; ATS is the canonical projection of UTC into a decimal coordinate system.

6. **ATS does not impose itself on bodies it does not address.** The multi-planetary annex defines anchors for Mars and the Moon. Bodies for which no annex exists (Venus, Europa, exoplanets) have no normative ATS counter; third parties **MAY** define their own using the generic framework (`multi-planetary.md §6`).

7. **ATS does not claim to be more "spiritual" or more "natural" than alternatives.** ATS claims to be more *computational*: precise, unambiguous, base-10, no time zones, no months. Computational virtues are sufficient justification; aesthetic or metaphysical claims are not made by this document.

---

## 14. Annexes

- **Philosophy** (`philosophy.md`) — non-normative. Why ATS: alignment with biological cycles (circadian, social, project, generational); proposed rituals (Kilo-versary, Hecto-feast).
- **Comparison** (`comparison.md`) — non-normative. ATS vs Holocene, International Fixed Calendar, Hanke-Henry, French Republican, Swatch Internet Time, Darian (Mars).
- **Conventions** (`conventions.md`) — non-normative. Kilo-versary, Hecto-feast, 7+3 rhythm, 08-22 solar bands. Described, not required.
- **Versioning & stability** (`versioning.md`) — normative. SemVer contract, post-v1.0 freezes, additive vector policy, RFC process. See §15.
- **Multi-planetary** (`multi-planetary.md`) — normative. Extends the ATS counter to other celestial bodies (Mars, Moon) and provides a generic framework `Δ_X(epoch, day_seconds)` for third-party bodies. Preserves canonical, short, binary formats and §11.4 algebra.
- **Analog clock** (`analog-clock.md`) — non-normative. Reference dial layout and angular formulas for analog rendering.
- **Test vectors** (`test-vectors.json`, `test-vectors-arithmetic.json`, `test-vectors-multi-planetary-mars.json`, `test-vectors-multi-planetary-moon.json`, `test-vectors-bridges-*.json`) — machine-readable conformance suites; all carry a root `spec_version`.

---

## 15. Versioning and stability

### 15.1 Current version

This document specifies ATS **v0.7 (pre-release)**.

### 15.2 SemVer contract

- **Pre-v1.0** (current): breaking changes are PERMITTED at minor versions. Each change **MUST** be recorded in `CHANGELOG.md` with a migration note. Conformance vectors carry `spec_version` so consumers can detect which spec produced them.
- **Post-v1.0** (committed below): breaking changes **MUST NOT** be introduced at minor versions. Major version bumps are reserved for breaking changes; minor versions are additive only; patch versions are clarifications only.

### 15.3 Post-v1.0 stability commitments

The following items are **frozen** post-v1.0. Changing any of them requires a major version bump:

- The epoch (`1969-07-20T00:00:00Z`).
- The unit ladder (Kin / Deka / Hecto / Kilo / Bloc / Centi / Milli / Beat / Blink).
- The default canonical precision (5 fractional digits, Blink).
- The short-form syntax (`ΔK.H.D.Kin-BC.M`).
- The binary encoding layout (40+24 bits, big-endian, two's complement).
- The duration prefix (`Δd`).
- The Earth day length (86 400 SI seconds; see §8 for leap policy).

The following items **MAY** evolve at minor versions post-v1.0 in an additive-only fashion:

- New conformance vectors (additive only; previously-valid vectors remain valid).
- New annexes (non-normative).
- New celestial bodies in the multi-planetary annex (additive only).
- New algebraic operations on `Δd`, provided they are extensions, not modifications of existing ones.

### 15.4 Changes from v0.3.x ("RC v1.1") to v0.7

- **Epoch shifted** from the touchdown instant (1969-07-20T20:17:40Z) to the start of the landing day (1969-07-20T00:00:00Z). Direct consequence: Bloc 5 = 12:00 UTC exactly.
- **Myriade** removed from the positional format; Kilo is unbounded. "Generation" demoted to informal vocabulary (§4.2 note).
- 0.1-day unit renamed `D-Day` → `Bloc`.
- **Short form** evolved: `Δ K.H.D.Kin/cc` → `ΔK.H.D.Kin-BC.M` in v0.7 (no space after Δ, separator `-` instead of `/`, Milli digit added). The Kin digit is always shown to preserve the calendar reference.
- **Rounding policy** formalised as strict floor truncation. A banker's half-even variant was rejected as incompatible with the "counter of completed units" principle (§6.4).
- Local Solar Time (LST) layer formally introduced as a non-normative presentation overlay (§7).
- Leap second policy formalised with three permitted smearing options (§8.2).
- §11 (Durations / `Δd`) and §12 (Binary encoding, 64-bit) added.
- §11.4 (Algebra of durations) added.
- §1.1 (What ATS is not), §1.2 (Biological alignment of the unit ladder), §2.3 (Epoch withstands four attacks), and §16 (Standards process & governance) added in v0.7 as defensive normative content.
- Multi-planetary annex promoted to normative status (v0.7).

---

## 16. Standards process and governance

### 16.1 Process model

ATS is developed as a **living public specification**. Normative decisions are made by the document editors; the public participates by submitting issues and pull requests against the canonical text. Conformant implementations are listed in the project's `README.md`.

### 16.2 RFC procedure

Any normative change to this document **MUST** follow the RFC procedure defined in `versioning.md §6`:

1. The proposer opens a public RFC document (GitHub issue or pull request) describing the change, the rationale, and the migration path.
2. The RFC remains open for public comment for a minimum of 14 calendar days.
3. The document editors record a decision (accept, modify, reject) with reasoning.
4. Accepted changes are recorded in `CHANGELOG.md` and become normative on merge.

### 16.3 IANA / IETF intent

The editors INTEND to submit ATS as an Informational RFC to the IETF after v1.0 freeze. An IANA registry is planned for canonical-form and short-form labels, multi-planetary body identifiers, and conformance vector locations. Until adoption by a recognised standards organisation, ATS is a **publicly developed specification**, not a recognised international standard.

This positioning is intentional and not a weakness. Many widely-deployed standards (TOML, JSON, EditorConfig) began as publicly-developed specifications outside formal standards bodies. The criterion that matters is **conformance reproducibility**: any two implementations passing the conformance vectors produce identical output. ATS meets this criterion in v0.7.

### 16.4 Governance

Until v1.0, normative decisions belong to the document editors of record. Post-v1.0, governance is committed to a multi-editor model with the following properties:

- A minimum of three editors of record, listed in `GOVERNANCE.md`.
- Decision rule: rough consensus (IETF-style) with editor veto on backward-compatibility concerns.
- Public RFC archive: every accepted and rejected RFC is preserved in `docs/spec/rfcs/`.
- Implementer rotation: a recognised conformant implementation **MAY** nominate an editor to the panel.

### 16.5 Conformance

An implementation CLAIMS CONFORMANCE to this specification by:

1. Passing `docs/spec/test-vectors.json` (Earth) bit-for-bit.
2. Passing `docs/spec/test-vectors-arithmetic.json` (algebra) bit-for-bit.
3. Implementing the strict parsers for canonical and short forms.
4. Documenting its leap-second smear policy (§8.2).
5. Documenting its precision class (default 5-digit, or extended).

Conformance is **binary, not graduated**: an implementation is either conformant or not. Partial conformance to optional sections (multi-planetary, binary encoding) **MUST** be documented explicitly.

---

## 17. Glossary (full)

- **ATS** — Apollonian Time System; this standard.
- **Beat** — Micro positional unit, 0.0001 day ≈ 8.64 s (§4.3).
- **Bloc** — Micro positional unit, 0.1 day = 2 h 24 min (§4.3).
- **Blink** — Micro positional unit, 0.00001 day ≈ 0.864 s (§4.3).
- **Canonical form** — Fully-qualified textual representation (§4).
- **Centi** — Micro positional unit, 0.01 day = 14 min 24 s (§4.3).
- **Conformance vector** — A normative test case in a JSON file used by all implementations to verify bit-identical output.
- **Δ** — The ATS instant symbol (U+0394).
- **Δd** — The ATS duration symbol.
- **Deka** — Macro positional unit, 10 days (§4.2).
- **Drift** — The bounded difference between a true instant and its truncated displayed form (§6.2).
- **Epoch** — The reference UTC instant `1969-07-20T00:00:00Z` (§2).
- **Floor truncation** — The rounding mode mandated by §6.
- **Generation** — Informal label for ≈ 10 000 days (≈ 27.4 years); NOT a positional unit (§4.2).
- **Hecto** — Macro positional unit, 100 days (§4.2).
- **Kilo** — Macro positional unit, 1 000 days; the only unbounded positional digit (§4.2).
- **Kin** — Macro positional unit, 1 day; the solar day (§4.2).
- **Leap second smear** — Implementation-chosen policy for absorbing UTC leap seconds (§8.2).
- **LST** — Local Solar Time; a non-normative presentation overlay (§7).
- **Milli** — Micro positional unit, 0.001 day ≈ 1 min 26.4 s (§4.3).
- **Multi-planetary annex** — Normative annex extending ATS to bodies other than Earth.
- **Short form** — Conversational truncated representation (§5).
- **Spec_version** — A root-level string in conformance vector files identifying the spec revision that produced them.
- **T+, T-** — Direction markers (§3).
- **UTC** — Coordinated Universal Time (§0.2).

---

## References

- **RFC 2119** — Key words for use in RFCs to Indicate Requirement Levels.
- **RFC 5234** — Augmented BNF for Syntax Specifications: ABNF.
- **RFC 5905** — Network Time Protocol Version 4: Protocol and Algorithms Specification.
- **RFC 8174** — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.
- **ITU-R TF.460** — Standard-frequency and time-signal emissions (UTC).
- **ISO 8601** — Date and time format.
- **BCP 14** — RFC 2119 + RFC 8174 (requirement levels).
- **IEEE 1588** — Precision Time Protocol (PTP).
