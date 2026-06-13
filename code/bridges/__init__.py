"""Calendar bridges — convert non-Gregorian dates to/from ATS instants.

Each bridge module exposes ``to_ats(date_tuple) -> ATSDateTime`` and
``from_ats(ATSDateTime) -> date_tuple``. Calendars deal in dates, not
instants — the bridge layer therefore anchors on the start of the
Gregorian UTC day that contains the given ATS instant.

The shared infrastructure here provides:

* ``RD``: alias for Python's built-in proleptic Gregorian ordinal
  (``datetime.date.toordinal()``). This is the Rata Die used by
  Reingold/Dershowitz "Calendrical Calculations". RD 1 = 0001-01-01.
* ``rd_to_ats`` / ``rd_from_ats``: bridge a Gregorian-ordinal day to/from
  an ATS instant at 00:00 UTC.

Algorithms in the per-calendar modules follow Reingold/Dershowitz
(arithmetic / tabular calendars) or, for the Chinese lunisolar
calendar, embedded HKO tables for 1900-2100.

Bridge interface (each calendar module):

    def to_ats(*calendar_date) -> ATSDateTime
    def from_ats(ats: ATSDateTime) -> tuple
    def rd_from_<cal>(*date) -> int
    def <cal>_from_rd(rd: int) -> tuple
"""

from __future__ import annotations

import sys
from datetime import date, datetime, timezone
from pathlib import Path

# Make sure ``code/`` is importable when bridges are used from outside
# the package (tests live one level up).
_CODE_DIR = Path(__file__).resolve().parent.parent
if str(_CODE_DIR) not in sys.path:
    sys.path.insert(0, str(_CODE_DIR))

from ats import ATSDateTime, ats_to_gregorian, gregorian_to_ats  # noqa: E402


def rd_to_ats(rd: int) -> ATSDateTime:
    """Convert a Rata Die day count to the ATS instant at 00:00 UTC.

    RD 1 corresponds to 0001-01-01 (proleptic Gregorian).
    """
    g = date.fromordinal(rd)
    dt = datetime(g.year, g.month, g.day, tzinfo=timezone.utc)
    return gregorian_to_ats(dt)


def rd_from_ats(ats: ATSDateTime) -> int:
    """Inverse of :func:`rd_to_ats` — drops sub-day precision."""
    dt = ats_to_gregorian(ats.to_canonical(), out_tz="UTC")
    return date(dt.year, dt.month, dt.day).toordinal()
