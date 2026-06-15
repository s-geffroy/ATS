"""Conformance test — Python implementation against docs/spec/test-vectors.json.

Run with:  python -m unittest tests.test_vectors
"""

from __future__ import annotations

import json
import sys
import unittest
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "code"))

from ats import ATSDateTime, ats_to_gregorian, gregorian_to_ats  # noqa: E402

VECTORS_PATH = ROOT / "docs" / "spec" / "test-vectors.json"


def _load_vectors() -> list[dict]:
    with VECTORS_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)["vectors"]


class TestVectors(unittest.TestCase):
    def test_each_vector_matches_canonical(self) -> None:
        for v in _load_vectors():
            with self.subTest(label=v["label"]):
                dt = datetime.fromisoformat(v["utc"].replace("Z", "+00:00"))
                ats = gregorian_to_ats(dt)
                self.assertEqual(ats.to_canonical(), v["canonical"])
                self.assertEqual(ats.to_short(), v["display"])
                self.assertEqual(ats.sign, v["sign"])
                self.assertEqual(ats.kilo, v["kilo"])
                self.assertEqual(ats.hecto, v["hecto"])
                self.assertEqual(ats.deka, v["deka"])
                self.assertEqual(ats.kin, v["kin"])
                self.assertEqual(ats.frac, v["frac"])

    def test_round_trip_within_resolution(self) -> None:
        """Floor truncation always brings the encoded value closer to the epoch.

        For T+ vectors: 0 <= drift < 864 ms  (decoded <= original)
        For T- vectors: -864 ms < drift <= 0 (decoded >= original, i.e. closer to epoch)
        Magnitude of drift is bounded by the 5-digit resolution (1/100000 day ≈ 864 ms).
        """
        for v in _load_vectors():
            with self.subTest(label=v["label"]):
                dt = datetime.fromisoformat(v["utc"].replace("Z", "+00:00"))
                back = ats_to_gregorian(v["canonical"])
                drift_ms = (dt - back).total_seconds() * 1000
                self.assertLess(abs(drift_ms), 864, "drift > 5-digit resolution")
                if v["sign"] == "T+":
                    self.assertGreaterEqual(drift_ms, 0, "T+ floor must never anticipate")
                else:
                    self.assertLessEqual(drift_ms, 0, "T- floor must stay closer to epoch")


class TestShortFormat(unittest.TestCase):
    """Cover the v0.7 short form: ΔK.H.D.Kin-BC.M (no space, dash, .Milli)."""

    def test_milli_zero_still_emitted(self) -> None:
        # frac = 50_000 → Bloc 5, Centi 0, Milli 0 → "-50.0"
        a = ATSDateTime(sign="T+", kilo=0, hecto=0, deka=0, kin=0, frac=50_000)
        self.assertEqual(a.to_short(), "Δ0.0.0.0-50.0")

    def test_milli_digit_carried(self) -> None:
        # frac = 70_500 → Bloc 7, Centi 0, Milli 5 → "-70.5"
        a = ATSDateTime(sign="T+", kilo=20, hecto=7, deka=8, kin=2, frac=70_500)
        self.assertEqual(a.to_short(), "Δ20.7.8.2-70.5")

    def test_round_trip_within_milli_resolution(self) -> None:
        # Milli unit = 0.001 day ≈ 86.4 s. Round-trip drift must be < 90 s.
        from datetime import datetime, timezone

        moments = [
            datetime(2026, 6, 13, 12, 0, 0, tzinfo=timezone.utc),
            datetime(1969, 7, 20, 20, 17, 40, tzinfo=timezone.utc),
            datetime(2000, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
        ]
        for dt in moments:
            with self.subTest(dt=dt.isoformat()):
                a = gregorian_to_ats(dt)
                short = a.to_short()
                back = ats_to_gregorian(short, allow_short=True)
                drift = abs((dt - back).total_seconds())
                self.assertLess(drift, 90.0)

    def test_rejects_legacy_slash_form(self) -> None:
        with self.assertRaises(ValueError):
            ats_to_gregorian("Δ 20.7.8.2/50", allow_short=True)

    def test_rejects_space_after_symbol(self) -> None:
        with self.assertRaises(ValueError):
            ats_to_gregorian("Δ 20.7.8.2-50.0", allow_short=True)


if __name__ == "__main__":
    unittest.main()
