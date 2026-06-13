"""Conformance tests for the calendar bridges (code/bridges/*).

Each bridge module exposes ``to_ats`` / ``from_ats`` and is backed by a
``docs/spec/test-vectors-bridges-<calendar>.json`` file with 10 sample
dates. The test is skipped when the bridge's optional dependency
(`convertdate`, `lunardate`) is not installed.

Run with:  python -m unittest tests.test_bridges
"""

from __future__ import annotations

import json
import sys
import unittest
from importlib import import_module
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "code"))

SPEC_DIR = ROOT / "docs" / "spec"


def _vector_path(calendar: str) -> Path:
    return SPEC_DIR / f"test-vectors-bridges-{calendar}.json"


def _load_vectors(calendar: str):
    path = _vector_path(calendar)
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)["vectors"]


def _bridge_available(name: str) -> bool:
    try:
        mod = import_module(f"bridges.{name}")
    except ImportError:
        return False
    try:
        if hasattr(mod, "_require"):
            mod._require()
    except ImportError:
        return False
    return True


class _BridgeRoundTrip(unittest.TestCase):
    """Mixin: subclasses set ``CALENDAR`` and override
    ``date_tuple_from_vector`` / ``compare_tuples``."""

    CALENDAR: str = ""

    @classmethod
    def setUpClass(cls):
        if cls.CALENDAR == "":
            raise unittest.SkipTest("base class")
        if not _bridge_available(cls.CALENDAR):
            raise unittest.SkipTest(f"Bridge dependency missing for {cls.CALENDAR}")
        cls.vectors = _load_vectors(cls.CALENDAR)
        if cls.vectors is None:
            raise unittest.SkipTest(f"Missing vector file for {cls.CALENDAR}")
        cls.module = import_module(f"bridges.{cls.CALENDAR}")

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        raise NotImplementedError

    def compare_tuples(self, got, expected) -> bool:
        return tuple(got) == tuple(expected)

    def test_each_vector(self) -> None:
        if not getattr(self, "CALENDAR", ""):
            self.skipTest("base mixin")
        for v in self.vectors:
            with self.subTest(label=v["label"]):
                date_tuple = self.date_tuple_from_vector(v)
                ats = self.module.to_ats(*date_tuple)
                self.assertEqual(ats.to_canonical(), v["ats_canonical"])
                back = self.module.from_ats(ats)
                self.assertTrue(
                    self.compare_tuples(back, date_tuple),
                    f"round-trip mismatch: {back} != {date_tuple}",
                )


class TestHebrewBridge(_BridgeRoundTrip):
    CALENDAR = "hebrew"

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        h = vector["hebrew"]
        return (h["year"], h["month"], h["day"])


class TestIslamicBridge(_BridgeRoundTrip):
    CALENDAR = "islamic"

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        h = vector["islamic"]
        return (h["year"], h["month"], h["day"])


class TestMayaBridge(_BridgeRoundTrip):
    CALENDAR = "maya"

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        m = vector["maya"]
        return (m["baktun"], m["katun"], m["tun"], m["uinal"], m["kin"])


class TestIndianBridge(_BridgeRoundTrip):
    CALENDAR = "hindu"

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        h = vector["hindu"]
        return (h["year"], h["month"], h["day"])


class TestChineseBridge(_BridgeRoundTrip):
    CALENDAR = "chinese"

    def date_tuple_from_vector(self, vector: dict) -> tuple:
        c = vector["chinese"]
        return (c["year"], c["month"], c["day"], c["leap_month"])


if __name__ == "__main__":
    unittest.main()
