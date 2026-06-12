# FAQ — Δ ATS

## Why not just keep the Gregorian calendar?

The Gregorian calendar optimizes seasonal alignment for a 16th-century agrarian society. For computing durations, comparing periods, or reasoning about human cycles (focus, rest, project, generation), it adds noise: irregular months, religious weeks, shifting time zones, summer time. ATS does not replace the Gregorian calendar — it offers a cleaner **measurement layer** that coexists with it.

## Why 1969-07-20, not a "neutral" date?

The lunar landing is the most universally positive, technically verifiable event of the 20th century. It is also the moment a human envelope first touched another celestial body, matching the "multi-planetary civilization" framing of the manifesto.

## Why the landing (20/07 20:17:40Z) and not the first step (21/07 02:56:15Z)?

The landing is the date the world remembers ("July 20, 1969"). The first step is symbolically heavier but happens 6h35 later. To honor the shared memory, ATS picks the **touchdown** instant.

## Why not the tropical year (365.2422 d) as a macro unit?

Because it is not an integer multiple of a day. Forcing it into a positional format requires leap days or fractions — exactly what we are trying to eliminate.

## Why not base 12 or base 20?

Base 12 has divisibility benefits (2, 3, 4, 6); base 20 matches the Mayan Long Count. But the whole ecosystem (currency, SI, computing, finance) is base 10. The decimal choice drives adoption friction to near zero.

## How do I read `T+ Δ 20.7.8.0.61137` out loud?

The spec does not standardize oral form. Three observed usages: digit-by-digit ("twenty dot seven dot eight dot zero dot six one one three seven"), grouped pairs ("twenty dot seven dot eight dot zero dot sixty-one thousand one hundred thirty-seven"), or short form ("twenty seven eight zero slash sixty-one").

## "Δ 20.7.8 / 65" — which day exactly?

Ambiguous on purpose — that is why v0.1.2 **brought `Kin` back** into the short form: `Δ 20.7.8.5/65`. The short form is now precise to the day. Loss is bounded to Milli/Beat/Blink (±14 min 24 s).

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

`docs/spec/test-vectors.json` lists 10 reference instants with both canonical and short encodings. Any implementation must produce bit-identical outputs. The project's CI runs this contract against Python and JavaScript on every push.
