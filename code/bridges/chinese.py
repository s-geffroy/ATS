"""Chinese lunisolar calendar bridge ↔ ATS.

Implementation: ``lunardate`` package, which embeds the standard
Hong Kong Observatory (HKO) tables for years 1900–2100. Outside that
range the conversion raises ``ValueError`` upstream.

Date tuple: ``(year, month, day, leap_month)`` where ``leap_month`` is
the embolismic-month flag (False on regular months, True if the month
is the intercalary one for that year).

Anchored on start-of-day UTC.
"""

from __future__ import annotations

from datetime import date

try:
    from lunardate import LunarDate as _LunarDate
except ImportError as exc:  # pragma: no cover
    _IMPORT_ERR = exc
    _LunarDate = None
else:
    _IMPORT_ERR = None

from . import ATSDateTime, rd_from_ats, rd_to_ats


def _require() -> None:
    if _LunarDate is None:
        raise ImportError(
            "code/bridges/chinese.py requires 'lunardate'. Install via "
            "`pip install 'ats-time[bridges]'` or `pip install lunardate`."
        ) from _IMPORT_ERR


def to_ats(year: int, month: int, day: int, leap_month: bool = False) -> ATSDateTime:
    """Convert a Chinese lunisolar date to the ATS instant at 00:00 UTC."""
    _require()
    ld = _LunarDate(year, month, day, leap_month)
    g = ld.toSolarDate()  # datetime.date
    rd = date(g.year, g.month, g.day).toordinal()
    return rd_to_ats(rd)


def from_ats(ats: ATSDateTime) -> tuple[int, int, int, bool]:
    """Inverse — returns ``(year, month, day, leap_month)``."""
    _require()
    rd = rd_from_ats(ats)
    g = date.fromordinal(rd)
    ld = _LunarDate.fromSolarDate(g.year, g.month, g.day)
    return (ld.year, ld.month, ld.day, bool(ld.isLeapMonth))
