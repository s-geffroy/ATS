"""Maya Long Count bridge ↔ ATS.

Implementation: base-20 Long Count using the **GMT 584283** correlation
(the ISO 19108 / Goodman-Martínez-Thompson constant). The exact
correlation is debated — GMT 584285 is the "alternate Goodman-Thompson"
form ±2 days; we pick 584283 per Reingold/Dershowitz and document the
choice so users can vendor their own correlation if needed.

Date tuple: ``(baktun, katun, tun, uinal, kin)`` where each digit is in
[0..19] except ``tun`` ∈ [0..17] (a tun has 18 uinals = 360 days). The
canonical "13.0.13.12.2" notation joins these dot-separated.

We rely on ``convertdate.mayan.to_jd`` / ``from_jd`` which implements
the GMT 584283 correlation by default.
"""

from __future__ import annotations

from datetime import date

try:
    from convertdate import mayan as _mayan
except ImportError as exc:  # pragma: no cover
    _MAYAN_IMPORT_ERR = exc
    _mayan = None
else:
    _MAYAN_IMPORT_ERR = None

from . import ATSDateTime, rd_from_ats, rd_to_ats

# RD 1 corresponds to Julian Day 1721425.5 (start of 0001-01-01 UTC,
# proleptic Gregorian). convertdate.mayan returns ``to_jd`` as a float
# ending in .5 (midnight) — truncating with int() drops the fraction,
# so the matching RD offset is 1721424. Round-trip vetted against
# 2026-06-13 → 13.0.13.12.2 and 2012-12-21 → 13.0.0.0.0.
_RD_TO_JD = 1721424


def to_ats(baktun: int, katun: int, tun: int, uinal: int, kin: int) -> ATSDateTime:
    """Convert a Maya Long Count tuple to the ATS instant at 00:00 UTC."""
    _require()
    jd = _mayan.to_jd(baktun, katun, tun, uinal, kin)
    rd = int(jd) - _RD_TO_JD
    if rd < 1:
        raise ValueError(
            f"Maya Long Count {(baktun, katun, tun, uinal, kin)} predates "
            "the proleptic Gregorian year 1 (RD < 1); not supported by the "
            "core ATS Python implementation."
        )
    return rd_to_ats(rd)


def from_ats(ats: ATSDateTime) -> tuple[int, int, int, int, int]:
    """Inverse — returns ``(baktun, katun, tun, uinal, kin)``."""
    _require()
    rd = rd_from_ats(ats)
    # convertdate.mayan.to_jd returns midnight (.5); from_jd at integer JD
    # returns the previous day's Long Count, so we pass the .5 explicitly.
    jd = rd + _RD_TO_JD + 0.5
    return tuple(_mayan.from_jd(jd))


def _require() -> None:
    if _mayan is None:
        raise ImportError(
            "code/bridges/maya.py requires 'convertdate'. Install via "
            "`pip install 'ats-time[bridges]'` or `pip install convertdate`."
        ) from _MAYAN_IMPORT_ERR
