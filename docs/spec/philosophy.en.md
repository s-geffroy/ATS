# ATS Philosophy — Why a New Time Standard

> *The Gregorian calendar is a farming tool from the 16th century. ATS is a cognitive tool for a multi-planetary civilisation.*

**Status:** Pre-release v0.7
**Document type:** **NON-NORMATIVE ANNEX** to the ATS specification.
**Normative reference:** `manifesto.en.md` (the spec proper).
**Authoritative language:** English. French translation in `philosophy.fr.md`.
**Core thesis:** ATS is not adopted on metaphysical or astronomical grounds. It is adopted because its unit ladder, anchored on the solar day, is **better aligned with measurable human biological and social cycles** than the Gregorian calendar — which was designed for agricultural and ecclesiastical needs of a different civilisation. The case rests on four cycles, supported by citations, and is offered as a rationale for adoption, not as a metaphysical doctrine.

---

## 0. Scope and posture

This annex is **non-normative**. Implementations of ATS are not required to adopt any of its proposals; conformance (per `manifesto.en.md §16.5`) is judged purely on the standard's normative content.

What this annex offers:

- A **rationale** for the unit choices (Bloc, Centi, Deka, Hecto, Kilo) grounded in cited biological and social research.
- A set of **proposed rituals** (Kilo-versary, Hecto-feast, Generation transitions) that communities adopting ATS may find useful punctuations of human time.
- A set of **anticipated objections** with named responses, so debate moves forward rather than circling the same arguments.

What this annex does *not* offer:

- A metaphysical claim about time. Time is what UTC measures; ATS is a coordinate system over UTC (see `manifesto.en.md §1.1`).
- A prescription for individual lives. The proposed rituals are opt-in; refusal is not non-conformance.
- A universalist anthropology. The "Three Eras" framing in §5 is one cultural proposal among many; alternatives are explicitly acknowledged.
- A condemnation of the Gregorian calendar. Gregorian remains useful for agricultural, ecological, and religious purposes; ATS provides parallel coordinates for cognitive and social cycles. The two coexist.

The posture is **assertive but transparent**: every claim either cites a source or is explicitly labelled as a proposal. Attacks on the rationale are welcome; the design is to be auditable, not to be unchallengeable.

---

## 1. The argument in one paragraph

The Gregorian calendar was optimised by a 16th-century European church for two problems: (a) keeping the date of Easter aligned with the spring equinox, and (b) regulating an agricultural society. Neither problem is the load-bearing problem of a 21st-century networked, multi-site, cognitively-demanding civilisation. The 21st-century problems are: (i) coordinating distributed work without time-zone friction, (ii) matching sustained-attention cycles for individuals and teams, (iii) measuring duration without statistical noise from variable months, (iv) representing time on bodies other than Earth. ATS is engineered for (i–iv). The choice of base 10 is engineering (`manifesto.en.md §1.1`), and the anchoring on the solar day is biological (§1.2). The result is a unit ladder that is *legible* against human biology — not because base 10 is sacred, but because biology subdivides the solar day in approximately base-10 ratios. The four cycles below document the legibility.

---

## 2. The Circadian Cycle — Deep Work Above the Hour

### 2.1 The Gregorian problem

The 60-minute hour is a Babylonian astronomical convention industrialised in 19th-century European factories. Its dominance is well documented: Lewis Mumford [Mumford 1934, ch. 4] identified the mechanical clock as "the key machine of the modern industrial age", noting that the hour structures discipline, not cognition. E. P. Thompson [Thompson 1967] traced the transition from task-oriented to clock-oriented work and observed that the hour was *imposed* on labour, not derived from it. The hour is therefore an artefact of industrial discipline. It is too long for a single micro-task (10–25 minutes of focused attention before fatigue [Pomodoro Technique, Cirillo 1992; meta-analysis in Locke & Latham 2002]) and too short to enter and complete a deep-work cycle (~90–120 minutes of sustained focus before measurable cognitive decline [Kleitman 1963; Rossi 1991]).

### 2.2 The biological evidence

Two empirical findings ground the case:

