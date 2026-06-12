"""
ATS — Apollonian Time System v1.1 reference implementation.

Spec: ../spec/manifesto.en.md
Epoch: 1969-07-20T20:17:40Z (Apollo 11 lunar module touchdown).

Canonical format: "T+ Δ K.H.D.Kin.fffff"
  - K (Kilo) is an unbounded non-negative integer.
  - H, D, Kin are digits 0..9 (Hecto, Deka, Kin).
  - fffff is 5 fractional digits (default precision; variable).

Short format (UI): "Δ K.H.D.Kin/cc"
  - K, H, D, Kin are Kilo (unbounded), Hecto, Deka, Kin.
  - Kin is always shown (even when zero) to keep the calendar reference
    unambiguous. No spaces around `/`.
  - cc is two fractional digits (Bloc + Centi).
  - Decoding the short form is intentionally lossy: lower fractional
    digits (Milli/Beat/Blink) assumed 0; sign assumed T+. Parsers accept
    optional whitespace around `/`.

Rounding policy (spec §6): strict floor truncation (ROUND_FLOOR) is used
when reducing precision for display. ATS is a counter of completed
units; a digit is shown only once its unit has fully elapsed. The
internal Decimal counter is always exact.

Leap second policy (spec §8): aligned to POSIX — a day is 86 400 seconds.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_FLOOR
from zoneinfo import ZoneInfo

ATS_SYMBOL = "Δ"
ATS_DECIMALS = 5
ATS_SCALE = 10 ** ATS_DECIMALS
ATS_EPOCH = datetime(1969, 7, 20, 20, 17, 40, tzinfo=timezone.utc)

_US_PER_DAY = 86_400_000_000


@dataclass(frozen=True)
class ATSDateTime:
    """ATS instant.

    sign:  "T+" or "T-"
    kilo:  unbounded non-negative integer
    hecto, deka, kin: digits 0..9
    frac:  0..ATS_SCALE-1 (5 default digits of day-fraction)
    """

    sign: str
    kilo: int
    hecto: int
    deka: int
    kin: int
    frac: int = 0

    def __post_init__(self) -> None:
        if self.sign not in ("T+", "T-"):
            raise ValueError("sign must be 'T+' or 'T-'")
        if self.kilo < 0:
            raise ValueError("kilo must be >= 0")
        for name, value in (("hecto", self.hecto), ("deka", self.deka), ("kin", self.kin)):
            if not 0 <= value <= 9:
                raise ValueError(f"{name} must be a digit 0..9")
        if not 0 <= self.frac < ATS_SCALE:
            raise ValueError(f"frac must be in 0..{ATS_SCALE - 1}")

    @property
    def integer_days(self) -> int:
        return self.kilo * 1_000 + self.hecto * 100 + self.deka * 10 + self.kin

    @property
    def total_days_decimal(self) -> Decimal:
        return Decimal(self.integer_days) + Decimal(self.frac) / Decimal(ATS_SCALE)

    def to_canonical(self) -> str:
        return (
            f"{self.sign} {ATS_SYMBOL} "
            f"{self.kilo}.{self.hecto}.{self.deka}.{self.kin}."
            f"{self.frac:0{ATS_DECIMALS}d}"
        )

    def to_short(self) -> str:
        """Conversational form: Δ K.H.D.Kin/cc

        Drops the sign and the lower fractional digits (Milli/Beat/Blink).
        Kin is always shown — even when zero — to keep the calendar
        reference unambiguous. No spaces around `/`.
        """
        cc = self.frac // (10 ** (ATS_DECIMALS - 2))
        return f"{ATS_SYMBOL} {self.kilo}.{self.hecto}.{self.deka}.{self.kin}/{cc:02d}"

    def __str__(self) -> str:
        return self.to_canonical()


def _timedelta_to_decimal_days(td: timedelta) -> Decimal:
    total_us = td.days * _US_PER_DAY + td.seconds * 1_000_000 + td.microseconds
    return Decimal(total_us) / Decimal(_US_PER_DAY)


def _decimal_days_to_timedelta(days: Decimal) -> timedelta:
    total_us = (days * Decimal(_US_PER_DAY)).to_integral_value(rounding=ROUND_FLOOR)
    return timedelta(microseconds=int(total_us))


def _split_abs_days_floor(abs_days: Decimal) -> tuple[int, int]:
    """Split a non-negative day count into (integer_days, frac_digits).

    Uses strict floor truncation. A digit is published only after its
    unit has fully elapsed (no anticipation, no carry into a future day).
    """
    integer_days = int(abs_days.to_integral_value(rounding=ROUND_FLOOR))
    frac = abs_days - Decimal(integer_days)
    frac_int = int((frac * Decimal(ATS_SCALE)).to_integral_value(rounding=ROUND_FLOOR))
    return integer_days, frac_int


def _integer_days_to_places(integer_days: int) -> tuple[int, int, int, int]:
    kilo, rem = divmod(integer_days, 1_000)
    hecto, rem = divmod(rem, 100)
    deka, kin = divmod(rem, 10)
    return kilo, hecto, deka, kin


def gregorian_to_ats(dt: datetime, *, assume_tz: str = "UTC") -> ATSDateTime:
    """Convert a Gregorian datetime to ATS.

    Naive datetimes are interpreted in `assume_tz` (default UTC).
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo(assume_tz))
    dt_utc = dt.astimezone(timezone.utc)

    delta = dt_utc - ATS_EPOCH
    days = _timedelta_to_decimal_days(delta)

    sign = "T+" if days >= 0 else "T-"
    abs_days = -days if days < 0 else days

    integer_days, frac_int = _split_abs_days_floor(abs_days)
    kilo, hecto, deka, kin = _integer_days_to_places(integer_days)

    return ATSDateTime(sign=sign, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac_int)


