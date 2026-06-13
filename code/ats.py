"""
ATS — Apollonian Time System v0.6 reference implementation.

Spec: ../spec/manifesto.en.md
Epoch: 1969-07-20T00:00:00Z (start of the Apollo 11 landing day, UTC).
The landing itself (1969-07-20T20:17:40Z) is a notable instant within Δ 0,
located at Bloc 8 / Centi 4 / Deka 5 / Kin 6 (frac 0.84560185…).
This alignment makes Bloc 5 = 12:00 UTC exactly (5 × 2h24m).

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

Duration type Δd (v0.6+, spec §11.4):
  ATSDuration represents a signed amount of days as a Decimal, independent
  of any anchor. Use ``Δ - Δ → Δd`` for instant differences, ``Δ + Δd → Δ``
  to advance an instant, ``Δd ± Δd``, ``Δd * n``, ``Δd / n`` for plain
  duration algebra. Canonical form: ``T± Δd K.H.D.Kin.fffff`` (sign carried
  explicitly, K unbounded, frac floored to ATS_DECIMALS digits).

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
from decimal import ROUND_FLOOR, Decimal
from zoneinfo import ZoneInfo

ATS_SYMBOL = "Δ"
ATS_DECIMALS = 5
ATS_SCALE = 10 ** ATS_DECIMALS
ATS_EPOCH = datetime(1969, 7, 20, 0, 0, 0, tzinfo=timezone.utc)

_US_PER_DAY = 86_400_000_000


ATS_DURATION_SYMBOL = "Δd"


@dataclass(frozen=True, eq=False)
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

    def _signed_decimal_days(self) -> Decimal:
        """Total days as a signed Decimal (negative when sign == 'T-').

        T+ 0 and T- 0 collapse to the same Decimal(0), so equality across
        signs at the epoch behaves correctly.
        """
        d = self.total_days_decimal
        return -d if self.sign == "T-" else d

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

    # -- Arithmetic (spec §11.4) -----------------------------------------

    def __add__(self, other: object) -> ATSDateTime:
        if isinstance(other, ATSDuration):
            return _ats_from_signed_days(self._signed_decimal_days() + other.signed_days)
        return NotImplemented

    def __radd__(self, other: object) -> ATSDateTime:
        # Allows ATSDuration + ATSDateTime; the duration's __add__ returns
        # NotImplemented for the (Δd, Δ) case so Python falls back here.
        return self.__add__(other)

    def __sub__(self, other: object):
        if isinstance(other, ATSDateTime):
            return ATSDuration(self._signed_decimal_days() - other._signed_decimal_days())
        if isinstance(other, ATSDuration):
            return _ats_from_signed_days(self._signed_decimal_days() - other.signed_days)
        return NotImplemented

    def __eq__(self, other: object) -> bool:
        if isinstance(other, ATSDateTime):
            return self._signed_decimal_days() == other._signed_decimal_days()
        return NotImplemented

    def __lt__(self, other: object) -> bool:
        if isinstance(other, ATSDateTime):
            return self._signed_decimal_days() < other._signed_decimal_days()
        return NotImplemented

    def __le__(self, other: object) -> bool:
        if isinstance(other, ATSDateTime):
            return self._signed_decimal_days() <= other._signed_decimal_days()
        return NotImplemented

    def __gt__(self, other: object) -> bool:
        if isinstance(other, ATSDateTime):
            return self._signed_decimal_days() > other._signed_decimal_days()
        return NotImplemented

    def __ge__(self, other: object) -> bool:
        if isinstance(other, ATSDateTime):
            return self._signed_decimal_days() >= other._signed_decimal_days()
        return NotImplemented

    def __hash__(self) -> int:
        return hash(self._signed_decimal_days())


@dataclass(frozen=True, eq=False)
class ATSDuration:
    """ATS signed duration Δd, spec §11.4 (v0.6+).

    Stores the signed amount of days as an arbitrary-precision Decimal.
    Independent of any anchor — pure quantity. Display uses
    ``T± Δd K.H.D.Kin.fffff`` with the same floor-truncation policy as
    ATSDateTime (spec §6).
    """

    signed_days: Decimal = Decimal(0)

    def __post_init__(self) -> None:
        # Coerce to Decimal so callers may pass int / str / float without
        # surprises. frozen dataclasses require object.__setattr__ to mutate.
        if not isinstance(self.signed_days, Decimal):
            object.__setattr__(self, "signed_days", Decimal(self.signed_days))

    @classmethod
    def zero(cls) -> ATSDuration:
        return cls(Decimal(0))

    @property
    def sign(self) -> str:
        return "T-" if self.signed_days < 0 else "T+"

    @property
    def abs_days(self) -> Decimal:
        return -self.signed_days if self.signed_days < 0 else self.signed_days

    def to_canonical(self) -> str:
        integer_days, frac_int = _split_abs_days_floor(self.abs_days)
        kilo, hecto, deka, kin = _integer_days_to_places(integer_days)
        return (
            f"{self.sign} {ATS_DURATION_SYMBOL} "
            f"{kilo}.{hecto}.{deka}.{kin}."
            f"{frac_int:0{ATS_DECIMALS}d}"
        )

    def __str__(self) -> str:
        return self.to_canonical()

    def __add__(self, other: object) -> ATSDuration:
        if isinstance(other, ATSDuration):
            return ATSDuration(self.signed_days + other.signed_days)
        # Δd + Δ delegates to ATSDateTime.__radd__.
        return NotImplemented

    def __sub__(self, other: object) -> ATSDuration:
        if isinstance(other, ATSDuration):
            return ATSDuration(self.signed_days - other.signed_days)
        return NotImplemented

    def __mul__(self, n: object) -> ATSDuration:
        if isinstance(n, (int, Decimal)):
            return ATSDuration(self.signed_days * Decimal(n))
        return NotImplemented

    __rmul__ = __mul__

    def __truediv__(self, n: object) -> ATSDuration:
        if isinstance(n, (int, Decimal)):
            return ATSDuration(self.signed_days / Decimal(n))
        return NotImplemented

    def __neg__(self) -> ATSDuration:
        return ATSDuration(-self.signed_days)

    def __abs__(self) -> ATSDuration:
        return ATSDuration(self.abs_days)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, ATSDuration):
            return self.signed_days == other.signed_days
        return NotImplemented

    def __lt__(self, other: object) -> bool:
        if isinstance(other, ATSDuration):
            return self.signed_days < other.signed_days
        return NotImplemented

    def __le__(self, other: object) -> bool:
        if isinstance(other, ATSDuration):
            return self.signed_days <= other.signed_days
        return NotImplemented

    def __gt__(self, other: object) -> bool:
        if isinstance(other, ATSDuration):
            return self.signed_days > other.signed_days
        return NotImplemented

    def __ge__(self, other: object) -> bool:
        if isinstance(other, ATSDuration):
            return self.signed_days >= other.signed_days
        return NotImplemented

    def __hash__(self) -> int:
        return hash(self.signed_days)


def _ats_from_signed_days(d: Decimal) -> ATSDateTime:
    """Build an ATSDateTime from a signed Decimal day count.

    Floor truncation is applied to the absolute value (spec §6).
    """
    sign = "T-" if d < 0 else "T+"
    abs_d = -d if d < 0 else d
    integer_days, frac_int = _split_abs_days_floor(abs_d)
    kilo, hecto, deka, kin = _integer_days_to_places(integer_days)
    return ATSDateTime(
        sign=sign,
        kilo=kilo,
        hecto=hecto,
        deka=deka,
        kin=kin,
        frac=frac_int,
    )


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

    Accepts the canonical form: "T+ Δ 20.7.8.2.50000"

    The short form ("Δ 20.7.8.2/50") is only accepted when
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

    # v0.6: Δd arithmetic demo (spec §11.4)
    one_day = ATSDuration(Decimal(1))
    print("Δd one day     :", one_day.to_canonical())
    tomorrow = ats_now + one_day
    print("Δ tomorrow     :", tomorrow.to_canonical())
    delta = tomorrow - ats_now
    print("Δd round-trip  :", delta.to_canonical(), "(== 1 day:", delta == one_day, ")")
