"""ATS — Multi-planetary extension (v0.7, target v1.0).

Generalizes the Earth ATS counter (manifesto §1-15) to other celestial
bodies. Each ``Body`` is parameterized by an ``epoch`` UTC instant and
a ``day_seconds`` length; the same ``K.H.D.Kin.fffff`` grammar applies.

Spec: ../spec/multi-planetary.en.md (or .fr.md).

Per the multi-planetary annex, suffixes are mandatory for Mars and
Moon. Bare ``Δ`` continues to mean Earth ATS (v0.6 backward compat).

Two singletons ship:

  EARTH  — Δ_Earth, 1969-07-20T00:00:00Z, day = 86 400 s.
  MARS   — Δ_Mars,  1997-07-04T16:56:55Z, sol = 88 775.244 147 s.
  MOON   — Δ_Moon,  1969-07-20T00:00:00Z, synodic day = 2 551 442.8128 s.

Third-party bodies can be defined ad-hoc (Venus example shown in the
annex §6). The algebra §11.4 is preserved per body: Δ_X + Δd_X → Δ_X;
cross-body comparisons must round-trip through UTC first.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import ROUND_FLOOR, Decimal

from ats import (
    ATS_DECIMALS,
    ATS_SCALE,
    ATSDuration,
    _integer_days_to_places,
    _split_abs_days_floor,
    _US_PER_DAY,
)

# -- Body registry -------------------------------------------------------

_US_PER_SECOND = 1_000_000


@dataclass(frozen=True)
class Body:
    """A celestial body's ATS parameters.

    suffix:        ASCII suffix for canonical notation ("_Earth", "_Mars"…).
                   Empty string for the historic bare-Δ Earth form.
    symbol:        Single Unicode astronomical symbol for display (`⊕`, `♂`, `☾`).
                   May be empty.
    epoch:         UTC instant of the counter origin.
    day_seconds:   Decimal positive — length of a local day in SI seconds.
    """

    suffix: str
    symbol: str
    epoch: datetime
    day_seconds: Decimal

    def __post_init__(self) -> None:
        if not isinstance(self.day_seconds, Decimal):
            object.__setattr__(self, "day_seconds", Decimal(str(self.day_seconds)))
        if self.day_seconds <= 0:
            raise ValueError("day_seconds must be positive")
        if self.epoch.tzinfo is None:
            raise ValueError("epoch must be timezone-aware (UTC recommended)")

    @property
    def display_symbol(self) -> str:
        return f"Δ{self.symbol}" if self.symbol else "Δ"

    @property
    def ascii_symbol(self) -> str:
        return f"Δ{self.suffix}" if self.suffix else "Δ"


EARTH = Body(
    suffix="_Earth",
    symbol="⊕",
    epoch=datetime(1969, 7, 20, 0, 0, 0, tzinfo=timezone.utc),
    day_seconds=Decimal("86400"),
)

MARS = Body(
    suffix="_Mars",
    symbol="♂",
    epoch=datetime(1997, 7, 4, 16, 56, 55, tzinfo=timezone.utc),
    day_seconds=Decimal("88775.244147"),
)

MOON = Body(
    suffix="_Moon",
    symbol="☾",
    epoch=datetime(1969, 7, 20, 0, 0, 0, tzinfo=timezone.utc),
    day_seconds=Decimal("2551442.8128"),
)


# -- ATS instant + duration typed per body -------------------------------


@dataclass(frozen=True, eq=False)
class BodyATSDateTime:
    """ATS instant typed by celestial body.

    The same positional grammar K.H.D.Kin.fffff as ATSDateTime (manifesto §4).
    Distinct from ATSDateTime to make cross-body confusion a static error.
    """

    body: Body
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
        for name, v in (("hecto", self.hecto), ("deka", self.deka), ("kin", self.kin)):
            if not 0 <= v <= 9:
                raise ValueError(f"{name} must be a digit 0..9")
        if not 0 <= self.frac < ATS_SCALE:
            raise ValueError(f"frac must be in 0..{ATS_SCALE - 1}")

    @property
    def integer_days(self) -> int:
        return self.kilo * 1000 + self.hecto * 100 + self.deka * 10 + self.kin

    @property
    def total_days_decimal(self) -> Decimal:
        return Decimal(self.integer_days) + Decimal(self.frac) / Decimal(ATS_SCALE)

    def _signed_decimal_days(self) -> Decimal:
        d = self.total_days_decimal
        return -d if self.sign == "T-" else d

    def to_canonical(self) -> str:
        return (
            f"{self.sign} {self.body.ascii_symbol} "
            f"{self.kilo}.{self.hecto}.{self.deka}.{self.kin}."
            f"{self.frac:0{ATS_DECIMALS}d}"
        )

    def to_short(self) -> str:
        bc = self.frac // (10 ** (ATS_DECIMALS - 2))           # Bloc·Centi
        m = (self.frac // (10 ** (ATS_DECIMALS - 3))) % 10     # Milli
        return f"{self.body.ascii_symbol}{self.kilo}.{self.hecto}.{self.deka}.{self.kin}-{bc:02d}.{m}"

    def to_utc(self) -> datetime:
        """Project this body-anchored instant back onto UTC."""
        signed_days = self._signed_decimal_days()
        signed_seconds = signed_days * self.body.day_seconds
        signed_us = (signed_seconds * Decimal(_US_PER_SECOND)).to_integral_value(
            rounding=ROUND_FLOOR
        )
        return self.body.epoch + timedelta(microseconds=int(signed_us))

    def __str__(self) -> str:
        return self.to_canonical()

    def __add__(self, other: object) -> BodyATSDateTime:
        if isinstance(other, ATSDuration):
            # Δ_X + Δd_X → Δ_X. Cross-body arithmetic raises explicitly.
            new_signed = self._signed_decimal_days() + other.signed_days
            return _from_signed_days(self.body, new_signed)
        if isinstance(other, BodyATSDateTime):
            raise TypeError("Cannot add two instants; subtract them to get Δd.")
        return NotImplemented

    def __sub__(self, other: object):
        if isinstance(other, BodyATSDateTime):
            if other.body is not self.body and other.body != self.body:
                raise TypeError(
                    "Cross-body subtraction is undefined. "
                    "Convert both instants to UTC first via .to_utc()."
                )
            return ATSDuration(self._signed_decimal_days() - other._signed_decimal_days())
        if isinstance(other, ATSDuration):
            return _from_signed_days(
                self.body, self._signed_decimal_days() - other.signed_days
            )
        return NotImplemented

    def __eq__(self, other: object) -> bool:
        if isinstance(other, BodyATSDateTime):
            if other.body is not self.body and other.body != self.body:
                return False
            return self._signed_decimal_days() == other._signed_decimal_days()
        return NotImplemented

    def __lt__(self, other: object) -> bool:
        if isinstance(other, BodyATSDateTime):
            if other.body is not self.body and other.body != self.body:
                raise TypeError(
                    "Cross-body comparison is undefined. "
                    "Convert to UTC first."
                )
            return self._signed_decimal_days() < other._signed_decimal_days()
        return NotImplemented

    def __le__(self, other: object) -> bool:
        if self == other:
            return True
        return self < other  # type: ignore[operator]

    def __hash__(self) -> int:
        return hash((id(self.body), self._signed_decimal_days()))


def _from_signed_days(body: Body, signed_days: Decimal) -> BodyATSDateTime:
    sign = "T-" if signed_days < 0 else "T+"
    abs_days = -signed_days if signed_days < 0 else signed_days
    integer_days, frac_int = _split_abs_days_floor(abs_days)
    kilo, hecto, deka, kin = _integer_days_to_places(integer_days)
    return BodyATSDateTime(
        body=body,
        sign=sign,
        kilo=kilo,
        hecto=hecto,
        deka=deka,
        kin=kin,
        frac=frac_int,
    )


# -- Conversion API ------------------------------------------------------


def utc_to_body(utc: datetime, body: Body) -> BodyATSDateTime:
    """Convert a UTC instant to ``body``'s ATS counter."""
    if utc.tzinfo is None:
        raise ValueError("utc must be timezone-aware")
    delta = utc - body.epoch
    total_us = delta.days * _US_PER_DAY + delta.seconds * _US_PER_SECOND + delta.microseconds
    signed_seconds = Decimal(total_us) / Decimal(_US_PER_SECOND)
    signed_days = signed_seconds / body.day_seconds
    return _from_signed_days(body, signed_days)


