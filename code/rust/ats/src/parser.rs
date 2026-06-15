//! Strict canonical / short / Δd parsers.
//!
//! Regex anchors at both ends, ASCII-digit only (`[0-9]`, not `\d`, to avoid
//! Unicode digit drift). The legacy `Δ K.H.D.Kin/cc` short form is rejected.

use regex::Regex;
use rust_decimal::Decimal;
use std::sync::OnceLock;

use crate::datetime::{ATSDateTime, Sign};
use crate::duration::ATSDuration;
use crate::error::ATSError;
use crate::{ATS_DECIMALS, ATS_SCALE};

fn canon_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(r"^\s*(T[+-])\s*Δ\s*([0-9]+)\.([0-9])\.([0-9])\.([0-9])\.([0-9]+)\s*$").unwrap()
    })
}

fn short_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(r"^Δ([0-9]+)\.([0-9])\.([0-9])\.([0-9])-([0-9]{2})\.([0-9])$").unwrap()
    })
}

fn duration_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| {
        Regex::new(r"^\s*(T[+-])\s*Δd\s*([0-9]+)\.([0-9])\.([0-9])\.([0-9])\.([0-9]+)\s*$").unwrap()
    })
}

fn pad_or_truncate_frac(raw: &str) -> Result<u64, ATSError> {
    let width = ATS_DECIMALS as usize;
    let mut buf = String::with_capacity(width);
    let take = raw.len().min(width);
    buf.push_str(&raw[..take]);
    while buf.len() < width {
        buf.push('0');
    }
    buf.parse::<u64>()
        .map_err(|_| ATSError::InvalidFormat(raw.to_string()))
}

pub fn parse_canonical(s: &str) -> Result<ATSDateTime, ATSError> {
    let caps = canon_re()
        .captures(s)
        .ok_or_else(|| ATSError::InvalidFormat(s.to_string()))?;
    let sign = Sign::parse(caps.get(1).unwrap().as_str())?;
    let kilo: u64 = caps
        .get(2)
        .unwrap()
        .as_str()
        .parse()
        .map_err(|_| ATSError::InvalidFormat(s.to_string()))?;
    let hecto: u8 = caps.get(3).unwrap().as_str().parse().unwrap();
    let deka: u8 = caps.get(4).unwrap().as_str().parse().unwrap();
    let kin: u8 = caps.get(5).unwrap().as_str().parse().unwrap();
    let frac = pad_or_truncate_frac(caps.get(6).unwrap().as_str())?;
    ATSDateTime::new(sign, kilo, hecto, deka, kin, frac)
}

pub fn parse_short(s: &str, allow_short: bool) -> Result<ATSDateTime, ATSError> {
    let caps = short_re()
        .captures(s)
        .ok_or_else(|| ATSError::InvalidFormat(s.to_string()))?;
    if !allow_short {
        return Err(ATSError::ShortFormNotAllowed);
    }
    let kilo: u64 = caps
        .get(1)
        .unwrap()
        .as_str()
        .parse()
        .map_err(|_| ATSError::InvalidFormat(s.to_string()))?;
    let hecto: u8 = caps.get(2).unwrap().as_str().parse().unwrap();
    let deka: u8 = caps.get(3).unwrap().as_str().parse().unwrap();
    let kin: u8 = caps.get(4).unwrap().as_str().parse().unwrap();
    let bc: u64 = caps.get(5).unwrap().as_str().parse().unwrap();
    let milli: u64 = caps.get(6).unwrap().as_str().parse().unwrap();
    if bc > 99 {
        return Err(ATSError::InvalidFormat(s.to_string()));
    }
    let bc_scale = 10u64.pow(ATS_DECIMALS - 2);
    let milli_scale = 10u64.pow(ATS_DECIMALS - 3);
    let frac = bc * bc_scale + milli * milli_scale;
    ATSDateTime::new(Sign::Pos, kilo, hecto, deka, kin, frac)
}

pub fn parse_duration_canonical(s: &str) -> Result<ATSDuration, ATSError> {
    let caps = duration_re()
        .captures(s)
        .ok_or_else(|| ATSError::InvalidFormat(s.to_string()))?;
    let sign_str = caps.get(1).unwrap().as_str();
    let kilo: u64 = caps
        .get(2)
        .unwrap()
        .as_str()
        .parse()
        .map_err(|_| ATSError::InvalidFormat(s.to_string()))?;
    let hecto: u64 = caps.get(3).unwrap().as_str().parse().unwrap();
    let deka: u64 = caps.get(4).unwrap().as_str().parse().unwrap();
    let kin: u64 = caps.get(5).unwrap().as_str().parse().unwrap();
    let frac = pad_or_truncate_frac(caps.get(6).unwrap().as_str())?;
    let integer_days = kilo * 1_000 + hecto * 100 + deka * 10 + kin;
    let abs = Decimal::from(integer_days) + Decimal::from(frac) / Decimal::from(ATS_SCALE);
    let signed = if sign_str == "T-" { -abs } else { abs };
    Ok(ATSDuration::new(signed))
}

impl std::str::FromStr for ATSDateTime {
    type Err = ATSError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        parse_canonical(s)
    }
}