_ATS_CANON_RE = re.compile(
    r"^\s*(T[+-])\s*Δ\s*(\d+)\.(\d)\.(\d)\.(\d)\.(\d{1,})\s*$"
)

_ATS_SHORT_RE = re.compile(
    r"^\s*Δ\s*(\d+)\.(\d)\.(\d)\.(\d)\s*/\s*(\d{1,2})\s*$"
)


def ats_to_gregorian(ats: str, *, out_tz: str = "UTC", allow_short: bool = False) -> datetime:
    """Convert an ATS string back to a Gregorian datetime.

    Accepts the canonical form: "T+ Δ 20.7.5.6.43210"

    The short form ("Δ 20.7.5.0/43") is only accepted when
    ``allow_short=True``, because it is intentionally lossy
    (lower fractional digits zero-padded, sign assumed T+).
    Whitespace around the `/` is tolerated on input.
    """
    m = _ATS_CANON_RE.match(ats)
    if m:
        sign, kilo_s, hecto_s, deka_s, kin_s, frac_s = m.groups()
        frac_s = frac_s[:ATS_DECIMALS].ljust(ATS_DECIMALS, "0")
        ats_obj = ATSDateTime(
            sign=sign,
            kilo=int(kilo_s),
            hecto=int(hecto_s),
            deka=int(deka_s),
            kin=int(kin_s),
            frac=int(frac_s),
        )
        abs_days = ats_obj.total_days_decimal
        days = abs_days if sign == "T+" else -abs_days
        return (ATS_EPOCH + _decimal_days_to_timedelta(days)).astimezone(ZoneInfo(out_tz))

    m = _ATS_SHORT_RE.match(ats)
    if m:
        if not allow_short:
            raise ValueError(
                "Refusing to decode short ATS form without explicit opt-in "
                "(pass allow_short=True). Short form is lossy: lower "
                "fractional digits zero-padded, sign assumed T+."
            )
        kilo_s, hecto_s, deka_s, kin_s, cc_s = m.groups()
        cc = int(cc_s)
        if not 0 <= cc <= 99:
            raise ValueError("cc must be in 0..99")
        frac = cc * (10 ** (ATS_DECIMALS - 2))
        ats_obj = ATSDateTime(
            sign="T+",
            kilo=int(kilo_s),
            hecto=int(hecto_s),
            deka=int(deka_s),
            kin=int(kin_s),
            frac=frac,
        )
        abs_days = ats_obj.total_days_decimal
        return (ATS_EPOCH + _decimal_days_to_timedelta(abs_days)).astimezone(ZoneInfo(out_tz))

    raise ValueError(f"Invalid ATS format: {ats!r}")


if __name__ == "__main__":
    now_utc = datetime.now(timezone.utc)
    ats_now = gregorian_to_ats(now_utc)
    print("Gregorian (UTC):", now_utc.isoformat())
    print("ATS canonical :", ats_now.to_canonical())
    print("ATS short     :", ats_now.to_short())

    back = ats_to_gregorian(ats_now.to_canonical(), out_tz="UTC")
    print("Round-trip UTC:", back.isoformat())
    print("Drift (us)    :", abs((now_utc - back).total_seconds()) * 1e6)
