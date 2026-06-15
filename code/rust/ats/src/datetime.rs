//! ATSDateTime — an instant, anchored on `ATS_EPOCH`.

use rust_decimal::Decimal;
use std::cmp::Ordering;
use std::ops::{Add, Sub};

use crate::duration::ATSDuration;
use crate::error::ATSError;
use crate::places::{integer_days_to_places, split_abs_days_floor};
use crate::ATS_SCALE;

/// Sign of an `ATSDateTime`: `T+` for instants after the epoch, `T-` before.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Sign {
    Pos,
    Neg,
}

impl Sign {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Pos => "T+",
            Self::Neg => "T-",
        }
    }

    pub fn parse(s: &str) -> Result<Self, ATSError> {
        match s {
            "T+" => Ok(Self::Pos),
            "T-" => Ok(Self::Neg),
            _ => Err(ATSError::InvalidSign(s.to_string())),
        }
    }
}

/// An ATS instant.
///
/// Invariants enforced by [`ATSDateTime::new`]:
/// - `hecto`, `deka`, `kin` are each in `0..=9`.
/// - `frac` is in `0..ATS_SCALE`.
#[derive(Debug, Clone, Copy)]
pub struct ATSDateTime {
    pub sign: Sign,
    pub kilo: u64,
    pub hecto: u8,
    pub deka: u8,
    pub kin: u8,
    pub frac: u64,
}

impl ATSDateTime {
    /// Validating constructor.
    pub fn new(
        sign: Sign,
        kilo: u64,
        hecto: u8,
        deka: u8,
        kin: u8,
        frac: u64,
    ) -> Result<Self, ATSError> {
        if hecto > 9 {
            return Err(ATSError::DigitOutOfRange {
                field: "hecto",
                value: hecto as u64,
            });
        }
        if deka > 9 {
            return Err(ATSError::DigitOutOfRange {
                field: "deka",
                value: deka as u64,
            });
        }
        if kin > 9 {
            return Err(ATSError::DigitOutOfRange {
                field: "kin",
                value: kin as u64,
            });
        }
        if frac >= ATS_SCALE {
            return Err(ATSError::FracOutOfRange(frac));
        }
        Ok(Self {
            sign,
            kilo,
            hecto,
            deka,
            kin,
            frac,
        })
    }

    pub fn integer_days(&self) -> u64 {
        self.kilo * 1_000
            + (self.hecto as u64) * 100
            + (self.deka as u64) * 10
            + (self.kin as u64)
    }

    pub fn total_days_decimal(&self) -> Decimal {
        Decimal::from(self.integer_days()) + Decimal::from(self.frac) / Decimal::from(ATS_SCALE)
    }

    pub(crate) fn signed_decimal_days(&self) -> Decimal {
        let d = self.total_days_decimal();
        if self.sign == Sign::Neg {
            -d
        } else {
            d
        }
    }

    pub(crate) fn from_signed_days(d: Decimal) -> Self {
        let sign = if d.is_sign_negative() && !d.is_zero() {
            Sign::Neg
        } else {
            Sign::Pos
        };
        let abs_d = d.abs();
        let (integer_days, frac_int) = split_abs_days_floor(abs_d);
        let (kilo, hecto, deka, kin) = integer_days_to_places(integer_days);
        // Constructed from validated decimal — invariants hold by construction.
        Self {
            sign,
            kilo,
            hecto,
            deka,
            kin,
            frac: frac_int,
        }
    }
}

impl PartialEq for ATSDateTime {
    fn eq(&self, other: &Self) -> bool {
        self.signed_decimal_days() == other.signed_decimal_days()
    }
}

impl Eq for ATSDateTime {}

impl Ord for ATSDateTime {
    fn cmp(&self, other: &Self) -> Ordering {
        self.signed_decimal_days().cmp(&other.signed_decimal_days())
    }
}

impl PartialOrd for ATSDateTime {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

// Δ + Δd → Δ
impl Add<ATSDuration> for ATSDateTime {
    type Output = ATSDateTime;
    fn add(self, rhs: ATSDuration) -> ATSDateTime {
        ATSDateTime::from_signed_days(self.signed_decimal_days() + rhs.signed_days)
    }
}

// Δd + Δ → Δ (commutative wrapper)
impl Add<ATSDateTime> for ATSDuration {
    type Output = ATSDateTime;
    fn add(self, rhs: ATSDateTime) -> ATSDateTime {
        rhs.add(self)
    }
}

// Δ − Δ → Δd
impl Sub<ATSDateTime> for ATSDateTime {
    type Output = ATSDuration;
    fn sub(self, rhs: ATSDateTime) -> ATSDuration {
        ATSDuration::new(self.signed_decimal_days() - rhs.signed_decimal_days())
    }
}

// Δ − Δd → Δ
impl Sub<ATSDuration> for ATSDateTime {
    type Output = ATSDateTime;
    fn sub(self, rhs: ATSDuration) -> ATSDateTime {
        ATSDateTime::from_signed_days(self.signed_decimal_days() - rhs.signed_days)
    }
}
