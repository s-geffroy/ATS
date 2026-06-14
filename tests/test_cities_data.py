"""Schema + content checks for docs/assets/data/cities.json.

Catches regressions in the dataset that drives the Cities world-map page:
duplicate codes, invalid IANA timezones, out-of-range coordinates, or a
chronological inversion in a city's daily schedule (which would break the
state-machine that derives the "current activity" emoji per pin).
"""

import json
import unittest
import zoneinfo
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CITIES_PATH = REPO_ROOT / "docs" / "assets" / "data" / "cities.json"

# Activities in the natural daytime order. Some keys are optional per city
# (e.g. school_in if a city is treated as adults-only); they are skipped
# from the chronology check when missing.
CHRONOLOGICAL_ORDER = [
    "wake",
    "breakfast",
    "school_in",
    "work_in",
    "lunch",
    "school_out",
    "work_out",
    "dinner",
    "tv_movie",
]


def _hm_to_min(hhmm: str) -> int:
    h, m = hhmm.split(":")
    return int(h) * 60 + int(m)


class TestCitiesData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with CITIES_PATH.open(encoding="utf-8") as fh:
            cls.payload = json.load(fh)

    def test_unique_codes(self):
        codes = [c["code"] for c in self.payload["cities"]]
        self.assertEqual(len(codes), len(set(codes)), "duplicate city codes")

    def test_valid_iana_timezones(self):
        for city in self.payload["cities"]:
            with self.subTest(code=city["code"]):
                try:
                    zoneinfo.ZoneInfo(city["tz"])
                except zoneinfo.ZoneInfoNotFoundError as exc:
                    self.fail(f"{city['code']}: tz {city['tz']!r} not in IANA db ({exc})")

    def test_coordinates_in_range(self):
        for city in self.payload["cities"]:
            with self.subTest(code=city["code"]):
                self.assertIsInstance(city.get("lat"), (int, float))
                self.assertIsInstance(city.get("lon"), (int, float))
                self.assertGreaterEqual(city["lat"], -90)
                self.assertLessEqual(city["lat"], 90)
                self.assertGreaterEqual(city["lon"], -180)
                self.assertLessEqual(city["lon"], 180)

    def test_required_text_fields(self):
        for city in self.payload["cities"]:
            with self.subTest(code=city["code"]):
                for key in ("code", "name_en", "name_fr", "country", "region", "tz"):
                    self.assertTrue(city.get(key), f"missing {key}")

    def test_all_activity_times_are_hhmm(self):
        for city in self.payload["cities"]:
            for key, value in city["times"].items():
                with self.subTest(code=city["code"], key=key):
                    parts = value.split(":")
                    self.assertEqual(len(parts), 2, f"bad HH:MM: {value!r}")
                    h, m = (int(p) for p in parts)
                    self.assertTrue(0 <= h <= 23 and 0 <= m <= 59)

    def test_chronological_anchors(self):
        """`wake < lunch < dinner < tv_movie` — non-negotiable anchors.

        The school/work pair is allowed to interleave; only the four meal
        and bookend anchors must be strictly increasing within the day.
        """
        anchors = ("wake", "lunch", "dinner", "tv_movie")
        for city in self.payload["cities"]:
            times = city["times"]
            values = [_hm_to_min(times[k]) for k in anchors if k in times]
            with self.subTest(code=city["code"]):
                self.assertEqual(
                    values,
                    sorted(values),
                    f"{city['code']}: {anchors} should be strictly increasing "
                    f"but got {[times[k] for k in anchors if k in times]}",
                )

    def test_states_keys_referenced_by_machine(self):
        """The 10 state keys consumed by cities-page.js must all be present."""
        expected = {
            "sleep", "wake", "breakfast", "commute", "school",
            "work", "lunch", "evening", "dinner", "leisure",
        }
        present = {s["key"] for s in self.payload["states"]}
        self.assertEqual(present, expected)


if __name__ == "__main__":
    unittest.main()
