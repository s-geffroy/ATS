from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_FLOOR, ROUND_HALF_UP
from zoneinfo import ZoneInfo


# === ATS Configuration ===
ATS_SYMBOL = "Δ"
ATS_DECIMALS = 5  # .[D-DAY][CEN][MIL][BEA][BLK] => 5 digits
ATS_SCALE = 10 ** ATS_DECIMALS

# ATS epoch = first step on the Moon (UTC)
ATS_EPOCH = datetime(1969, 7, 21, 2, 56, 15, tzinfo=timezone.utc)


@dataclass(frozen=True, slots=True)
class ATSDateTime:
    """
    ATS representation:
      sign: "T+" or "T-"
      myria: int (can be >= 0, not limited to 0-9)
      kilo/hecto/deka/kin: digits 0..9
      frac: 0..99999 (5 digits by default)
    
    Canonical string: "T+ Δ {myria}.{kilo}.{hecto}.{deka}.{kin}.{frac:05d}"
    Short string: "Δ {kilo}.{hecto}.{deka} | {cc:02d}"
    """
    sign: str
    myria: int
    kilo: int
    hecto: int
    deka: int
    kin: int
    frac: int = 0

    def __post_init__(self) -> None:
        if self.sign not in ("T+", "T-"):
            raise ValueError("sign must be 'T+' or 'T-'")
        if self.myria < 0:
            raise ValueError("myria must be >= 0")
        for name, v in (("kilo", self.kilo), ("hecto", self.hecto), ("deka", self.deka), ("kin", self.kin)):
            if not (0 <= v <= 9):
                raise ValueError(f"{name} must be a digit 0..9")
        if not (0 <= self.frac < ATS_SCALE):
            raise ValueError(f"frac must be in 0..{ATS_SCALE-1}")

    def to_canonical(self) -> str:
        """Standard full format."""
        return (
            f"{self.sign} {ATS_SYMBOL} "
            f"{self.myria}.{self.kilo}.{self.hecto}.{self.deka}.{self.kin}."
            f"{self.frac:0{ATS_DECIMALS}d}"
        )

    def to_short(self) -> str:
        """Conversational format (UI).
        Δ K.H.D | cc
        cc = first 2 digits of fraction (truncated)
        """
        cc = self.frac // (10 ** (ATS_DECIMALS - 2))
        return f"{ATS_SYMBOL} {self.kilo}.{self.hecto}.{self.deka} | {cc:02d}"

    def __str__(self) -> str:
        return self.to_canonical()

    @property
    def total_days_decimal(self) -> Decimal:
        """
        Absolute day offset as Decimal, without sign:
          days = integer_part + frac / ATS_SCALE
        """
        integer_days = (
            self.myria * 10_000
            + self.kilo * 1_000
            + self.hecto * 100
            + self.deka * 10
            + self.kin
        )
        return Decimal(integer_days) + (Decimal(self.frac) / Decimal(ATS_SCALE))


# -----------------------------
# Helpers: timedelta <-> Decimal days
# -----------------------------
def _timedelta_to_decimal_days(td: timedelta) -> Decimal:
    total_us = (
        td.days * 86_400_000_000
        + td.seconds * 1_000_000
        + td.microseconds
    )
    return Decimal(total_us) / Decimal(86_400_000_000)


def _decimal_days_to_timedelta(days: Decimal) -> timedelta:
    # Use floor truncation for monotonic consistency (as per ATS spec)
    # 86,400,000,000 microseconds per day
    total_us = (days * Decimal(86_400_000_000)).to_integral_value(rounding=ROUND_FLOOR)
    return timedelta(microseconds=int(total_us))


def _split_abs_days_strict_floor(abs_days: Decimal) -> tuple[int, int]:
    """
    Returns (integer_days, frac_int) using strict truncation (floor).
    """
    integer_days = int(abs_days.to_integral_value(rounding=ROUND_FLOOR))
    frac = abs_days - Decimal(integer_days)
    
    # Floor the fractional part scaled to ATS_SCALE
    frac_int = int((frac * Decimal(ATS_SCALE)).to_integral_value(rounding=ROUND_FLOOR))
    
    return integer_days, frac_int


