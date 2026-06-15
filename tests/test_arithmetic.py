"""Conformance test — Δ/Δd algebra (spec §11.4, v0.6+).

Drives the same JSON-defined vectors as the JS conformance suite. The
JSON format uses `{kind, canonical|signed_days|value}` shapes:

  ats:    {"kind": "ats",    "canonical": "T+ Δ 20.7.8.2.50000"}
  dur:    {"kind": "dur",    "signed_days": "1.5"}            (input)
  dur:    {"kind": "dur",    "canonical": "T+ Δd 0.0.0.1.50000"} (expected)
  scalar: {"kind": "scalar", "value": 2}
  bool:   {"kind": "bool",   "value": true}

Operations: add, sub, mul, div, lt, le, eq, gt, ge.

Run with:  python -m unittest tests.test_arithmetic
"""

from __future__ import annotations

import json
import re
import sys
import unittest
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "code"))

from ats import (  # noqa: E402
    ATS_DECIMALS,
    ATSDateTime,
    ATSDuration,
)

VECTORS_PATH = ROOT / "docs" / "spec" / "test-vectors-arithmetic.json"

_CANON_RE = re.compile(r"^\s*(T[+-])\s*Δ\s+(\d+)\.(\d)\.(\d)\.(\d)\.(\d+)\s*$")
_DUR_RE = re.compile(r"^\s*(T[+-])\s*Δd\s+(\d+)\.(\d)\.(\d)\.(\d)\.(\d+)\s*$")


def parse_canonical(s: str) -> ATSDateTime:
    m = _CANON_RE.match(s)
    if not m:
        raise ValueError(f"Bad canonical: {s!r}")
    sign, kilo, hecto, deka, kin, frac = m.groups()
    return ATSDateTime(
        sign=sign,
        kilo=int(kilo),
        hecto=int(hecto),
        deka=int(deka),
        kin=int(kin),
        frac=int(frac.ljust(ATS_DECIMALS, "0")[:ATS_DECIMALS]),
    )


def parse_duration_canonical(s: str) -> ATSDuration:
    m = _DUR_RE.match(s)
    if not m:
        raise ValueError(f"Bad Δd canonical: {s!r}")
    sign, kilo, hecto, deka, kin, frac = m.groups()
    integer_days = int(kilo) * 1000 + int(hecto) * 100 + int(deka) * 10 + int(kin)
    frac_padded = frac.ljust(ATS_DECIMALS, "0")[:ATS_DECIMALS]
    abs_days = Decimal(integer_days) + Decimal(int(frac_padded)) / Decimal(10**ATS_DECIMALS)
    return ATSDuration(-abs_days if sign == "T-" else abs_days)


def materialize(operand: dict):
    kind = operand["kind"]
    if kind == "ats":
        return parse_canonical(operand["canonical"])
    if kind == "dur":
        if "signed_days" in operand:
            return ATSDuration(Decimal(operand["signed_days"]))
        return parse_duration_canonical(operand["canonical"])
    if kind == "scalar":
        return operand["value"]
    if kind == "bool":
        return operand["value"]
    raise ValueError(f"Unknown operand kind: {kind}")


def expected_canonical(operand: dict) -> str:
    if operand["kind"] == "ats":
        return operand["canonical"]
    if operand["kind"] == "dur":
        if "canonical" in operand:
            return operand["canonical"]
        # signed_days expected — build the canonical via ATSDuration.
        return ATSDuration(Decimal(operand["signed_days"])).to_canonical()
    raise ValueError(f"No canonical for kind {operand['kind']!r}")


class TestArithmetic(unittest.TestCase):
    def setUp(self) -> None:
        with VECTORS_PATH.open(encoding="utf-8") as fh:
            self.vectors = json.load(fh)["vectors"]

    def _run_op(self, op: str, lhs, rhs):
        if op == "add":
            return lhs + rhs
        if op == "sub":
            return lhs - rhs
        if op == "mul":
            return lhs * rhs
        if op == "div":
            return lhs / rhs
        if op == "lt":
            return lhs < rhs
        if op == "le":
            return lhs <= rhs
        if op == "eq":
            return lhs == rhs
        if op == "gt":
            return lhs > rhs
        if op == "ge":
            return lhs >= rhs
        raise ValueError(f"Unknown op: {op}")

    def test_each_vector(self) -> None:
        for v in self.vectors:
            with self.subTest(label=v["label"]):
                lhs = materialize(v["lhs"])
                rhs = materialize(v["rhs"])
                expected = v["expected"]
                got = self._run_op(v["op"], lhs, rhs)
                if expected["kind"] == "bool":
                    self.assertEqual(got, expected["value"])
                else:
                    self.assertEqual(got.to_canonical(), expected_canonical(expected))

    def test_duration_neg_and_abs(self) -> None:
        d = ATSDuration(Decimal("1.5"))
        self.assertEqual((-d).signed_days, Decimal("-1.5"))
        self.assertEqual(abs(-d).signed_days, Decimal("1.5"))

    def test_comparison_equality_across_zero_signs(self) -> None:
        plus_zero = ATSDateTime(sign="T+", kilo=0, hecto=0, deka=0, kin=0, frac=0)
        minus_zero = ATSDateTime(sign="T-", kilo=0, hecto=0, deka=0, kin=0, frac=0)
        self.assertEqual(plus_zero, minus_zero)
        self.assertFalse(plus_zero < minus_zero)
        self.assertFalse(plus_zero > minus_zero)

    def test_duration_round_trip_within_resolution(self) -> None:
        d = ATSDuration(Decimal("123.45678"))
        canonical = d.to_canonical()
        # Re-parse and verify floor preserves up to ATS_DECIMALS digits.
        parsed = parse_duration_canonical(canonical)
        diff = abs(d.signed_days - parsed.signed_days)
        self.assertLess(diff, Decimal(1) / Decimal(10**ATS_DECIMALS))


if __name__ == "__main__":
    unittest.main()
