//! ATSDuration — a signed amount of days as an arbitrary-precision Decimal.
//!
//! Mirrors Python `code/ats.py::ATSDuration`. Spec §11.4.

use rust_decimal::Decimal;
use std::cmp::Ordering;
use std::ops::{Add, Div, Mul, Neg, Sub};

use crate::datetime::Sign;

/// A signed duration in fractional days.
#[derive(Debug, Clone, Copy)]
pub struct ATSDuration {
    pub signed_days: Decimal,
}

impl ATSDuration {
    pub fn new(signed_days: Decimal) -> Self {
        Self { signed_days }
    }

    pub fn zero() -> Self {
        Self {
            signed_days: Decimal::ZERO,
        }
    }

    /// Convenience constructor from an integer day count.
    pub fn from_days(days: i64) -> Self {
        Self {
            signed_days: Decimal::from(days),
        }
    }

    pub fn sign(&self) -> Sign {
        if self.signed_days.is_sign_negative() && !self.signed_days.is_zero() {
            Sign::Neg
        } else {
            Sign::Pos
        }
    }

    pub fn abs_days(&self) -> Decimal {
        self.signed_days.abs()
    }
}

impl PartialEq for ATSDuration {
    fn eq(&self, other: &Self) -> bool {
        self.signed_days == other.signed_days
    }
}

impl Eq for ATSDuration {}

impl PartialOrd for ATSDuration {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for ATSDuration {
    fn cmp(&self, other: &Self) -> Ordering {
        self.signed_days.cmp(&other.signed_days)
    }
}

impl Add for ATSDuration {
    type Output = Self;
    fn add(self, rhs: Self) -> Self {
        Self::new(self.signed_days + rhs.signed_days)
    }
}

impl Sub for ATSDuration {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self {
        Self::new(self.signed_days - rhs.signed_days)
    }
}

impl Mul<i64> for ATSDuration {
    type Output = Self;
    fn mul(self, n: i64) -> Self {
        Self::new(self.signed_days * Decimal::from(n))
    }
}

impl Mul<Decimal> for ATSDuration {
    type Output = Self;
    fn mul(self, n: Decimal) -> Self {
        Self::new(self.signed_days * n)
    }
}

impl Div<i64> for ATSDuration {
    type Output = Self;
    fn div(self, n: i64) -> Self {
        Self::new(self.signed_days / Decimal::from(n))
    }
}

impl Div<Decimal> for ATSDuration {
    type Output = Self;
    fn div(self, n: Decimal) -> Self {
        Self::new(self.signed_days / n)
    }
}

impl Neg for ATSDuration {
    type Output = Self;
    fn neg(self) -> Self {
        Self::new(-self.signed_days)
    }
}
