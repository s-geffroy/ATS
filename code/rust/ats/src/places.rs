use rust_decimal::prelude::ToPrimitive;
use rust_decimal::Decimal;

use crate::ATS_SCALE;

/// Split a non-negative day count into `(integer_days, frac_digits)`.
///
/// Uses strict floor truncation (matches Python `Decimal.to_integral_value(rounding=ROUND_FLOOR)`).
/// A digit is published only after its unit has fully elapsed; no anticipation,
/// no carry into a future day.
pub(crate) fn split_abs_days_floor(abs_days: Decimal) -> (u64, u64) {
    let integer_part = abs_days.floor();
    let integer_days = integer_part
        .to_u64()
        .expect("integer days fit in u64 for any practical instant");
    let frac = abs_days - integer_part;
    let scaled = frac * Decimal::from(ATS_SCALE);
    let frac_int = scaled
        .floor()
        .to_u64()
        .expect("frac < ATS_SCALE so fits in u64");
    (integer_days, frac_int)
}

/// Decompose integer days into the `(kilo, hecto, deka, kin)` quadruple.
pub(crate) fn integer_days_to_places(integer_days: u64) -> (u64, u8, u8, u8) {
    let kilo = integer_days / 1_000;
    let rem = integer_days % 1_000;
    let hecto = (rem / 100) as u8;
    let rem = rem % 100;
    let deka = (rem / 10) as u8;
    let kin = (rem % 10) as u8;
    (kilo, hecto, deka, kin)
}