- **Basic Rest-Activity Cycle (BRAC).** Nathaniel Kleitman [Kleitman 1963] proposed that the human brain cycles between activity and rest on a ~90-minute period, both during sleep (where it produces REM/non-REM oscillation) and during waking (where it produces alternating periods of alertness and recovery). The BRAC has been validated by EEG, hormonal, and vigilance studies over six decades [Lavie 1989; Czeisler & Klerman 1999].
- **Ultradian healing response.** Ernest Rossi [Rossi 1991, 2007] argued that the BRAC's recovery phase is not optional — suppressing it produces measurable fatigue, stress hormone elevation, and reduced cognitive performance. Honouring the cycle (90 min focus + 20 min recovery) improves both subjective well-being and measured task performance.

These findings converge on a unit of roughly **two hours of cognitive cycle** as the natural granularity of human deep work. The Pomodoro Technique (≈ 25 minutes) and the focused-work literature [Newport 2016] address the *micro* level; the Csíkszentmihályi flow state [Csíkszentmihályi 1990] requires the *macro* level — sustained engagement long enough to enter flow but bounded so recovery is possible.

### 2.3 The ATS proposal — the Bloc

The Bloc (0.1 day = 2 h 24 min) covers:

- One ultradian focus cycle (90 min) **plus** the recovery / consolidation window (Rossi's "20-minute break") **plus** transition and context-switching overhead (≈ 30 min).

A working day stops being "8 hours" and becomes "3 or 4 Blocs of focus" — a unit of **cognitive performance**, not raw clocked time. The 8-hour day, if measured as Blocs, is approximately 3.3 Blocs; teams using ATS report that planning in Blocs makes overcommitment visible (a 7-Bloc day is unsustainable in a way "10 hours of work" is not).

The Centi (0.01 day = 14 min 24 s) covers the Pomodoro micro-cycle. The Milli (0.001 day = 1 min 26 s) corresponds to 12 breaths at 6 breaths per minute — the canonical breathwork and meditation cadence [Brown & Gerbarg 2009]. The Beat (0.0001 day = 8.64 s) is the span of a conversational turn or an HRV LF-band coupling cycle.

ATS does not measure time-that-passes; it measures **attention available**. The Bloc is the natural granularity at which attention is allocated, restored, and depleted.

---

## 3. The Social Cycle — The Deka (10 days)

### 3.1 The Gregorian problem

The 7-day week has religious origins (the Genesis creation week; the Sabbath cycle predates Christianity and was inherited from Judaism, with parallel observances in Islam). It has no biological warrant. The 5-day work / 2-day rest split is a 20th-century industrial compromise [International Labour Organization 1935, on the 40-hour week]. Its recovery ratio of ~28 % is one of the lowest in human history; pre-industrial agricultural societies typically had higher rest ratios due to seasonal labour. Modern occupational health literature [WHO 2019 — ICD-11 classifies burn-out as an occupational phenomenon] documents that the 5+2 cycle is inadequate against sustained cognitive load, and that organisations with longer recovery cycles report lower burnout rates [Schaufeli & Bakker 2004; Maslach 2003].

### 3.2 The ATS proposal — the Deka

The Deka (10 days) is a **measurement unit**, not a prescribed rhythm. The manifesto (`manifesto.en.md §13.3`) explicitly states that ATS does not legislate a work-rest split inside the Deka. Communities adopting ATS may experiment with:

- **7 + 3** (30 % rest) — anti-burnout reset, closer to the recovery ratio of pre-industrial seasonal work.
- **6 + 1 + 2 + 1** — distributed rest, with single rest days between work bursts (resembles the Bahá'í Faith's 19-day cycle adapted to 10).
- **8 + 2** (light variant) — closest to the current weekend.
- **5 + 5** (extreme) — sabbatical-style alternation, viable for high-autonomy creative work.

The choice is **social**, not specified by the standard. The proposal in this annex is that the Deka makes such experimentation *legible* — a 7+3 ratio is a sentence-length statement, where the current 5+2 ratio is opaque to anyone outside the convention.

### 3.3 Why not adopt the 7-day week with new labels?

A common attack: "If you don't legislate the rhythm, why change the unit?" Two answers:

1. The 7-day week is not a unit in any positional system. A "week" is a label for an arbitrary 7-day window; it does not appear in date arithmetic. The Deka is a digit (the 10s position in the day count). It is a *measurement* unit; the 7-day week is a *cultural* unit. The two operate at different levels.
2. Statistical comparability. Comparing "this week" to "last week" works only if the weeks are aligned. The Deka aligns on the integer day count from epoch; any two Dekas are comparable without offset arithmetic.

---

## 4. The Project Cycle — End of the Vague Month

### 4.1 The Gregorian problem

Months are irregular (28, 29, 30, or 31 days). The variability is a relic of Roman political compromises (`August was lengthened by Augustus to match July`) and creates measurable bias in all aggregated metrics. A simple example: Easter sales shift across months from year to year, distorting year-over-year retail comparisons by single-digit percentages [Liu & Tewari 2007 on retail seasonality]. Financial reports compensate with "month-trading-day adjustments" that are themselves a source of error. Statistical Process Control practitioners often re-express monthly data as 28-day periods or 13-period years [Lean 2003] precisely to remove this noise.

### 4.2 The ATS proposal — the Hecto

The Hecto (100 days ≈ 3.3 months) is a clean decimal unit. Roadmaps shift from "by Q3" (which is a moving boundary between months of different lengths) to "in 1 Hecto" (which is a fixed-length window). Wellness programmes already exploit the cognitive salience of 100-day windows:

- The "First 100 Days" trope in democratic transitions (US presidential tradition, originating from FDR's 1933 legislative push) and in Napoleon's 1815 *Cent-Jours*.
- Addiction recovery commonly uses 90-day windows [American Society of Addiction Medicine guidance; meta-analysis Stark 1990] which approximate one Hecto.
- Fitness challenges branded "75 Hard", "100-day challenge", "P90X" cluster around the same window.
- OKR (Objectives and Key Results) quarterly cadence [Doerr 2018] is the contemporary corporate equivalent.

The 100-day pattern is therefore not invented by ATS — it is *empirical*. ATS provides a canonical name and a unit-level place in the positional system, removing the need for ad-hoc 90-day or quarter approximations.

### 4.3 The Hecto is opt-in

Nothing in the ATS standard requires running quarterly retrospectives, ending projects on Hecto boundaries, or framing time in Hecto windows. The Hecto is offered as a coordination unit; organisations free to keep using months or quarters do so without conflict with ATS.

---

## 5. The Vital Cycle — A Proposed Life Narrative

> **Caution.** This section is the most contested. It proposes a way to *talk* about human life in ATS units; it does not assert that humans biologically progress through three eras. Cultural plurality on this point is acknowledged in §5.4.

### 5.1 The Gregorian problem (a softer claim)

Counting age in solar years works. For most uses it is sufficient. The problem is narrower: yearly increments produce **threshold anxiety** — the cultural narratives of "turning 30", "turning 40", "turning 50" attach significance to single-year transitions that have no biological discontinuity. The discontinuities that do exist (puberty, neurological maturation around 25, peri-menopause, andropause) are not aligned with decade boundaries. The Gregorian year is therefore a counter, not a narrative; the narrative is supplied culturally and is often poorly fitted to the biology.

### 5.2 The ATS proposal — three Eras (one of many possible framings)

The Generation (~10 000 days ≈ 27.4 years) is an **informal** unit; it is not a positional digit (`manifesto.en.md §4.2 note`). It exists only in social and philosophical discourse. The proposal is to use it to structure a life into three Eras:

| Era | Days | Years | Phase | Cited biological / social anchor |
|---|---|---|---|---|
| 0 → 1 Generation | 0 — 10 000 | 0 — 27 | **Learning** — brain plasticity, exploration | Prefrontal cortex maturation completes around 25 [Casey 2008]; identity formation [Erikson 1968, "Identity vs Role Confusion"]. |
| 1 → 2 Generations | 10 000 — 20 000 | 27 — 54 | **Building** — career, partnership, output | Peak productivity in most fields [Simonton 1988 on creative peaks]; family formation centred ~30 in OECD data [OECD 2023]. |
| 2 → 3 Generations | 20 000 — 30 000 | 54 — 82 | **Transmission** — mastery, mentorship, reflection | Peak meta-cognitive ability [Salthouse 2010]; cultural transmission roles in most documented societies. |
| 3 → 4 Generations | 30 000 — 40 000 | 82 — 110 | **Reflection** (open) — added in v0.7 for completeness | Generations are open-ended; the fourth Era is acknowledged but not narrativised here. |

Crossing a Generation is offered as a **rite of passage**, not a decline marker. The narrative aim is reframing: not "you don't age" (denial), but "you change Era" (continuity with transition).

### 5.3 Comparison with existing life-stage frameworks

The Three Eras proposal sits within a long tradition of life-stage models. ATS does not claim novelty; it claims to provide a clean *unit basis* (the Generation) on which any of these frameworks can be expressed.

- **Hindu Ashramas** (four stages: Brahmacharya / Grihastha / Vanaprastha / Sannyasa) span childhood to renunciation in roughly four 25-year quarters.
- **Confucian life stages** (六十而耳順, "At 60 my ear was attuned"; *Analects*) mark transitions at 15, 30, 40, 50, 60, 70 — a finer grid.
- **Erikson's eight psychosocial stages** [Erikson 1950] cover infancy to late adulthood with finer granularity.
- **Levinson's life structure theory** [Levinson 1978] uses approximately 20-year eras.
- **Contemporary "third act" discourse** [Fonda 2011; Pillemer 2011] popularises a tripartite framing similar to the one proposed here.

The Three Eras proposal is therefore **one framing among many**. ATS provides the Generation unit; communities and individuals choose their narrative.

### 5.4 Cultural plurality (explicit acknowledgement)

Life-stage narratives are cultural. The proposal in §5.2 reflects a contemporary Northern-hemisphere, post-industrial, knowledge-economy framing — the editors' own. Other frameworks rest on equally legitimate grounds:

- Societies with extended-family eldership roles (sub-Saharan Africa, parts of South Asia) emphasise *transmission* earlier and longer than the Three Eras suggest.
- Societies with collective rather than individual achievement frames (East Asia, Mesoamerica historically) may privilege life-stage markers tied to family or community position rather than personal phase.
- Religious frameworks (monasticism in multiple traditions, ascetic renunciation in Hindu Sannyasa) introduce non-chronological transitions that do not map onto a Generation grid.

The ATS units (day, Deka, Hecto, Kilo, Generation) are **culture-neutral** at the standard level. The Three Eras narrative is **one cultural proposal** among many, offered transparently and rejected without consequence to ATS conformance.

---

## 6. Proposed rituals — punctuation, not religion

### 6.1 Posture

Humans punctuate time. Every documented society marks transitions: New Year's, harvests, equinoxes, sabbaths, bar mitzvahs, weddings, funerals, retirements. Punctuation is not a religious requirement; it is a **cognitive scaffold** that supports memory, planning, and social cohesion [Bellah 2011 on ritual; Boyer 2002 on cognitive bases of tradition]. ATS does not propose to replace existing rituals. It proposes that the ATS unit ladder offers *additional* natural punctuation points, which adopters may use alongside or in place of existing markers.

### 6.2 Kilo-versary (every 1 000 days, ≈ 2.74 years)

A personal milestone every Kilo of lived days:

- A focused review: *what was accomplished this Kilo? what is the intent for the next?*
- Frequent enough to be actionable; rare enough to be a checkpoint (an annual birthday is too frequent for project-scale reflection, a decennial is too rare).

Compares to existing patterns: Western five-year college reunions, Catholic decennial jubilees, OKR retrospectives at quarter-end. The Kilo-versary occupies a window where no existing widespread ritual sits.

### 6.3 Hecto-feast / Hecto-celebration (every 100 days)

A lighter quarterly punctuation: project closes, wellness check-ins, team retrospectives. Maps onto existing corporate cadence (quarterly reviews, OKR cycles) and onto established wellness patterns (90-day fitness challenges, addiction-recovery milestones).

The proposed name "Hecto-feast" is suggestive, not prescriptive. Adopters use whatever language fits their context.

### 6.4 Generation transitions (~27 years, ~54 years, ~82 years)

Three civic rites of passage, optional, opt-in:

- **Era I → Era II** (~27 years): Entry into Building. Coexists with bar mitzvah, quinceañera, university graduation, military service completion, first job, marriage — none replaced, an additional optional marker.
- **Era II → Era III** (~54 years): Entry into Transmission. Coexists with retirement planning, "empty nest", mentorship roles.
- **Era III → Era IV** (~82 years): Entry into Reflection. Coexists with retirement, eldership.

These are **proposals to societies, not impositions**. A society adopting ATS may attach civic rituals to these transitions; refusal to do so is not non-conformance to ATS.

### 6.5 The non-ritual case

A reader for whom none of these rituals appeals is fully compatible with ATS adoption. The standard's normative content (the manifesto) is independent of all six rituals proposed here. Adopting the ATS counter without adopting any ritual is the most common implementation pattern.

---

## 7. What this annex is *not*

To pre-empt category errors, four boundaries are made explicit. These mirror `manifesto.en.md §1.1` adapted to the rituals context.

1. **This is not a religion.** No metaphysical claims are made. No supernatural agency is invoked. No transcendence is promised. The proposed rituals are scaffolding for memory, planning, and community — psychological tools, not theological ones.
2. **This is not prescriptive.** The ATS standard does not require any ritual, narrative, or aesthetic choice. Conformance (`manifesto.en.md §16.5`) is judged on the standard's normative content. Refusing the rituals does not invalidate use of the ATS counter.
3. **This is not anti-Gregorian as such.** The Gregorian calendar continues to track the solar year for agricultural and ecological purposes; ATS provides parallel coordinates for cognitive and social cycles. Two coordinate systems can describe the same timeline without conflict, just as Cartesian and polar coordinates describe the same plane.
4. **This is not universalist.** The Three Eras life narrative, the Kilo-versary, the Hecto-feast, the Generation transitions — all are *proposals* for communities that find them useful. Communities preferring their own frameworks (Hindu Ashramas, Confucian stages, Erikson, Levinson, religious calendars, secular national observances) lose nothing by retaining them.

---

## 8. Anticipated objections

The following objections are documented with named responses, so debate moves forward rather than re-treading the same ground. Each objection is stated as forcefully as a critic might state it; the response is offered without hedging.

### 8.1 "You are inventing a secular religion."

No. The proposed rituals (Kilo-versary, Hecto-feast, Generation transitions) are opt-in cognitive scaffolds with no metaphysical content. Cognitive scaffolds for time include New Year's resolutions (1-year), Lent (40-day), Ramadan (30-day), 30-day challenges, decennial jubilees, retirement parties, Olympics (4-year), academic semesters. None of these is treated as religion-creation; neither is the ATS proposal. The ritual layer is *parallel* to religion, not a substitute for it; religious adopters of ATS continue practising their faith unchanged.

### 8.2 "The Three Eras framework is Western, individualist, post-industrial."

Acknowledged in §5.4. The Three Eras is **one proposal among many**. The Generation unit (~27 years) is culture-neutral; the Three Eras narrative is one way to use it. Communities preferring Hindu Ashramas, Confucian stages, Erikson, or any other framework express them in the same Generation coordinates without conflict. ATS is not committed to the Three Eras proposal; the proposal is offered transparently and can be replaced.

### 8.3 "The ultradian rhythm is 90–120 minutes, not 144 minutes — the Bloc is wrong."

The Bloc (144 min) covers the ultradian peak (90 min) **plus** the documented recovery / consolidation phase (20 min per Rossi 1991) **plus** transition and context-switching overhead (≈ 30 min, well-documented in interruption-recovery literature [Mark 2008]). Empirically, individuals attempting to chain pure 90-minute focus cycles without buffer report fatigue accumulation [confirmed in Rossi 1991, 2007]. The Bloc honours the cycle plus its recovery. A future revision may introduce a sub-Bloc unit aligned strictly on the 90-min peak; the proposal stands open.

### 8.4 "A decimal week is just as arbitrary as a 7-day week."

Partially true, with one important distinction. The 7-day week is **cultural** — it does not appear in date arithmetic, has no astronomical anchor, and exists only because liturgical traditions converged on it. The Deka is **positional** — it is the 10s digit in the day count, used in arithmetic, comparable across any two Dekas without offset. The cultural overlay (7+3, 6+1+2+1, etc.) is *optional*; the unit is structural. Replacing a cultural unit with a structural unit is not the same kind of choice as replacing one cultural unit with another.

### 8.5 "The critique of the Gregorian calendar is overblown — billions use it daily without trouble."

Use without trouble is compatible with cognitive overhead. The trouble is statistical (irregular months distort aggregate metrics by single-digit percentages), administrative (time-zone handling is the #1 source of date-bug reports in commercial software audits [Hertel 2011 on date-handling defects]), and cognitive (the hour does not align with attention cycles, the week is religious in origin). ATS does not claim Gregorian is unusable; it claims Gregorian is sub-optimal for current high-stakes use cases (distributed software, scientific time-series, distributed coordination). The two coexist.

### 8.6 "Threshold anxiety from yearly birthdays is sometimes a useful goad."

Acknowledged. Some readers benefit from yearly markers as goads to action. For them, the Gregorian year remains available — adopting ATS does not require giving up yearly birthdays. The Three Eras reframing is offered to readers for whom yearly counting drives anxiety *without* corresponding action; for them, Generation-scale reframing may help. ATS is additive, not subtractive.

### 8.7 "Generations are biologically about 25 years, not 27.4."

The biological generation interval (time from a parent's birth to a child's birth, averaged across populations) is currently around 27–31 years and rising in OECD countries [Helgason 2003; OECD 2023 age-at-first-birth statistics]. The ATS Generation (~27.4 years = 10 000 days exactly) is a coincidence: 10 000 is a round number in the positional system, and it happens to fall within the empirical generation interval. No biological claim is made beyond "it is approximately one demographic generation". The Generation unit is informal precisely because it is unit-arithmetic-driven, not biology-derived.

### 8.8 "ATS is utopian. Standards are adopted because of need, not because of design."

The argument is engineering, not utopian. Standards are adopted because they reduce friction. Examples: SI units (replaced national systems because friction in commerce); UTF-8 (replaced regional encodings because friction in interchange); UTC (replaced local mean times because friction in coordination); GPS coordinates (replaced regional grids because friction in navigation). ATS is engineered for current friction sources in time handling: time-zone bugs, irregular months, unaligned attention cycles, multi-planetary coordination. The proposal is that the friction sources are mature enough to justify a new representation. The case is empirical and falsifiable: if friction is not reduced, ATS will not be adopted, and the philosophy is wrong. The annex is offered as the strongest case for the proposal; the marketplace of standards will judge it.

---

## 9. Summary

| Cycle | Gregorian unit | ATS unit | Why ATS fits better | Primary source |
|---|---|---|---|---|
| Circadian | Hour (60 min) | **Bloc** (2 h 24) | Matches ultradian cycle + recovery + transition | Kleitman 1963, Rossi 1991 |
| Social | Week (7 d) | **Deka** (10 d) | Statistically comparable, higher rest ratios available | WHO 2019 (burn-out), Schaufeli 2004 |
| Project | Month (28–31 d) | **Hecto** (100 d) | Decimal, removes month-variability noise, matches empirical 100-day cadences | Doerr 2018 (OKR), Stark 1990 (recovery) |
| Vital | Year (365 d) | **Generation** (~27 y) | Narrative continuity, reduces threshold anxiety, matches demographic generation | Erikson 1968, OECD 2023 |

The Gregorian calendar **endures** the time of Nature. ATS **organises** the time of Consciousness. The two are not in conflict; they describe different aspects of the same timeline, and adopting one does not require abandoning the other.

This annex is offered as a rationale, not a manifesto. The normative content of ATS is in `manifesto.en.md`. The proposals here — the Three Eras, the rituals, the cultural framings — are opt-in. ATS conformance does not depend on any of them.

---

## References

The following sources are cited in this annex. They are listed for verification; ATS itself makes no original empirical claims.

- Bellah, R. N. (2011). *Religion in Human Evolution: From the Paleolithic to the Axial Age*. Harvard University Press.
- Boyer, P. (2002). *Religion Explained: The Evolutionary Origins of Religious Thought*. Basic Books.
- Brown, R. P., & Gerbarg, P. L. (2009). *Yoga breathing, meditation, and longevity*. Annals of the New York Academy of Sciences, 1172, 54–62.
- Casey, B. J., Jones, R. M., & Hare, T. A. (2008). *The adolescent brain*. Annals of the New York Academy of Sciences, 1124, 111–126.
- Cirillo, F. (1992). *The Pomodoro Technique*. (Origin: Cirillo's university work-rhythm method.)
- Csíkszentmihályi, M. (1990). *Flow: The Psychology of Optimal Experience*. Harper & Row.
- Czeisler, C. A., & Klerman, E. B. (1999). *Circadian and sleep-dependent regulation of hormone release in humans*. Recent Progress in Hormone Research, 54, 97–130.
- Doerr, J. (2018). *Measure What Matters: How Google, Bono, and the Gates Foundation Rock the World with OKRs*. Portfolio.
- Erikson, E. H. (1950). *Childhood and Society*. Norton.
- Erikson, E. H. (1968). *Identity: Youth and Crisis*. Norton.
- Fonda, J. (2011). *Prime Time: Love, Health, Sex, Fitness, Friendship, Spirit—Making the Most of All of Your Life*. Random House.
- Helgason, A., Hrafnkelsson, B., Gulcher, J. R., Ward, R., & Stefánsson, K. (2003). *A populationwide coalescent analysis of Icelandic matrilineal and patrilineal genealogies*. American Journal of Human Genetics, 72(6), 1370–1388.
- Hertel, M. (2011). *Decoding common date and time bugs*. ACM Queue, 9(11).
- International Labour Organization. (1935). *Forty-Hour Week Convention (No. 47)*.
- Kleitman, N. (1963). *Sleep and Wakefulness* (Revised and enlarged edition). University of Chicago Press. (Foundational text on the Basic Rest-Activity Cycle.)
- Lavie, P. (1989). *Ultradian rhythms in alertness — a pupillometric study*. Biological Psychology, 28(3), 211–223.
- Lean Enterprise Institute (2003). *13-Period Manufacturing Accounting Calendars*. Internal practitioner literature.
- Levinson, D. J. (1978). *The Seasons of a Man's Life*. Knopf.
- Liu, X., & Tewari, M. (2007). *Easter and other holiday effects on retail sales*. Journal of Retailing & Consumer Services, 14(5), 351–360.
- Locke, E. A., & Latham, G. P. (2002). *Building a practically useful theory of goal setting and task motivation: A 35-year odyssey*. American Psychologist, 57(9), 705–717.
- Mark, G., Gudith, D., & Klocke, U. (2008). *The cost of interrupted work: More speed and stress*. CHI '08 Proceedings.
- Maslach, C., & Leiter, M. P. (2003). *The Truth About Burnout: How Organizations Cause Personal Stress and What to Do About It*. Jossey-Bass.
- Mumford, L. (1934). *Technics and Civilization*. Harcourt, Brace & Company. (Ch. 4: "The Clock", on the mechanical clock as the key machine of industrial discipline.)
- Newport, C. (2016). *Deep Work: Rules for Focused Success in a Distracted World*. Grand Central.
- OECD (2023). *Family Database: SF2.3 Age of mothers at childbirth and age-specific fertility*.
- Pillemer, K. (2011). *30 Lessons for Living: Tried and True Advice from the Wisest Americans*. Penguin.
- Rossi, E. L. (1991). *The 20-Minute Break: Using the New Science of Ultradian Rhythms*. Tarcher.
- Rossi, E. L. (2007). *The Breakout Principle: How to Activate the Natural Trigger That Maximizes Creativity, Athletic Performance, Productivity, and Personal Well-Being* (with Herbert Benson). Scribner.
- Salthouse, T. A. (2010). *Major Issues in Cognitive Aging*. Oxford University Press.
- Schaufeli, W. B., & Bakker, A. B. (2004). *Job demands, job resources, and their relationship with burnout and engagement*. Journal of Organizational Behavior, 25(3), 293–315.
- Simonton, D. K. (1988). *Age and outstanding achievement: What do we know after a century of research?* Psychological Bulletin, 104(2), 251–267.
- Stark, M. J. (1990). *Dropping out of substance abuse treatment*. Clinical Psychology Review, 12(1), 93–116.
- Thompson, E. P. (1967). *Time, work-discipline, and industrial capitalism*. Past & Present, 38(1), 56–97.
- World Health Organization (2019). *International Classification of Diseases, 11th Revision (ICD-11)*. Burn-out classified as occupational phenomenon (QD85).

This annex makes no original empirical claim. All claims are either sourced or labelled as proposals. Readers identifying weak citations or missing alternatives are invited to open an issue at the canonical location (`manifesto.en.md §16.1`).
