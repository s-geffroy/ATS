from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_FLOOR
from zoneinfo import ZoneInfo

# =========================
# ATS CONFIGURATION
# =========================

ATS_SYMBOL = "Δ"
ATS_DECIMALS = 5                 # fffff digits
ATS_SCALE = 10 ** ATS_DECIMALS   # 100000

# Epoch = first human step on the Moon (UTC)
ATS_EPOCH = datetime(1969, 7, 21, 2, 56, 15, tzinfo=timezone.utc)

# =========================
# CORE DATATYPE
# =========================

@dataclass(frozen=True, slots=True)
class ATSDateTime:
    """Canonical ATS DateTime.

    Canonical string:
      "T+ Δ MYR.KIL.HEC.DEK.KIN.fffff"

    - MYR: int >= 0 (unbounded)
    - KIL/HEC/DEK/KIN: digits 0..9
    - fffff: 0..99999 (fraction of day), computed by truncation (floor)

    Short (UI) string:
      "Δ K.H.D | cc" where cc are first 2 decimal digits (also truncated).
    """

    sign: str                 # 'T+' or 'T-'
    myria: int
    kilo: int
    hecto: int
    deka: int
    kin: int
    frac: int = 0             # 0..ATS_SCALE-1

    def __post_init__(self) -> None:
        if self.sign not in ("T+", "T-"):
            raise ValueError("sign must be 'T+' or 'T-'")
        if self.myria < 0:
            raise ValueError("myria must be >= 0")
        for name, v in (("kilo", self.kilo), ("hecto", self.hecto), ("deka", self.deka), ("kin", self.kin)):
            if not (0 <= v <= 9):
                raise ValueError(f"{name} must be a digit 0..9")
        if not (0 <= self.frac < ATS_SCALE):
            raise ValueError(f"frac must be in 0..{ATS_SCALE - 1}")

    # -------- formatting --------
    def to_canonical(self) -> str:
        return (
            f"{self.sign} {ATS_SYMBOL} "
            f"{self.myria}.{self.kilo}.{self.hecto}.{self.deka}.{self.kin}."
            f"{self.frac:0{ATS_DECIMALS}d}"
        )

    def to_short(self) -> str:
        # cc = first two fractional digits (truncated)
        cc = self.frac // (10 ** (ATS_DECIMALS - 2))
        return f"{ATS_SYMBOL} {self.kilo}.{self.hecto}.{self.deka} | {cc:02d}"

    def __str__(self) -> str:
        return self.to_canonical()

    # -------- numeric helpers --------
    @property
    def integer_days(self) -> int:
        return self.myria * 10_000 + self.kilo * 1_000 + self.hecto * 100 + self.deka * 10 + self.kin


# =========================
# INTERNAL: exact conversions
# =========================

_US_PER_DAY = 86_400_000_000


def _timedelta_to_decimal_days(td: timedelta) -> Decimal:
    total_us = td.days * _US_PER_DAY + td.seconds * 1_000_000 + td.microseconds
    return Decimal(total_us) / Decimal(_US_PER_DAY)


def _decimal_days_to_timedelta(days: Decimal) -> timedelta:
    # We keep microsecond resolution by truncating towards 0 after scaling.
    # For a monotonic counter, truncation is safer than rounding.
    total_us = int((days * Decimal(_US_PER_DAY)).to_integral_value(rounding=ROUND_FLOOR))
    return timedelta(microseconds=total_us)


def _split_abs_days_by_truncation(abs_days: Decimal) -> tuple[int, int]:
    """Return (integer_days, frac_int) with strict truncation."""
    integer_days = int(abs_days.to_integral_value(rounding=ROUND_FLOOR))
    frac = abs_days - Decimal(integer_days)
    frac_int = int((frac * Decimal(ATS_SCALE)).to_integral_value(rounding=ROUND_FLOOR))
    # No carry possible with floor.
    return integer_days, frac_int


def _integer_days_to_places(integer_days: int) -> tuple[int, int, int, int, int]:
    myria = integer_days // 10_000
    rem = integer_days % 10_000
    kilo = rem // 1_000
    rem %= 1_000
    hecto = rem // 100
    rem %= 100
    deka = rem // 10
    kin = rem % 10
    return myria, kilo, hecto, deka, kin


# =========================
# PUBLIC API
# =========================


