# The Apollonian Time System (ATS)

**Status:** Pre-release v0.5
**Symbol:** Δ
**Authoritative language:** English (French is a translation)
**Core idea:** Replace the Gregorian *year/month/week + local time* model with a single, universal, decimal, linear time standard anchored to a species-level technological milestone.

---

## 1. What ATS is

ATS is a **continuous counter** anchored to a single epoch and expressed in **base‑10 positional units**.

- **Linear:** time is measured as elapsed days (and day‑fractions) since the epoch.
- **Decimal:** all subdivisions are powers of 10.
- **Universal:** one time for everyone; no time zones inside the system.

The result is a time representation that is easier to compute with, easier to compare statistically, and designed for a networked, multi‑site, and eventually multi‑planetary civilization.

---

## 2. Epoch (Point Zero)

ATS uses a technological, species-level milestone as its reference point: **the day humanity first landed on another world.**

- **Epoch event:** start of the Apollo 11 landing day (UTC midnight boundary).
- **Epoch in UTC:** **1969‑07‑20T00:00:00Z**.
- **ATS epoch value:** **`T+ Δ 0.0.0.0.00000`**.
- **Lunar landing instant** (Eagle touchdown, 20:17:40Z): a remarkable instant *within* Δ 0, at **`T+ Δ 0.0.0.0.84560`** — Bloc 8, Centi 4, Deka 5, Kin 6 in the intra-day breakdown (see §4.3).

> **Rationale.** Anchoring on the *start* of 1969‑07‑20 (UTC) — rather than on the touchdown instant (20:17:40Z) used during earlier drafts — aligns the day counter with UTC: **Bloc 5 corresponds exactly to 12:00 UTC** (5 × 2 h 24 min). The world remembers the date "July 20, 1969"; ATS keeps that date and snaps it to a midnight-UTC boundary, while preserving the touchdown moment as a celebrated instant inside Δ 0.

### 2.1 Alternative anchors (rejected)

For historical reference, other anchor points were considered and rejected:

| Candidate | UTC | Reason for rejection |
|---|---|---|
| Exact touchdown instant | 1969‑07‑20T20:17:40Z | Misaligns the day counter from UTC: Bloc 5 falls at 08:17:40 UTC instead of noon. Pedagogically confusing. |
| Sputnik 1 launch | 1957‑10‑04T19:28:34Z | Robotic, no human presence beyond Earth |
| Hiroshima | 1945‑08‑06T08:15:00Z | Civilization-marking but negative |
| First powered flight (Wright) | 1903‑12‑17T15:35:00Z | Atmospheric only |
| Apollo 11 launch | 1969‑07‑16T13:32:00Z | Beginning of journey, not arrival |
| First step (EVA) | 1969‑07‑21T02:56:15Z | Symbolic, but landing comes first and falls on the next UTC day (Δ 1) |

---

## 3. Directionality: T+ and T-

ATS is symmetric around the epoch.

- **T+**: elapsed time **after** the epoch.
- **T-**: elapsed time **before** the epoch (a historical countdown).

In everyday usage, the Δ symbol implies *T+* by default (most life occurs post-epoch), but **T- must always be explicit**.

---

## 4. Canonical representation (storage / interchange)

### 4.1 Canonical syntax

```
[DIR] Δ [KIL].[HEC].[DEK].[KIN].[fffff]
```

- `DIR` is `T+` or `T-`.
- `KIL` is **Kilo** — an **unbounded** non-negative integer.
- `HEC`, `DEK`, `KIN` are digits `0..9` (Hecto, Deka, Kin).
- `fffff` is the **fraction of the day** encoded on 5 decimal digits (0..99999) by default — see §4.4 for variable precision.

Example (current era, ~57 years post-epoch — noon UTC, 13 June 2026):

```
T+ Δ 20.7.8.2.50000
```

### 4.2 Macro-time units (calendar)

ATS counts **days** using fixed base-10 places:

| Position | Name | Value | Function |
|---|---|---|---|
| `....X` | **Kin** | 1 day | The solar day |
| `...X.` | **Deka** | 10 days | Work-rest cycle |
| `..X..` | **Hecto** | 100 days | Season / planning quarter |
| `X....` | **Kilo** | 1 000 days | Mandate / multi-year project |

`Kilo` has no upper bound. As decades pass, the leading number grows freely (`20.x.x.x`, `100.x.x.x`, ...).

