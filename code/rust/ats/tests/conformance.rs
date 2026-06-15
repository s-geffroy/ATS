//! Bit-identical conformance against the 8 spec JSON test-vector files.
//!
//! Scope for v1.0-B per `ROADMAP §V1.0-B`:
//! - Core (12 vectors) and arithmetic (12 vectors) **MUST** pass byte-for-byte.
//! - Bridges (5 files) and multi-planetary (2 files) are out of v1.0-B scope;
//!   the JSON is still loaded so the schema is exercised, but assertions are
//!   `#[ignore]`d. This makes future scope creep easy (drop the `ignore`).
//!
//! Test-vector files are baked into the binary via `include_str!` so the crate
//! is relocatable (no symlinks, no `build.rs` codegen).

use ats::{
    ats_to_gregorian, gregorian_to_ats, parse_canonical, parse_duration_canonical, parse_short,
    ATSDateTime, ATSDuration, ATSError, Sign,
};
use rust_decimal::Decimal;
use serde_json::Value;
use time::format_description::well_known::Rfc3339;
use time::OffsetDateTime;

const CORE_JSON: &str = include_str!("../../../../docs/spec/test-vectors.json");
const ARITH_JSON: &str = include_str!("../../../../docs/spec/test-vectors-arithmetic.json");
const BRIDGES_HEBREW: &str =
    include_str!("../../../../docs/spec/test-vectors-bridges-hebrew.json");
const BRIDGES_ISLAMIC: &str =
    include_str!("../../../../docs/spec/test-vectors-bridges-islamic.json");
const BRIDGES_CHINESE: &str =
    include_str!("../../../../docs/spec/test-vectors-bridges-chinese.json");
const BRIDGES_HINDU: &str = include_str!("../../../../docs/spec/test-vectors-bridges-hindu.json");
const BRIDGES_MAYA: &str = include_str!("../../../../docs/spec/test-vectors-bridges-maya.json");
const MULTI_MARS: &str =
    include_str!("../../../../docs/spec/test-vectors-multi-planetary-mars.json");
const MULTI_MOON: &str =
    include_str!("../../../../docs/spec/test-vectors-multi-planetary-moon.json");

const ALL_JSON: &[(&str, &str)] = &[
    ("core", CORE_JSON),
    ("arithmetic", ARITH_JSON),
    ("bridges-hebrew", BRIDGES_HEBREW),
    ("bridges-islamic", BRIDGES_ISLAMIC),
    ("bridges-chinese", BRIDGES_CHINESE),
    ("bridges-hindu", BRIDGES_HINDU),
    ("bridges-maya", BRIDGES_MAYA),
    ("multi-mars", MULTI_MARS),
    ("multi-moon", MULTI_MOON),
];

#[test]
fn core_vectors_bit_identical() {
    let root: Value = serde_json::from_str(CORE_JSON).unwrap();
    let vectors = root["vectors"].as_array().unwrap();
    assert_eq!(vectors.len(), 12, "core file must hold the 12 published vectors");
    for v in vectors {
        let label = v["label"].as_str().unwrap_or("?");
        let utc_str = v["utc"].as_str().unwrap();
        let expected_canonical = v["canonical"].as_str().unwrap();
        let expected_display = v["display"].as_str().unwrap();
        let expected_sign = v["sign"].as_str().unwrap();
        let expected_kilo = v["kilo"].as_u64().unwrap();
        let expected_hecto = v["hecto"].as_u64().unwrap() as u8;
        let expected_deka = v["deka"].as_u64().unwrap() as u8;
        let expected_kin = v["kin"].as_u64().unwrap() as u8;
        let expected_frac = v["frac"].as_u64().unwrap();

        let dt = OffsetDateTime::parse(utc_str, &Rfc3339)
            .unwrap_or_else(|e| panic!("RFC3339 parse failed for {label}: {utc_str} ({e})"));
        let ats = gregorian_to_ats(dt);

        assert_eq!(ats.to_canonical(), expected_canonical, "canonical mismatch: {label}");
        assert_eq!(ats.to_short(), expected_display, "display mismatch: {label}");
        assert_eq!(ats.sign.as_str(), expected_sign, "sign mismatch: {label}");
        assert_eq!(ats.kilo, expected_kilo, "kilo mismatch: {label}");
        assert_eq!(ats.hecto, expected_hecto, "hecto mismatch: {label}");
        assert_eq!(ats.deka, expected_deka, "deka mismatch: {label}");
        assert_eq!(ats.kin, expected_kin, "kin mismatch: {label}");
        assert_eq!(ats.frac, expected_frac, "frac mismatch: {label}");

        // Round-trip: canonical → UTC → canonical bit-stable for second-aligned vectors.
        let parsed = parse_canonical(expected_canonical).unwrap();
        let back = ats_to_gregorian(&parsed);
        let re_ats = gregorian_to_ats(back);
        assert_eq!(
            re_ats.to_canonical(),
            expected_canonical,
            "round-trip canonical mismatch: {label}"
        );
    }
}

