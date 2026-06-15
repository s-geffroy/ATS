use std::fmt;

/// Errors surfaced by the ATS crate.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ATSError {
    InvalidSign(String),
    DigitOutOfRange { field: &'static str, value: u64 },
    FracOutOfRange(u64),
    InvalidFormat(String),
    ShortFormNotAllowed,
}

impl fmt::Display for ATSError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidSign(s) => write!(f, "sign must be 'T+' or 'T-', got {s:?}"),
            Self::DigitOutOfRange { field, value } => {
                write!(f, "{field} must be a digit 0..9, got {value}")
            }
            Self::FracOutOfRange(v) => {
                write!(f, "frac must be in 0..{}, got {v}", crate::ATS_SCALE - 1)
            }
            Self::InvalidFormat(s) => write!(f, "Invalid ATS format: {s:?}"),
            Self::ShortFormNotAllowed => write!(
                f,
                "Refusing to decode short ATS form without explicit opt-in (pass allow_short=true). \
                 Short form is lossy: Beat/Blink digits zero-padded, sign assumed T+."
            ),
        }
    }
}

impl std::error::Error for ATSError {}