> **Note — "Generation" (informal).** ~10 000 days (≈27.4 years) is colloquially called a **Generation**. It is **not** a positional digit in the canonical format — it lives only in social/philosophical discourse (see Philosophy annex).

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

The default canonical precision is **5 fractional digits** (down to Blink). Implementations may extend precision (e.g., 9 digits ≈ 0.0086 ms for scientific or network synchronization use cases), or shorten it for display.

When precision is reduced for display, see §6 (rounding policy).

---

## 5. Conversational format (human UI)

For everyday display (watches, apps, conversation), ATS defines a **short** form:

```
Δ K.H.D.Kin/cc
```

- `K`, `H`, `D`, `Kin` are the **Kilo**, **Hecto**, **Deka**, **Kin** digits. Kilo is shown in full (it may be multi-digit); `Kin` is **always shown**, even when it is zero, so the calendar reference is never lost.
- `cc` is two digits of day-fraction (Bloc + Centi).
- `/` separates the date part from the fraction part, **with no spaces** around it, to keep the form compact.

Example:

```
Δ 20.7.8.2/50
```

**When to use which:**

- **Canonical:** logs, storage, cryptographic signing, cross-system interop. Always uses `.` as date/fraction separator (URL-safe, filename-safe).
- **Short:** UI, watches, conversation. Uses `/` tight against the digits.

> **Input tolerance.** Parsers MUST also accept the form with optional whitespace around `/` (`Δ 20.7.5.0 / 43`). The *emitted* form is strict: no spaces.

---

## 6. Rounding policy

ATS uses **strict floor truncation** when reducing precision for display.

- A digit is shown only once the corresponding unit is **fully elapsed**.
- A value of `0.99999` stays `0.99999` until the day is over — it never carries to `1.00000` early.
- Reason: ATS is a counter of *completed* units. Rounding forward would invent time that has not yet passed and break monotonicity.

The internal counter (the elapsed-days `Decimal`) always remains exact; truncation applies only to *displayed* digits.

> **Why not half-even / "banker's" rounding?** Half-even is the right choice for averaging measurements (it avoids long-run statistical bias). It is the wrong choice for a monotonic counter: a half-even step can move the displayed value past the actual instant, even briefly. ATS prioritizes truthful monotonicity over averaging symmetry.

---

## 7. Time zones policy

ATS has **no internal time zones**.

- ATS timestamps are *global instants* expressed in UTC.
- "Local Solar Time" (LST) may be presented as an **informational overlay** for human convenience (e.g., "in New York, sunrise is around `.55`"), but is **never stored** as part of an ATS value.

Implementations and software interfaces SHOULD NOT carry a time-zone field on ATS timestamps.

---

## 8. Leap seconds

ATS aligns with UTC POSIX semantics: **a day is exactly 86 400 seconds**.

- UTC leap seconds are absorbed silently into the standard day (same behavior as Unix time).
- A future variant aligned to TAI (no leap seconds) may be defined for aerospace use; it is not part of this spec.

---

## 9. Conversion definition

Let `EPOCH = 1969‑07‑20T00:00:00Z`.

1. Compute elapsed time: `delta = now_utc - EPOCH`.
2. Convert to **decimal days**: `days = delta_seconds / 86400`.
3. If `days >= 0` → `T+`, else `T-` with `abs(days)`.
4. Integer part → Kilo/Hecto/Deka/Kin breakdown.
5. Fractional part → `fffff` (multiply by 100000; round per §6).

A reference Python implementation lives in `code/ats.py`.

---

## 10. Decoding the short form

The short form `Δ K.H.D.Kin/cc` is intentionally lossy:

- No sign (assumed `T+`).
- Two-digit fraction only (Bloc + Centi; the finer positions Milli/Beat/Blink are assumed `0`).
- Kilo is shown in full — there is **no Myriade context** to recover.

Implementations decoding a short form into a precise Gregorian instant SHOULD label the result as approximate (precision: ±~14 min 24 s — one Centi).

---

## 11. Durations (Δd)

ATS up to §10 describes **instants**. A separate notation is defined for **durations** (deltas between instants).

### 11.1 Syntax

```
T± Δd K.H.D.Kin.fffff
```