def gregorian_to_ats(dt: datetime, *, assume_tz: str = "UTC") -> ATSDateTime:
    """Convert a Gregorian datetime to ATS.

    - If `dt` is naive, it is assumed to be in `assume_tz`.
    - Conversion is performed in UTC.
    - Fractional digits are produced by **truncation (floor)**.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo(assume_tz))

    dt_utc = dt.astimezone(timezone.utc)
    delta = dt_utc - ATS_EPOCH
    days = _timedelta_to_decimal_days(delta)

    sign = "T+" if days >= 0 else "T-"
    abs_days = -days if days < 0 else days

    integer_days, frac_int = _split_abs_days_by_truncation(abs_days)
    myria, kilo, hecto, deka, kin = _integer_days_to_places(integer_days)

    return ATSDateTime(sign=sign, myria=myria, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac_int)


_ATS_CANON_RE = re.compile(
    r"^\s*(T[+-])\s*Δ\s*(\d+)\.(\d)\.(\d)\.(\d)\.(\d)\.(\d{1,})\s*$"
)

_ATS_SHORT_RE = re.compile(
    r"^\s*Δ\s*(\d)\.(\d)\.(\d)\s*\|\s*(\d{1,2})\s*$"
)


def ats_to_gregorian(ats: str, *, out_tz: str = "UTC") -> datetime:
    """Convert ATS (canonical or short) to Gregorian datetime.

    Accepted formats:
      - Canonical: "T+ Δ 2.0.6.4.5.36806"
      - Short:     "Δ 0.6.4 | 36"  (interprets cc as first 2 day-fraction digits; remaining set to 0)

    Notes:
      - Canonical parsing supports any Myriade size.
      - Short parsing is intentionally lossy (UI-level).
    """

    m = _ATS_CANON_RE.match(ats)
    if m:
        sign, myria_s, kilo_s, hecto_s, deka_s, kin_s, frac_s = m.groups()
        myria = int(myria_s)
        kilo = int(kilo_s)
        hecto = int(hecto_s)
        deka = int(deka_s)
        kin = int(kin_s)

        # Normalize fractional digits: right-pad to 5, then truncate extra.
        frac_s = frac_s[:ATS_DECIMALS].ljust(ATS_DECIMALS, "0")
        frac = int(frac_s)

        ats_obj = ATSDateTime(sign=sign, myria=myria, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac)
        abs_days = Decimal(ats_obj.integer_days) + (Decimal(ats_obj.frac) / Decimal(ATS_SCALE))
        days = abs_days if sign == "T+" else -abs_days

        dt_utc = ATS_EPOCH + _decimal_days_to_timedelta(days)
        return dt_utc.astimezone(ZoneInfo(out_tz))

    m = _ATS_SHORT_RE.match(ats)
    if m:
        kilo_s, hecto_s, deka_s, cc_s = m.groups()
        kilo = int(kilo_s)
        hecto = int(hecto_s)
        deka = int(deka_s)
        cc = int(cc_s)
        if not (0 <= cc <= 99):
            raise ValueError("cc must be in 0..99")

        # Short form has no sign, no myria, no kin, and only 2 fractional digits.
        # We interpret it as T+ in the current Myriade context being unknown.
        # To make it deterministic, we decode it as within MYR=0 and KIN=0.
        # For real systems, you should always store canonical values.

        myria = 0
        kin = 0
        frac = cc * (10 ** (ATS_DECIMALS - 2))

        ats_obj = ATSDateTime(sign="T+", myria=myria, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac)
        abs_days = Decimal(ats_obj.integer_days) + (Decimal(ats_obj.frac) / Decimal(ATS_SCALE))

        dt_utc = ATS_EPOCH + _decimal_days_to_timedelta(abs_days)
        return dt_utc.astimezone(ZoneInfo(out_tz))

    raise ValueError(f"Invalid ATS format: {ats!r}")


# =========================
# CLI DEMO
# =========================

if __name__ == "__main__":
    now = datetime.now(timezone.utc)
    ats_now = gregorian_to_ats(now)

    print("Gregorian (UTC):", now.isoformat())
    print("ATS canonical :", ats_now.to_canonical())
    print("ATS short     :", ats_now.to_short())

    back = ats_to_gregorian(ats_now.to_canonical(), out_tz="UTC")
    print("Back (UTC)    :", back.isoformat())
