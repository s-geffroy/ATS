"""Hindu (Indian National / Saka) calendar bridge ↔ ATS.

Implementation: the **Indian National Calendar** (Saka, modern civil
calendar adopted in 1957) via ``convertdate.indian_civil``. This is a
**solar** calendar with 12 months, distinct from the classical
Sūrya Siddhānta lunisolar Hindu calendars (which require regional
panchanga tables — not implemented here).

Date tuple: ``(year, month, day)`` where ``year`` is Saka era,
``month`` ∈ 1..12 (Chaitra…Phalguna), ``day`` ∈ 1..30 or 1..31.

Anchored on start-of-day UTC.

> **Note** — the roadmap mentions "Sūrya Siddhānta moderne" for this
> bridge. The Indian National Calendar is the de facto modern civil
> calendar of India and rests on the same Vedic month names; we use it
> as a pragmatic substitute. A future bridge could vendor a Sūrya
> Siddhānta panchanga; the current shape would not change.
"""

from __future__ import annotations

from datetime import date

try:
    from convertdate import indian_civil as _indian_civil
except ImportError as exc:  # pragma: no cover
    _IMPORT_ERR = exc
    _indian_civil = None
else:
    _IMPORT_ERR = None

from . import ATSDateTime, rd_from_ats, rd_to_ats


def _require() -> None:
    if _indian_civil is None:
        raise ImportError(
            "code/bridges/hindu.py requires 'convertdate'. Install via "
            "`pip install 'ats-time[bridges]'` or `pip install convertdate`."
        ) from _IMPORT_ERR


def to_ats(year: int, month: int, day: int) -> ATSDateTime:
    """Convert a Saka (Indian National) date to ATS at 00:00 UTC."""
    _require()
    g_year, g_month, g_day = _indian_civil.to_gregorian(year, month, day)
    rd = date(g_year, g_month, g_day).toordinal()
    return rd_to_ats(rd)


def from_ats(ats: ATSDateTime) -> tuple[int, int, int]:
    """Inverse — returns ``(year, month, day)`` in Saka era."""
    _require()
    rd = rd_from_ats(ats)
    g = date.fromordinal(rd)
    return _indian_civil.from_gregorian(g.year, g.month, g.day)