- **Signed** since v0.6 — see §11.4. The canonical form carries an explicit `T+` or `T-`; the absolute value is written `|Δd|`.
- Same positional structure as an instant (Kilo unbounded; Hecto / Deka / Kin digits 0..9; fffff fractional digits).
- Prefix `Δd` ("delta-duration") distinguishes a duration from an instant. `Δ` alone always denotes an instant.
- Subtracting two ATS instants yields a signed duration: `Δd = Δ(a) − Δ(b)` (see §11.4).

### 11.2 Examples

- One Hecto: `T+ Δd 0.1.0.0.00000` (100 days).
- One year of Gregorian usage (~365 days): `T+ Δd 0.3.6.5.00000`.
- "I have lived for 7 Kilos and 893 days" → `T+ Δd 7.8.9.3.00000`.
- Step back half a day: `T- Δd 0.0.0.0.50000`.

### 11.3 Constraints

Durations are always written in canonical form; **no short form** is defined. Their precision matches the instants from which they are derived — the floor-truncation rule (§6) applies on both sides.

### 11.4 Algebra of durations (v0.6+)

The following algebra defines the only legal operations on the `Δ` (instant) and `Δd` (signed duration) types. Any other combination is undefined.

**Signatures.**

| Operation | Types | Result |
|---|---|---|
| `Δ + Δd` | (instant, duration) | `Δ` |
| `Δd + Δ` | (duration, instant) | `Δ` |
| `Δ − Δ` | (instant, instant) | `Δd` (signed) |
| `Δ − Δd` | (instant, duration) | `Δ` |
| `Δd + Δd` | (duration, duration) | `Δd` |
| `Δd − Δd` | (duration, duration) | `Δd` |
| `Δd × n` | (duration, scalar) | `Δd` |
| `Δd ÷ n` | (duration, scalar) | `Δd` |
| `−Δd` | (duration) | `Δd` (negated) |
| `|Δd|` | (duration) | `Δd ≥ 0` |

`n` is any integer or rational; implementations that expose durations as floating-point document their precision (the reference JS port uses `Number`/float64, ~15 significant digits).

**Comparisons.** `< ≤ = ≥ >` are defined on two `Δ` (via the signed day counter, T- < T+) and on two `Δd`. `Δ ↔ Δd` comparison is **not** defined — they are disjoint types.

**Overflow semantics.** Any operation that produces an instant or a duration re-emits the canonical form with:
- Kilo unbounded (may grow arbitrarily),
- Hecto, Deka, Kin digits 0..9,
- `fffff` truncated via floor (`ROUND_FLOOR`, §6) to `ATS_DECIMALS = 5` default digits.

**Identities.** `T+ Δd 0.0.0.0.00000 == T- Δd 0.0.0.0.00000` (the zero duration is unique); likewise for `Δ` at the epoch: `T+ Δ 0.0.0.0.00000 == T- Δ 0.0.0.0.00000`.

**Conformance vectors.** `docs/spec/test-vectors-arithmetic.json` (12 cases) covers the seven operations, the Kin→Deka and Deka→Hecto→Kilo carries, the epoch crossing (T+ → T-), and the cross-sign comparisons.

---

## 12. Binary encoding

