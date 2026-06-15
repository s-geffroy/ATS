//! Gregorian ↔ ATS conversion.
//!
//! Pivots on integer microseconds since `ATS_EPOCH`, matching Python's
//! `_timedelta_to_decimal_days` exactly: total µs is an exact integer, one
//! Decimal division is performed against `86_400_000_000`, and the result is
//! floor-truncated to 5 fractional digits. This is the only path that
//! reproduces the existing JSON conformance vectors bit-identically.

use rust_decimal::prelude::ToPrimitive;
use rust_decimal::Decimal;
use time::{Duration, OffsetDateTime, UtcOffset};

use crate::datetime::{ATSDateTime, Sign};
use crate::places::{integer_days_to_places, split_abs_days_floor};
use crate::ATS_EPOCH;

const US_PER_DAY: i128 = 86_400_000_000;

pub fn gregorian_to_ats(dt: OffsetDateTime) -> ATSDateTime {
    let dt_utc = dt.to_offset(UtcOffset::UTC);
    let delta = dt_utc - ATS_EPOCH;
    let total_us: i128 = delta.whole_microseconds();
    let sign = if total_us >= 0 { Sign::Pos } else { Sign::Neg };
    let abs_us = total_us.abs();
    let days =
        Decimal::from_i128_with_scale(abs_us, 0) / Decimal::from_i128_with_scale(US_PER_DAY, 0);
    let (integer_days, frac_int) = split_abs_days_floor(days);
    let (kilo, hecto, deka, kin) = integer_days_to_places(integer_days);
    ATSDateTime {
        sign,
        kilo,
        hecto,
        deka,
        kin,
        frac: frac_int,
    }
}

pub fn ats_to_gregorian(ats: &ATSDateTime) -> OffsetDateTime {
    let signed_days = ats.signed_decimal_days();
    let us_dec = signed_days * Decimal::from_i128_with_scale(US_PER_DAY, 0);
    let us_floored: i128 = us_dec
        .floor()
        .to_i128()
        .expect("microsecond delta fits in i128 for any practical instant");
    // Rust's `/` and `%` truncate toward zero and preserve dividend sign, so secs
    // and nanos share a sign — what `time::Duration::new` requires.
    let secs = (us_floored / 1_000_000) as i64;
    let sub_us = (us_floored % 1_000_000) as i32;
    let nanos = sub_us * 1_000;
    ATS_EPOCH + Duration::new(secs, nanos)
}
