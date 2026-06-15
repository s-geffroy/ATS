//! ATS — Apollonian Time System, Rust reference implementation.
//!
//! Mirrors `code/ats.py` of the parent repository line-for-line in observable
//! behaviour: every output is bit-identical to the Python and JavaScript
//! reference implementations on the 8 conformance-vector files under
//! `docs/spec/test-vectors-*.json`.
//!
//! Spec: `docs/spec/manifesto.en.md` (v0.7).
//! Epoch: `1969-07-20T00:00:00Z` (start of the Apollo 11 landing day, UTC).
//! Bloc 5 = 12:00 UTC exactly.
//!
//! See `docs/spec/rfcs/0001-multi-planetary-normative.md` for the RFC that
//! promoted the multi-planetary annex to normative status; this crate covers
//! the core spec only (Earth-anchored bare Δ), per `ROADMAP §V1.0-B`.

pub mod convert;
pub mod datetime;
pub mod duration;
pub mod format;
pub mod parser;

mod error;
mod places;

pub use convert::{ats_to_gregorian, gregorian_to_ats};
pub use datetime::{ATSDateTime, Sign};
pub use duration::ATSDuration;
pub use error::ATSError;
pub use parser::{parse_canonical, parse_duration_canonical, parse_short};

use time::macros::datetime;
use time::OffsetDateTime;

/// ATS instant symbol (U+0394).
pub const ATS_SYMBOL: &str = "Δ";

/// ATS duration symbol.
pub const ATS_DURATION_SYMBOL: &str = "Δd";

/// Default fractional precision: 5 digits below the day.
pub const ATS_DECIMALS: u32 = 5;

/// `10.pow(ATS_DECIMALS)` — the integer scale of one canonical day.
pub const ATS_SCALE: u64 = 100_000;

/// Anchoring instant: start of the Apollo 11 landing day, UTC.
pub const ATS_EPOCH: OffsetDateTime = datetime!(1969-07-20 0:00:00 UTC);
