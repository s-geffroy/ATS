"""Hebrew calendar bridge ↔ ATS.

Algorithm: arithmetic Hillel II calendar (the standard Hebrew civil
calendar) via the well-tested `convertdate.hebrew` module, which
implements Reingold/Dershowitz formulas verbatim. The module is an
optional dependency declared as the `bridges` extra (see pyproject.toml);
``ImportError`` carries an instruction to install it.

Date tuple format: ``(year, month, day)`` where ``month`` is 1..12 in a
common year and 1..13 in a leap year (Adar I = 12, Adar II = 13).

The bridge anchors on the start of the Gregorian UTC day that contains
the ATS instant — calendar dates have no sub-day precision.
"""

from __future__ import annotations

try:
    from convertdate import hebrew as _hebrew
except ImportError as exc:  # pragma: no cover - reported at first call
    _HEBREW_IMPORT_ERR = exc
    _hebrew = None
else:
    _HEBREW_IMPORT_ERR = None

from datetime import date

from . import ATSDateTime, rd_from_ats, rd_to_ats


def _require() -> None:
    if _hebrew is None:
        raise ImportError(
            "code/bridges/hebrew.py requires the 'convertdate' package. "
            "Install via `pip install 'ats-time[bridges]'` or "
            "`pip install convertdate`."
        ) from _HEBREW_IMPORT_ERR


def to_ats(year: int, month: int, day: int) -> ATSDateTime:
    """Convert a Hebrew (year, month, day) to the ATS instant at 00:00 UTC."""
    _require()
    g_year, g_month, g_day = _hebrew.to_gregorian(year, month, day)
    rd = date(g_year, g_month, g_day).toordinal()
    return rd_to_ats(rd)


def from_ats(ats: ATSDateTime) -> tuple[int, int, int]:
    """Inverse of :func:`to_ats` — returns ``(year, month, day)``."""
    _require()
    rd = rd_from_ats(ats)
    g = date.fromordinal(rd)
    return _hebrew.from_gregorian(g.year, g.month, g.day)
