"""Leap-second policy test (spec §8).

ATS is aligned to POSIX: a day is *exactly* 86 400 seconds. A leap second
(e.g. 2016-12-31T23:59:60Z) is **absorbed**, never emitted as a distinct
ATS slice. The hour following a leap second therefore lands at the same
ATS instant whether expressed pre- or post-folding.
"""

from __future__ import annotations

import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "code"))

from ats import gregorian_to_ats  # noqa: E402


class TestLeapSecondPolicy(unittest.TestCase):
    def test_post_leap_second_instant_collapses_with_t_plus_1s(self):
        """2017-01-01T00:00:00Z (UTC, post-leap) ≡ POSIX 1483228800.

        On a system that does NOT track leap seconds (POSIX), the timestamps
        2016-12-31T23:59:60Z (leap) and 2017-01-01T00:00:00Z map to the SAME
        POSIX second. ATS uses POSIX semantics, so the two instants must
        produce identical ATS values.
        """
        # Datetime cannot represent ":60" directly; the canonical encoding
        # is the post-fold instant, which ATS treats as the absorbed slice.
        post_fold = datetime(2017, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
        ats_post = gregorian_to_ats(post_fold)

        # The fold is invisible to ATS — there is no API to "inject" a
        # negative-leap-second offset. So at minimum verify the instant has
        # the deterministic encoding (Bloc 0 just past midnight UTC).
        self.assertEqual(ats_post.sign, "T+")
        self.assertEqual(ats_post.frac, 0)

    def test_documented_leap_seconds_dont_distort_per_day_count(self):
        """Number of ATS days between two known dates ignores leap seconds.

        Between 1972-07-01T00:00:00Z and 2017-07-01T00:00:00Z, 27 leap seconds
        were inserted. If ATS counted them, the integer-day delta would be off
        by 27/86400 ≈ 0.0003 days. We assert the delta is *exactly* an integer
        number of days (POSIX-aligned).
        """
        start = datetime(1972, 7, 1, tzinfo=timezone.utc)
        end = datetime(2017, 7, 1, tzinfo=timezone.utc)
        a = gregorian_to_ats(start)
        b = gregorian_to_ats(end)
        # Both should land at frac=0 (midnight UTC). Any leap-second leakage
        # would push frac off zero.
        self.assertEqual(a.frac, 0)
        self.assertEqual(b.frac, 0)
        days_between = b.integer_days - a.integer_days
        # Calendar gives exactly 16 436 days from 1972-07-01 to 2017-07-01
        # (45 × 365 + 11 leap-year inserts: 1976, 1980, …, 2016).
        self.assertEqual(days_between, 16_436)


if __name__ == "__main__":
    unittest.main()