For storage, IoT and binary interchange, ATS defines a **fixed 64-bit** layout (big-endian, two's complement on the day count).

```
┌──────┬────────────────────────────────────────────────┬──────────────────────────────┐
│ bit  │            high 40 bits (days, signed)         │   low 24 bits (fraction)     │
│      │  T+ for ≥ 0, T- for < 0 (two's complement)    │  0 .. 16_777_215             │
└──────┴────────────────────────────────────────────────┴──────────────────────────────┘
```

### 12.1 Fields

- **`days`** (signed int40, two's complement, big-endian) — number of full ATS days elapsed since the epoch. Range: `−2^39 .. 2^39 − 1` (~ ±1.5 × 10¹¹ days, far beyond any astronomical horizon).
- **`frac24`** (unsigned uint24, big-endian) — fraction of the current day, scaled to 24 bits: `frac24 = floor(day_fraction × 2^24)`. Yields ≈ 5.15 ms of resolution.

### 12.2 Encoding

Given an instant with sign `s ∈ {T+, T-}`, integer day count `D ≥ 0` and day-fraction `f ∈ [0, 1)`:

```
days = D if s == T+ else -D
frac24 = floor(f × 16_777_216)
out = (days << 24) | frac24      # arithmetic shift; 64 bits total
```

### 12.3 Properties

- A canonical ATS value (5 fractional digits, ≈ 864 ms resolution) round-trips through the binary form **without loss**, because 24 bits (≈ 5.15 ms) is finer.
- **Bytewise comparison gives chronological order only inside one sign class.** For two T+ instants (days ≥ 0), `memcmp` is equivalent to chronological order. For two T- instants, it is also chronological (closer to the epoch comes after in `memcmp`, which matches "less far in the past"). For a **mixed T+/T- comparison**, raw `memcmp` does *not* yield chronological order (two's-complement T- values start with `FF…` and sort after T+ values starting with `00…`); use signed-integer comparison on the day field instead. A future variant could adopt a biased representation (`days + 2³⁹`) to make `memcmp` globally chronological.
- The all-zeros value is the epoch (`T+ Δ 0.0.0.0.00000`).

### 12.4 Reference octets (test vector)

| Instant | Binary (hex, big-endian) |
|---|---|
| Epoch (`T+ Δ 0.0.0.0.00000`) | `00 00 00 00 00 00 00 00` |
| Epoch + 1 day | `00 00 00 00 01 00 00 00` |
| Epoch − 1 day | `FF FF FF FF FF 00 00 00` |

---

## 13. Non-goals

- ATS does not preserve months, weekdays, or religious cycles.
- ATS does not encode local solar noon directly.
- ATS does not legislate a work-rest rhythm. The Deka (10 days) is a measurement unit, not a social mandate.
- ATS is not "more spiritual"; it is a universal computational standard.

---

## 14. Annexes (non-normative)

- **Philosophy** (`philosophy.md`) — why ATS: alignment with biological cycles (circadian, social, project, generational); proposed rituals (Kilo-versary, Hecto-feast).
- **Comparison** (`comparison.md`) — ATS vs Holocene, International Fixed, Hanke-Henry, French Republican, Swatch Internet Time, Darian (Mars).
- **Conventions** (`conventions.md`) — **non-normative annex**: Kilo-versary, Hecto-feast, 7+3 rhythm, 08-22 solar bands. Described, not required.
- **Versioning & stability** (`versioning.md`) — **normative annex**: SemVer contract, post-v1.0 freezes, additive vector policy, RFC process.
- **Multi-planetary** (`multi-planetary.md`) — **normative annex**: extends the ATS counter to other celestial bodies (Mars, Moon) + generic framework `Δ_X(epoch, day_seconds)` for third-party bodies. Preserves canonical, short, binary formats and §11.4 algebra.
- **Test vectors** (`test-vectors.json`, `test-vectors-arithmetic.json`, `test-vectors-bridges-*.json`) — machine-readable conformance suites, all carry a root `spec_version`.

---

## 15. Versioning

This spec is **v0.5 (pre-release)**.

### Changes from v0.3.x (previous pre-release, "RC v1.1")

- **Epoch shifted** from the touchdown instant (1969‑07‑20T20:17:40Z) to the **start of the landing day** (1969‑07‑20T00:00:00Z). This is a **breaking change**: every stored ATS value from earlier drafts is offset by 73 060 s ≈ 0.84560 day. Because the project is still pre-v1, no conversion shim is provided; consumers should regenerate their values.
- **Direct consequence:** Bloc 5 = 12:00 UTC exactly. The touchdown moment becomes a remarkable instant within Δ 0 at `T+ Δ 0.0.0.0.84560`.
- §2.1 grew by one row: "Exact touchdown instant" is now itself a rejected anchor (the reason it was demoted: misalignment with UTC).
- Worked examples in §4.1 and §5 updated to reflect the new epoch.
- §9 conversion definition updated.

### Earlier (kept for archival reference) — changes that defined RC v1.1 (now superseded)

- Myriade removed from the positional format; Kilo is now unbounded. "Generation" demoted to informal vocabulary.
- 0.1-day unit renamed `D-Day` → `Bloc`.
- Short form: separator changed from `|` to `/`, no spaces around it; the `Kin` digit is now **always shown** (even when zero) to preserve the calendar reference.
- Rounding policy: strict floor truncation. A banker's half-even variant briefly considered earlier was rejected as incompatible with the "counter of completed units" principle.
- Local Solar Time (LST) layer explicitly introduced.
- Leap second policy explicitly aligned to POSIX.
- Decoding rules for the short form documented (intentional lossiness).
- Philosophy and comparison moved to annexes.
- §11 (Durations / `Δd`) and §12 (Binary encoding, 64-bit) added.
- Annexes renumbered §14, Versioning §15.