#[test]
fn arithmetic_vectors_bit_identical() {
    let root: Value = serde_json::from_str(ARITH_JSON).unwrap();
    let vectors = root["vectors"].as_array().unwrap();
    assert_eq!(vectors.len(), 12, "arithmetic file must hold the 12 published vectors");
    for v in vectors {
        let op = v["op"].as_str().unwrap();
        let label = v["label"].as_str().unwrap_or("?");
        let lhs = &v["lhs"];
        let rhs = &v["rhs"];
        let expected = &v["expected"];

        match op {
            "add" => {
                let l = parse_lhs_ats(lhs);
                let r = parse_dur(rhs);
                let result = l + r;
                assert_eq!(
                    result.to_canonical(),
                    expected_ats_canonical(expected),
                    "add mismatch: {label}"
                );
            }
            "sub" => {
                if rhs["kind"] == "ats" {
                    let l = parse_lhs_ats(lhs);
                    let r = parse_lhs_ats(rhs);
                    let result = l - r;
                    assert_eq!(
                        result.to_canonical(),
                        expected_dur_canonical(expected),
                        "sub(ats,ats) mismatch: {label}"
                    );
                } else {
                    let l = parse_lhs_ats(lhs);
                    let r = parse_dur(rhs);
                    let result = l - r;
                    assert_eq!(
                        result.to_canonical(),
                        expected_ats_canonical(expected),
                        "sub(ats,dur) mismatch: {label}"
                    );
                }
            }
            "mul" => {
                let l = parse_dur(lhs);
                let r = parse_scalar(rhs);
                let result = l * r;
                assert_eq!(
                    result.to_canonical(),
                    expected_dur_canonical(expected),
                    "mul mismatch: {label}"
                );
            }
            "div" => {
                let l = parse_dur(lhs);
                let r = parse_scalar(rhs);
                let result = l / r;
                assert_eq!(
                    result.to_canonical(),
                    expected_dur_canonical(expected),
                    "div mismatch: {label}"
                );
            }
            "lt" => {
                let l = parse_lhs_ats(lhs);
                let r = parse_lhs_ats(rhs);
                let want = expected["value"].as_bool().unwrap();
                assert_eq!(l < r, want, "lt mismatch: {label}");
            }
            other => panic!("unknown arithmetic op {other:?} in vector {label}"),
        }
    }
}

#[test]
fn spec_version_check() {
    for (name, src) in ALL_JSON {
        let root: Value = serde_json::from_str(src).unwrap_or_else(|e| panic!("{name}: {e}"));
        let v = root["spec_version"].as_str().unwrap_or_else(|| panic!("{name} missing spec_version"));
        assert!(v >= "0.6", "{name} spec_version regressed to {v}");
    }
}

#[test]
fn short_form_strict() {
    // Canonical valid short form, but no explicit opt-in.
    let err = parse_short("Δ20.7.8.2-50.0", false).unwrap_err();
    assert!(matches!(err, ATSError::ShortFormNotAllowed));

    // Opt-in works.
    let ok = parse_short("Δ20.7.8.2-50.0", true).unwrap();
    assert_eq!(ok.sign, Sign::Pos);
    assert_eq!(ok.kilo, 20);
    assert_eq!(ok.frac, 50_000);

    // Legacy `/cc` short form is rejected (regex mismatch).
    let legacy = parse_short("Δ20.7.8.2/50", true).unwrap_err();
    assert!(matches!(legacy, ATSError::InvalidFormat(_)));
}

#[test]
fn epoch_round_trip_zero() {
    let epoch = OffsetDateTime::parse("1969-07-20T00:00:00Z", &Rfc3339).unwrap();
    let ats = gregorian_to_ats(epoch);
    assert_eq!(ats.to_canonical(), "T+ Δ 0.0.0.0.00000");
    assert_eq!(ats.to_short(), "Δ0.0.0.0-00.0");
}

#[test]
#[ignore = "bridges out of v1.0-B scope; vectors loaded only for schema sanity"]
fn bridges_vectors_loaded() {
    for (name, src) in [
        ("hebrew", BRIDGES_HEBREW),
        ("islamic", BRIDGES_ISLAMIC),
        ("chinese", BRIDGES_CHINESE),
        ("hindu", BRIDGES_HINDU),
        ("maya", BRIDGES_MAYA),
    ] {
        let root: Value = serde_json::from_str(src).expect(name);
        assert!(root["vectors"].is_array(), "{name} missing vectors array");
    }
}

#[test]
#[ignore = "multi-planetary out of v1.0-B scope; see RFC-0001 for normative annex"]
fn multi_planetary_vectors_loaded() {
    for (name, src) in [("mars", MULTI_MARS), ("moon", MULTI_MOON)] {
        let root: Value = serde_json::from_str(src).expect(name);
        assert!(root["vectors"].is_array(), "{name} missing vectors array");
    }
}

// -- JSON node helpers --------------------------------------------------------

fn parse_lhs_ats(v: &Value) -> ATSDateTime {
    assert_eq!(v["kind"], "ats", "expected ats node, got {v}");
    parse_canonical(v["canonical"].as_str().unwrap()).unwrap()
}

fn parse_dur(v: &Value) -> ATSDuration {
    assert_eq!(v["kind"], "dur", "expected dur node, got {v}");
    if let Some(s) = v["signed_days"].as_str() {
        let dec: Decimal = s.parse().unwrap();
        ATSDuration::new(dec)
    } else if let Some(c) = v["canonical"].as_str() {
        parse_duration_canonical(c).unwrap()
    } else {
        panic!("dur node missing signed_days/canonical: {v}");
    }
}

fn parse_scalar(v: &Value) -> Decimal {
    assert_eq!(v["kind"], "scalar", "expected scalar node, got {v}");
    if let Some(n) = v["value"].as_i64() {
        return Decimal::from(n);
    }
    if let Some(s) = v["value"].as_str() {
        return s.parse().unwrap();
    }
    if let Some(f) = v["value"].as_f64() {
        return Decimal::try_from(f).unwrap();
    }
    panic!("scalar value: {:?}", v["value"]);
}

fn expected_ats_canonical(v: &Value) -> &str {
    assert_eq!(v["kind"], "ats", "expected ats node, got {v}");
    v["canonical"].as_str().unwrap()
}

fn expected_dur_canonical(v: &Value) -> &str {
    assert_eq!(v["kind"], "dur", "expected dur node, got {v}");
    v["canonical"].as_str().unwrap()
}
