"""Islamic calendar bridge ↔ ATS.

Implementation: arithmetic (tabular) calendar via
``convertdate.islamic``. Defaults to the Kuwaiti tabular variant
(type II). For Saudi Arabia's Umm al-Qura observation-based calendar,
the difference is usually 0 or ±1 day.

Date tuple: ``(year, month, day)`` where ``month`` ∈ 1..12 and ``day``
∈ 1..29 or 1..30. Year 1 AH starts on Friday 16 July 622 CE Julian
(= 19 July 622 CE Gregorian proleptic).

Anchored on start-of-day UTC.
"""

from __future__ import annotations

from datetime import date

try:
    from convertdate import islamic as _islamic
except ImportError as exc:  # pragma: no cover
    _ISLAMIC_IMPORT_ERR = exc
    _islamic = None
else:
    _ISLAMIC_IMPORT_ERR = None

from . import ATSDateTime, rd_from_ats, rd_to_ats


def _require() -> None:
    if _islamic is None:
        raise ImportError(
            "code/bridges/islamic.py requires 'convertdate'. Install via "
            "`pip install 'ats-time[bridges]'` or `pip install convertdate`."
        ) from _ISLAMIC_IMPORT_ERR


def to_ats(year: int, month: int, day: int) -> ATSDateTime:
    """Convert an Islamic (AH) date to the ATS instant at 00:00 UTC."""
    _require()
    g_year, g_month, g_day = _islamic.to_gregorian(year, month, day)
    rd = date(g_year, g_month, g_day).toordinal()
    return rd_to_ats(rd)


def from_ats(ats: ATSDateTime) -> tuple[int, int, int]:
    """Inverse — returns ``(year, month, day)`` AH."""
    _require()
    rd = rd_from_ats(ats)
    g = date.fromordinal(rd)
    return _islamic.from_gregorian(g.year, g.month, g.day)
