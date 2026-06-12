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

from ats import ats_to_gregorian, gregorian_to_ats  # noqa: E402

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
                self.assertEqual(ats.to_short(), v["short"])
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


if __name__ == "__main__":
    unittest.main()
