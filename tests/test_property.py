"""Property-based round-trip tests for the core ATS conversion.

Uses Hypothesis to generate ~1000 random UTC instants spanning ±1 000 years
around the epoch and asserts:

    gregorian_to_ats(dt) → to_canonical → ats_to_gregorian → dt'
    |dt - dt'| ≤ 864 ms  (spec §6: floor truncation at 5-digit precision)

Skipped at import time if Hypothesis is not installed, so the core test
suite still passes on minimal environments (the CI installs Hypothesis
in the python job; see pyproject.toml [project.optional-dependencies]
``tests`` extra).
"""

from __future__ import annotations

import os
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "code"))

try:
    from hypothesis import HealthCheck, given, settings
    from hypothesis import strategies as st

    HAS_HYPOTHESIS = True
except ImportError:
    HAS_HYPOTHESIS = False

from ats import ats_to_gregorian, gregorian_to_ats  # noqa: E402

# ±1000 years from the epoch covers the realistic ATS use range (Kilo ≤ ~366
# means dates within 1000 years), and exercises both T+ and T- branches.
EPOCH = datetime(1969, 7, 20, tzinfo=timezone.utc)
MIN_DT = EPOCH - timedelta(days=365 * 1000)
MAX_DT = EPOCH + timedelta(days=365 * 1000)

# Floor-truncation drift bound per spec §6:
#   At 5-digit precision, a published value is at most 1/100000 of a day late
#   compared to the true instant → 86400 s / 100000 = 864 ms.
MAX_DRIFT_MS = 864


@unittest.skipUnless(HAS_HYPOTHESIS, "hypothesis not installed")
class TestRoundTripProperty(unittest.TestCase):
    """Round-trip ats(t) and back must stay within the documented drift."""

    @settings(
        max_examples=int(os.environ.get("ATS_PROPERTY_EXAMPLES", "1000")),
        deadline=None,
        suppress_health_check=[HealthCheck.too_slow],
    )
    @given(
        st.datetimes(min_value=MIN_DT.replace(tzinfo=None), max_value=MAX_DT.replace(tzinfo=None))
    )
    def test_canonical_roundtrip_within_drift(self, naive_dt):
        dt = naive_dt.replace(tzinfo=timezone.utc)
        ats = gregorian_to_ats(dt)
        back = ats_to_gregorian(ats.to_canonical())
        drift_ms = abs((dt - back).total_seconds()) * 1000
        # The reconstructed instant always lies between dt and the epoch
        # (floor truncation reduces the *absolute* elapsed-day count). On
        # T+ that means back ≤ dt; on T- it means back ≥ dt (closer to epoch
        # = later in time, since dt is in the past).
        if dt >= EPOCH:
            self.assertLessEqual(back, dt, f"T+ side: {back} > {dt}")
            self.assertGreaterEqual(back, EPOCH, f"T+ side: {back} < epoch")
        else:
            self.assertGreaterEqual(back, dt, f"T- side: {back} < {dt}")
            self.assertLessEqual(back, EPOCH, f"T- side: {back} > epoch")
        self.assertLessEqual(
            drift_ms,
            MAX_DRIFT_MS,
            f"drift {drift_ms:.3f} ms exceeds spec bound {MAX_DRIFT_MS} ms at {dt}",
        )


if __name__ == "__main__":
    unittest.main()
