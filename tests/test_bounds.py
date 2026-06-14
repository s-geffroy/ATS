"""Edge-case parsing & arithmetic bounds for the ATS module.

Covers what the property test cannot: malformed inputs, extreme Kilo
values (multi-millennia), and the boundary frac=99999.
"""

from __future__ import annotations

import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "code"))

from ats import ATSDateTime, ats_to_gregorian, gregorian_to_ats  # noqa: E402


EPOCH = datetime(1969, 7, 20, tzinfo=timezone.utc)


class TestKiloBounds(unittest.TestCase):
    """Kilo is unbounded by spec §11. Very large and very negative both work."""

    def test_kilo_at_zero(self):
        ats = ATSDateTime(sign="T+", kilo=0, hecto=0, deka=0, kin=0, frac=0)
        self.assertEqual(ats.to_canonical(), "T+ Δ 0.0.0.0.00000")

    def test_kilo_within_realistic_range(self):
        # ~2469 AD, well outside ISO 8601 calendar tooling but legal ATS.
        future = EPOCH + timedelta(days=500_000)
        ats = gregorian_to_ats(future)
        self.assertEqual(ats.kilo, 500)
        self.assertEqual(ats.integer_days, 500_000)

    def test_kilo_far_future_round_trip(self):
        # Python's datetime caps at year 9999; we go close to that ceiling
        # (Kilo = 2 ≈ year 7945 AD = ~2 180 000 days from epoch) — still
        # exercises a Kilo two orders of magnitude above day-to-day use.
        far = EPOCH + timedelta(days=2_180_000)
        ats = gregorian_to_ats(far)
        self.assertGreaterEqual(ats.kilo, 2)
        back = ats_to_gregorian(ats.to_canonical())
        drift_ms = abs((far - back).total_seconds()) * 1000
        self.assertLessEqual(drift_ms, 864)

    def test_pre_epoch_uses_t_minus(self):
        past = EPOCH - timedelta(days=10_000)
        ats = gregorian_to_ats(past)
        self.assertEqual(ats.sign, "T-")
        self.assertEqual(ats.integer_days, 10_000)

    def test_dataclass_rejects_negative_kilo(self):
        with self.assertRaises(ValueError):
            ATSDateTime(sign="T+", kilo=-1, hecto=0, deka=0, kin=0, frac=0)

    def test_dataclass_rejects_out_of_range_digits(self):
        for kwargs in (
            {"hecto": 10},
            {"deka": 10},
            {"kin": -1},
            {"frac": 100_000},
            {"frac": -1},
        ):
            with self.subTest(**kwargs):
                with self.assertRaises(ValueError):
                    base = dict(sign="T+", kilo=0, hecto=0, deka=0, kin=0, frac=0)
                    base.update(kwargs)
                    ATSDateTime(**base)

    def test_dataclass_rejects_bad_sign(self):
        with self.assertRaises(ValueError):
            ATSDateTime(sign="T?", kilo=0, hecto=0, deka=0, kin=0, frac=0)


class TestFracBoundary(unittest.TestCase):
    """frac is [0, 99999]; 99999 is the last 5-digit slice (≈ 99% Blink 9)."""

    def test_frac_at_max_decodes_to_late_in_day(self):
        ats = ATSDateTime(sign="T+", kilo=0, hecto=0, deka=0, kin=0, frac=99_999)
        # 99999 / 100000 = 0.99999 day = 23h 59min 59.136s
        back = ats_to_gregorian(ats.to_canonical())
        self.assertEqual(back.date(), EPOCH.date())
        sod = (back - back.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
        self.assertAlmostEqual(sod, 86_399.136, places=2)


class TestCanonicalParserRejection(unittest.TestCase):
    """The canonical parser must reject malformed inputs cleanly."""

    BAD = [
        "",                                  # empty
        "Δ 20.7.8.2.50000",                  # missing sign
        "T+ Δ 20.7.8.2",                     # no frac
        "T+ Δ 20.7.8.50000",                 # missing Kin
        "T* Δ 20.7.8.2.50000",               # bad sign
        "T+ Σ 20.7.8.2.50000",               # wrong symbol
        "T+ Δ 20.A.8.2.50000",               # non-digit
        "T+ Δ 20.7.8.2.5e4",                 # scientific
        "T+ Δ 20.7.8.2.500000xxxxx",         # trailing garbage
    ]

    def test_all_bad_inputs_raise(self):
        for raw in self.BAD:
            with self.subTest(raw=raw):
                with self.assertRaises(ValueError):
                    ats_to_gregorian(raw)


class TestShortParserStrictness(unittest.TestCase):
    """The short parser became strict in v0.7 — no leading/trailing whitespace."""

    BAD_SHORT = [
        " Δ20.7.8.2-50.0",                   # leading space (post-v0.7 strict)
        "Δ20.7.8.2-50.0 ",                   # trailing space
        "Δ 20.7.8.2-50.0",                   # space after symbol
        "Δ20.7.8.2/50",                      # legacy slash form
        "Δ20.7.8.2-5.0",                     # BC needs 2 digits
        "Δ20.7.8.2-50",                      # missing .M
        "Δ20.7.8-50.0",                      # missing Kin
        "20.7.8.2-50.0",                     # missing Δ
    ]

    def test_strict_short_rejects_malformed(self):
        for raw in self.BAD_SHORT:
            with self.subTest(raw=raw):
                with self.assertRaises(ValueError):
                    ats_to_gregorian(raw, allow_short=True)


if __name__ == "__main__":
    unittest.main()
