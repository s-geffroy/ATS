"""Performance regression guard for the hot conversion path.

`gregorian_to_ats` is called every tick of the live clock (10 Hz × N tabs)
and once per city × per slider scrub on the Cities page. A 10× regression
would be visible as UI jank. We budget < 100 µs *median* per call on the
ubuntu-latest CI runner — generous compared to the ~30 µs we currently
measure locally, but tight enough to catch a real regression.

Skipped if running on a machine where wall-clock noise dominates (CI
docker on shared hardware can be erratic): exported via env knob
``ATS_PERF_BUDGET_US`` so the threshold can be relaxed.
"""

from __future__ import annotations

import os
import statistics
import sys
import time
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "code"))

from ats import gregorian_to_ats  # noqa: E402


EPOCH = datetime(1969, 7, 20, tzinfo=timezone.utc)
SAMPLES = int(os.environ.get("ATS_PERF_SAMPLES", "10000"))
BUDGET_US = float(os.environ.get("ATS_PERF_BUDGET_US", "100.0"))


class TestGregorianToAtsPerf(unittest.TestCase):
    """Median wall-time per call must stay under BUDGET_US microseconds."""

    def test_median_under_budget(self):
        # Pre-build inputs so we measure conversion, not datetime construction.
        inputs = [EPOCH + timedelta(seconds=i * 137) for i in range(SAMPLES)]
        # Warm-up — JIT, branch prediction, cache.
        for dt in inputs[:200]:
            gregorian_to_ats(dt)
        times_ns = []
        for dt in inputs:
            t0 = time.perf_counter_ns()
            gregorian_to_ats(dt)
            times_ns.append(time.perf_counter_ns() - t0)
        median_us = statistics.median(times_ns) / 1000
        p95_us = sorted(times_ns)[int(len(times_ns) * 0.95)] / 1000
        # Median is the primary gate; print p95 so a regression-in-tail is
        # visible in the CI log even when the median squeaks under budget.
        print(
            f"\ngregorian_to_ats — median {median_us:.2f} µs · "
            f"p95 {p95_us:.2f} µs · n={SAMPLES} · budget={BUDGET_US} µs"
        )
        self.assertLess(
            median_us,
            BUDGET_US,
            f"median {median_us:.2f} µs exceeds budget {BUDGET_US} µs",
        )


if __name__ == "__main__":
    unittest.main()
