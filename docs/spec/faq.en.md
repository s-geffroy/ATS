# FAQ — Δ ATS

## Why not just keep the Gregorian calendar?

The Gregorian calendar optimizes seasonal alignment for a 16th-century agrarian society. For computing durations, comparing periods, or reasoning about human cycles (focus, rest, project, generation), it adds noise: irregular months, religious weeks, shifting time zones, summer time. ATS does not replace the Gregorian calendar — it offers a cleaner **measurement layer** that coexists with it.

## Why 1969-07-20, not a "neutral" date?

The lunar landing is the most universally positive, technically verifiable event of the 20th century. It is also the moment a human envelope first touched another celestial body, matching the "multi-planetary civilization" framing of the manifesto.

## Why the start of the day (00:00 UTC), not the touchdown instant (20:17:40 UTC)?

To keep the day counter aligned with UTC: with the epoch on the midnight boundary, **Bloc 5 = 12:00 UTC** exactly (5 × 2 h 24 min), Bloc 0 = midnight, and so on. Earlier drafts (RC v1.1) anchored on the exact touchdown instant; that made Bloc 5 fall at 08:17:40 UTC, which surprised newcomers ("why isn't Bloc 5 noon?"). v0.5 fixes that. The touchdown itself remains an honored instant inside Δ 0, at `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6).

## Why not the first step (21/07 02:56:15Z) as the anchor?

The first step is symbolically heavier than the landing — but it happens 6 h 35 after Eagle has already touched down, and on the *following* UTC day (Δ 1). The world remembers the landing as "July 20, 1969"; picking the start of that day keeps the cultural memory intact while aligning with UTC.

## Why not the tropical year (365.2422 d) as a macro unit?

Because it is not an integer multiple of a day. Forcing it into a positional format requires leap days or fractions — exactly what we are trying to eliminate.

## Why not base 12 or base 20?

Base 12 has divisibility benefits (2, 3, 4, 6); base 20 matches the Mayan Long Count. But the whole ecosystem (currency, SI, computing, finance) is base 10. The decimal choice drives adoption friction to near zero.

## How do I read `T+ Δ 20.7.8.0.61137` out loud?

The spec does not standardize oral form. Three observed usages: digit-by-digit ("twenty dot seven dot eight dot zero dot six one one three seven"), grouped pairs ("twenty dot seven dot eight dot zero dot sixty-one thousand one hundred thirty-seven"), or short form ("twenty seven eight zero dash sixty-one dot one").

## "Δ20.7.8-65.1" — which day exactly?

Ambiguous on purpose — that is why v0.1.2 **brought `Kin` back** into the short form: `Δ20.7.8.5-65.1`. The short form is now precise to the day. Since v0.7, the `Milli` digit after `.` shrinks the residual loss from ±14 min 24 s (Centi only) to ±1 min 26 s.

## Why no time zones?

Because time zones are the #1 source of software bugs. ATS = strict UTC. To calibrate human activity to the local sun, use the **LST (Local Solar Time)** overlay as informational layer only (§7), never stored.

## What about daylight saving time?

Gone, as far as ATS is concerned. The cultural convention still exists, but no ATS value moves when DST changes. A society that wants more summer sun shifts its **activity hours** (in ATS), not its clock.

## What happens during a leap second?

ATS follows POSIX: a day is **exactly 86,400 seconds**. The leap second is absorbed silently, just like Unix time. For aerospace use where it matters (TAI ≠ UTC), a future TAI-aligned variant could be defined.

## Why is `Kin` in the integer part, not part of the fraction?

Because the integer part (Kilo.Hecto.Deka.Kin) answers "which day?", and the fractional part (Bloc.Centi.Milli.Beat.Blink) answers "at what moment in the day?". Two distinct questions, two distinct halves; separating them by `.` (canonical) or `/` (short) clarifies reading.

## Won't truncation cause the clock to lag behind reality?

Yes — by design. ATS is a counter of **completed** units. Until the next fraction has fully elapsed, it is not shown. Consequence: the displayed time is always ≤ the actual instant (drift ≤ 864 ms at 5-digit precision).

## Why not banker's rounding (half-even)?

Tried in v0.1.0, reverted in v0.1.1. Half-even can briefly push the display **ahead of** reality — incompatible with a monotonic counter. See manifesto §6.

## What about Kilo > 9?

Kilo has no upper bound. `Δ 124.3.5.7.00000` is valid (124,000 + 357 days = ~344 years). Internally it is an unbounded integer.

## How do I verify a third-party library is spec-compliant?

`docs/spec/test-vectors.json` lists 12 reference instants with both canonical and short encodings. Any implementation must produce bit-identical outputs. The project's CI runs this contract against Python and JavaScript on every push.