def _integer_days_to_macro(integer_days: int) -> tuple[int, int, int, int, int]:
    myria = integer_days // 10_000
    rem = integer_days % 10_000
    kilo = rem // 1_000
    rem %= 1_000
    hecto = rem // 100
    rem %= 100
    deka = rem // 10
    kin = rem % 10
    return myria, kilo, hecto, deka, kin


# -----------------------------
# Public API
# -----------------------------
def gregorian_to_ats(dt: datetime, *, assume_tz: str = "UTC") -> ATSDateTime:
    """
    Convert a Gregorian datetime to ATS.
    Uses strict truncation (floor) for decimals.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo(assume_tz))
    dt_utc = dt.astimezone(timezone.utc)

    delta = dt_utc - ATS_EPOCH
    days = _timedelta_to_decimal_days(delta)

    sign = "T+" if days >= 0 else "T-"
    abs_days = -days if days < 0 else days

    integer_days, frac_int = _split_abs_days_strict_floor(abs_days)
    myria, kilo, hecto, deka, kin = _integer_days_to_macro(integer_days)

    return ATSDateTime(
        sign=sign,
        myria=myria,
        kilo=kilo,
        hecto=hecto,
        deka=deka,
        kin=kin,
        frac=frac_int,
    )


# Regex for Canonical Format: T+ Δ 2.0.6.4.5.36806
_ATS_CANON_RE = re.compile(
    r"^\s*(T[+-])\s*Δ\s*(\d+)\.(\d)\.(\d)\.(\d)\.(\d)\.(\d{1,})\s*$"
)

# Regex for Short Format: Δ 0.6.4 | 36
_ATS_SHORT_RE = re.compile(
    r"^\s*Δ\s*(\d)\.(\d)\.(\d)\s*\|\s*(\d{1,2})\s*$"
)


def ats_to_gregorian(ats: str, *, out_tz: str = "UTC") -> datetime:
    """
    Convert ATS string (Canonical or Short) to Gregorian datetime.
    """
    # 1. Try Canonical
    m = _ATS_CANON_RE.match(ats)
    if m:
        sign, myria_s, kilo_s, hecto_s, deka_s, kin_s, frac_s = m.groups()
        myria = int(myria_s)
        kilo = int(kilo_s)
        hecto = int(hecto_s)
        deka = int(deka_s)
        kin = int(kin_s)

        # Normalize fractional digits (truncate to 5 or pad)
        if len(frac_s) > ATS_DECIMALS:
             frac_s = frac_s[:ATS_DECIMALS]
        frac = int(frac_s.ljust(ATS_DECIMALS, "0"))

        ats_obj = ATSDateTime(sign=sign, myria=myria, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac)
        abs_days = ats_obj.total_days_decimal
        days = abs_days if sign == "T+" else -abs_days

        dt_utc = ATS_EPOCH + _decimal_days_to_timedelta(days)
        return dt_utc.astimezone(ZoneInfo(out_tz))

    # 2. Try Short
    m = _ATS_SHORT_RE.match(ats)
    if m:
        kilo_s, hecto_s, deka_s, cc_s = m.groups()
        kilo = int(kilo_s)
        hecto = int(hecto_s)
        deka = int(deka_s)
        cc = int(cc_s)

        if not (0 <= cc <= 99):
            raise ValueError("cc must be in 0..99")

        # Assume T+ and Myria=0/Kin=0 if ambiguous, or context-free decoding
        # Short format is lossy. We reconstruct the beginning of that block.
        myria = 0
        kin = 0
        frac = cc * (10 ** (ATS_DECIMALS - 2))

        ats_obj = ATSDateTime(sign="T+", myria=myria, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac)
        abs_days = ats_obj.total_days_decimal

        dt_utc = ATS_EPOCH + _decimal_days_to_timedelta(abs_days)
        return dt_utc.astimezone(ZoneInfo(out_tz))

    raise ValueError(f"Invalid ATS format: {ats!r}")


# -----------------------------
# Quick demo
# -----------------------------
if __name__ == "__main__":
    now_utc = datetime.now(timezone.utc)
    ats_now = gregorian_to_ats(now_utc)
    
    print("Gregorian (UTC):", now_utc.isoformat())
    print("ATS Canonical  :", ats_now.to_canonical())
    print("ATS Short      :", ats_now.to_short())
    
    # Round-trip verification
    back = ats_to_gregorian(ats_now.to_canonical(), out_tz="UTC")
    print("Back (UTC)     :", back.isoformat())
