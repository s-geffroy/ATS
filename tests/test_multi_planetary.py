"""Conformance tests for the multi-planetary extension (annex v0.7).

Drives ``docs/spec/test-vectors-multi-planetary-{mars,moon}.json`` —
UTC ↔ Δ_<Body> round-trip — plus algebra invariants per body.

Run with:  python -m unittest tests.test_multi_planetary
"""

from __future__ import annotations

import json
import sys
import unittest
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "code"))

from ats import ATSDuration  # noqa: E402
from ats_multi_planetary import (  # noqa: E402
    EARTH,
    MARS,
    MOON,
    BodyATSDateTime,
    body_canonical_to_utc,
    utc_to_body,
    utc_to_earth,
    utc_to_mars,
    utc_to_moon,
)

SPEC_DIR = ROOT / "docs" / "spec"


def _load(path: str):
    with (SPEC_DIR / path).open(encoding="utf-8") as fh:
        return json.load(fh)


class TestMultiPlanetaryVectors(unittest.TestCase):
    def _check(self, payload: dict, body) -> None:
        for v in payload["vectors"]:
            with self.subTest(label=v["label"]):
                utc = datetime.fromisoformat(v["utc"].replace("Z", "+00:00"))
                ats = utc_to_body(utc, body)
                self.assertEqual(ats.to_canonical(), v["ats_canonical"])
                # Parse the canonical back and round-trip to UTC; the floor
                # truncation may drop sub-precision microseconds.
                round_utc = body_canonical_to_utc(v["ats_canonical"])
                drift_s = abs((utc - round_utc).total_seconds())
                # Worst-case drift = day_seconds / ATS_SCALE (1 / 1e5 day).
                max_drift = float(body.day_seconds) / 100_000
                self.assertLess(
                    drift_s,
                    max_drift + 1e-6,
                    f"round-trip drift {drift_s}s exceeds {max_drift}s",
                )

    def test_mars_vectors(self) -> None:
        self._check(_load("test-vectors-multi-planetary-mars.json"), MARS)

    def test_moon_vectors(self) -> None:
        self._check(_load("test-vectors-multi-planetary-moon.json"), MOON)

    def test_epoch_is_zero(self) -> None:
        self.assertEqual(utc_to_mars(MARS.epoch).to_canonical(), "T+ Δ_Mars 0.0.0.0.00000")
        self.assertEqual(utc_to_moon(MOON.epoch).to_canonical(), "T+ Δ_Moon 0.0.0.0.00000")
        self.assertEqual(utc_to_earth(EARTH.epoch).to_canonical(), "T+ Δ_Earth 0.0.0.0.00000")


class TestPerBodyAlgebra(unittest.TestCase):
    def test_add_duration(self) -> None:
        ref = datetime(2026, 6, 13, 12, 0, 0, tzinfo=timezone.utc)
        a = utc_to_mars(ref)
        one_sol = ATSDuration(Decimal(1))
        b = a + one_sol
        self.assertEqual(
            (b._signed_decimal_days() - a._signed_decimal_days()),
            Decimal(1),
        )

    def test_sub_two_instants_gives_duration(self) -> None:
        a = utc_to_mars(datetime(2021, 1, 1, tzinfo=timezone.utc))
        b = utc_to_mars(datetime(2022, 1, 1, tzinfo=timezone.utc))
        d = b - a
        self.assertIsInstance(d, ATSDuration)
        # 365 d × 86400 / 88775.244147 ≈ 355.234 sols (2021 is not leap).
        self.assertAlmostEqual(float(d.signed_days), 355.234, places=2)

    def test_cross_body_arithmetic_raises(self) -> None:
        mars = utc_to_mars(datetime(2020, 1, 1, tzinfo=timezone.utc))
        moon = utc_to_moon(datetime(2020, 1, 1, tzinfo=timezone.utc))
        with self.assertRaises(TypeError):
            _ = mars - moon  # type: ignore[operator]
        with self.assertRaises(TypeError):
            _ = mars < moon  # type: ignore[operator]

    def test_cross_body_equality_returns_false(self) -> None:
        mars = utc_to_mars(MARS.epoch)
        moon = utc_to_moon(MOON.epoch)
        # Both are 0.0.0.0.00000 within their own counter, but distinct bodies.
        self.assertFalse(mars == moon)


class TestThirdPartyBody(unittest.TestCase):
    def test_define_venus_ad_hoc(self) -> None:
        from ats_multi_planetary import Body

        venus = Body(
            suffix="_Venus",
            symbol="♀",
            epoch=datetime(1989, 8, 10, 3, 1, 0, tzinfo=timezone.utc),
            day_seconds=Decimal("10087200"),  # synodic day ≈ 116.75 Earth d
        )
        venus_dt = utc_to_body(datetime(2026, 6, 13, 12, 0, 0, tzinfo=timezone.utc), venus)
        self.assertTrue(venus_dt.to_canonical().startswith("T+ Δ_Venus "))


if __name__ == "__main__":
    unittest.main()