_CANON_RE = re.compile(
    r"^\s*(T[+-])\s*Δ(_?[A-Za-z]+)?\s+(\d+)\.(\d)\.(\d)\.(\d)\.(\d+)\s*$"
)


def body_canonical_to_utc(canonical: str, body_registry: dict | None = None) -> datetime:
    """Parse a canonical multi-planetary ATS string and return UTC."""
    m = _CANON_RE.match(canonical)
    if not m:
        raise ValueError(f"Invalid canonical: {canonical!r}")
    sign, suffix_raw, kilo, hecto, deka, kin, frac = m.groups()
    suffix = (suffix_raw or "").rstrip()
    body = _resolve_body(suffix, body_registry)
    frac_padded = frac[:ATS_DECIMALS].ljust(ATS_DECIMALS, "0")
    instant = BodyATSDateTime(
        body=body,
        sign=sign,
        kilo=int(kilo),
        hecto=int(hecto),
        deka=int(deka),
        kin=int(kin),
        frac=int(frac_padded),
    )
    return instant.to_utc()


_DEFAULT_REGISTRY = {"": EARTH, "_Earth": EARTH, "_Mars": MARS, "_Moon": MOON}


def _resolve_body(suffix: str, registry: dict | None) -> Body:
    table = registry if registry is not None else _DEFAULT_REGISTRY
    if suffix in table:
        return table[suffix]
    # Allow bare body name without underscore (e.g. "Mars")
    if suffix and not suffix.startswith("_") and ("_" + suffix) in table:
        return table["_" + suffix]
    raise ValueError(f"Unknown body suffix: {suffix!r}")


# -- Convenience shorthands ----------------------------------------------


def utc_to_mars(utc: datetime) -> BodyATSDateTime:
    return utc_to_body(utc, MARS)


def utc_to_moon(utc: datetime) -> BodyATSDateTime:
    return utc_to_body(utc, MOON)


def utc_to_earth(utc: datetime) -> BodyATSDateTime:
    return utc_to_body(utc, EARTH)


if __name__ == "__main__":
    ref = datetime(2026, 6, 13, 12, 0, 0, tzinfo=timezone.utc)
    print("Reference UTC :", ref.isoformat())
    print("  Δ_Earth     :", utc_to_earth(ref).to_canonical())
    print("  Δ_Mars      :", utc_to_mars(ref).to_canonical())
    print("  Δ_Moon      :", utc_to_moon(ref).to_canonical())
    print()
    print("Mars epoch    :", MARS.epoch.isoformat())
    print("  ↔ UTC roundtrip:", utc_to_mars(MARS.epoch).to_canonical())
    print("Moon epoch    :", MOON.epoch.isoformat())
    print("  ↔ UTC roundtrip:", utc_to_moon(MOON.epoch).to_canonical())
