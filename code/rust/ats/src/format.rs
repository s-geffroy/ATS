//! Canonical and short-form rendering.

use std::fmt;

use crate::datetime::ATSDateTime;
use crate::duration::ATSDuration;
use crate::places::{integer_days_to_places, split_abs_days_floor};
use crate::{ATS_DECIMALS, ATS_DURATION_SYMBOL, ATS_SYMBOL};

impl ATSDateTime {
    /// Canonical form: `T± Δ K.H.D.Kin.fffff`.
    pub fn to_canonical(&self) -> String {
        format!(
            "{} {} {}.{}.{}.{}.{:0width$}",
            self.sign.as_str(),
            ATS_SYMBOL,
            self.kilo,
            self.hecto,
            self.deka,
            self.kin,
            self.frac,
            width = ATS_DECIMALS as usize
        )
    }

    /// Short form (UI): `ΔK.H.D.Kin-BC.M` — lossy, drops sign + lower digits.
    pub fn to_short(&self) -> String {
        let bc_scale = 10u64.pow(ATS_DECIMALS - 2);
        let milli_scale = 10u64.pow(ATS_DECIMALS - 3);
        let bc = self.frac / bc_scale;
        let m = (self.frac / milli_scale) % 10;
        format!(
            "{}{}.{}.{}.{}-{:02}.{}",
            ATS_SYMBOL, self.kilo, self.hecto, self.deka, self.kin, bc, m
        )
    }
}

impl fmt::Display for ATSDateTime {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.to_canonical())
    }
}

impl ATSDuration {
    /// Canonical form: `T± Δd K.H.D.Kin.fffff` — sign carried explicitly.
    pub fn to_canonical(&self) -> String {
        let abs = self.abs_days();
        let (integer_days, frac_int) = split_abs_days_floor(abs);
        let (kilo, hecto, deka, kin) = integer_days_to_places(integer_days);
        format!(
            "{} {} {}.{}.{}.{}.{:0width$}",
            self.sign().as_str(),
            ATS_DURATION_SYMBOL,
            kilo,
            hecto,
            deka,
            kin,
            frac_int,
            width = ATS_DECIMALS as usize
        )
    }
}

impl fmt::Display for ATSDuration {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.to_canonical())
    }
}
