# The Apollonian Time System (ATS)

**Status:** Release Candidate v1.0  
**Symbol:** Δ  
**Core idea:** Replace the Gregorian *year/month/week + local time* model with a single, universal, decimal, linear time standard.

---

## 1) What ATS is
ATS is a **continuous counter** anchored to a single epoch and expressed in **base‑10 positional units**.

- **Linear:** time is measured as elapsed days (and day‑fractions) since the epoch.
- **Decimal:** all subdivisions are powers of 10.
- **Universal:** one time for everyone; no time zones inside the system.

The result is a time representation that is easier to compute with, easier to compare statistically, and designed for a networked, multi‑site, and eventually multi‑planetary civilization.

---

## 2) Epoch (Point Zero)
ATS uses a technological, species-level milestone as its reference point.

- **Epoch event:** first human step on the Moon (Apollo 11 EVA start).
- **Epoch in UTC:** **1969‑07‑21T02:56:15Z**.
- **ATS epoch value:** **Δ 0.0.0.0.0.00000**.

Everything after the epoch is **T+**, everything before is **T-**.

---

## 3) Directionality: T+ and T-
ATS is symmetric around the epoch.

- **T+**: elapsed time **after** the epoch.
- **T-**: elapsed time **before** the epoch (a historical countdown).

In everyday usage, the Δ symbol typically implies *T+* (because most daily life occurs post‑epoch), but **T- must always be explicit**.

---

## 4) Canonical representation (storage / interchange)
### 4.1 Canonical syntax

```
[DIR] Δ [MYR].[KIL].[HEC].[DEK].[KIN].[fffff]
```

- `DIR` is `T+` or `T-`.
- `MYR` is **Myriades** (unbounded integer, >= 0).
- `KIL`, `HEC`, `DEK`, `KIN` are digits `0..9`.
- `fffff` is the **fraction of the day** encoded on 5 decimal digits (0..99999).

Example:

```
T+ Δ 2.0.6.4.5.36806
```

### 4.2 Macro-time units (calendar)
ATS counts **days** using fixed base-10 places:

- **Kin** = 1 day
- **Deka** = 10 days
- **Hecto** = 100 days
- **Kilo** = 1,000 days
- **Myriade** = 10,000 days

So an ATS day-count is simply the digits of the day offset grouped as:

- `MYR` (10,000s place and above)
- `KIL` (1,000s)
- `HEC` (100s)
- `DEK` (10s)
- `KIN` (1s)

### 4.3 Micro-time units (clock)
ATS encodes time of day as a fraction of a day, written as 5 digits:

- 0.1 day  ≈ 2h 24m  ("D‑Day")
- 0.01 day ≈ 14m 24s ("Centi")
- 0.001 day ≈ 1m 26.4s ("Milli")
- 0.0001 day ≈ 8.64s ("Beat")
- 0.00001 day ≈ 0.864s ("Blink")

This is not marketing “decimal time”; it is a complete date-time system with a single numeric spine.

---

## 5) Conversational format (human UI)
To make ATS speakable and readable, ATS defines a standard “short” representation.

### 5.1 Short syntax

```
Δ K.H.D | cc
```

- `K.H.D` are the **Kilo/Hecto/Deka** digits of the current day count (Myriade is context).
- `cc` is **two digits** of day‑fraction (D‑Day + Centi), i.e. the first two decimals of the day.

Example:

```
Δ 0.6.4 | 36
```

### 5.2 When to use which
- **Canonical:** logs, storage, cryptographic signing, cross-system interoperability.
- **Short:** watches, calendars, everyday meeting scheduling.

---

## 6) Rounding policy (critical)
ATS is a **counter of completed units**.

- **Rule:** always **truncate (floor)** fractional digits; **never round**.
- Reason: rounding would “invent” future time (e.g., 0.99999 rounding to 1.00000 prematurely).

Truncation is applied both when producing `fffff` and when producing `cc`.

---

## 7) Time zones policy (critical)
ATS has **no internal time zones**.

- ATS timestamps are *global instants*.
- Local solar time is a *separate, optional presentation layer*.

This removes the primary source of scheduling ambiguity (DST changes, zone offsets, calendar drift between systems).

---

## 8) Human-cycle alignment (why ATS)
ATS is designed around human-scale cycles:

- **Daily focus:** 0.1 day is a natural “deep work” block.
- **Work-rest:** decadal cadence supports a 7+3 societal rhythm.
- **Project cadence:** 100-day Hectodes reduce statistical noise from irregular months.
- **Generational meaning:** 10,000-day Myriades provide a narrative life structure (learning / building / transmitting).

---

## 9) Conversion definition
Let `EPOCH` be 1969‑07‑21T02:56:15Z.

- Compute elapsed time: `delta = now_utc - EPOCH`.
- Convert to **decimal days**: `days = delta_seconds / 86400`.
- If `days >= 0` → `T+`, else `T-` and use `abs(days)`.
- The integer part is the day counter.
- The fractional part becomes `fffff` by multiplying by 100000 and truncating.

---

## 10) Non-goals (explicit)
- ATS does not attempt to preserve months, weekdays, or religious cycles.
- ATS does not aim to encode local solar noon directly.
- ATS is not “more spiritual”; it is a universal, computational standard.
