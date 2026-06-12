// ATS — Apollonian Time System v1.1 reference (browser).
// Epoch: 1969-07-20T20:17:40Z (Apollo 11 touchdown).
// Spec: /spec/manifesto.en.md (or .fr.md).

(function (global) {
  'use strict';

  const ATS_EPOCH_MS = Date.parse('1969-07-20T20:17:40Z');
  const ATS_DECIMALS = 5;
  const ATS_SCALE = 100000;
  const MS_PER_DAY = 86400000;

  function pad(n, width) {
    return String(n).padStart(width, '0');
  }

  // Convert a millisecond timestamp (UTC epoch ms) to an ATS object.
  // Strict floor truncation per spec §6 — a unit is published only once
  // it has fully elapsed.
  function atsFromMs(ms) {
    const deltaMs = ms - ATS_EPOCH_MS;
    const sign = deltaMs >= 0 ? 'T+' : 'T-';
    const absMs = Math.abs(deltaMs);

    const intDays = Math.floor(absMs / MS_PER_DAY);
    const dayRemainderMs = absMs - intDays * MS_PER_DAY;

    // Fractional digits: scale to 5 places, floor.
    const frac = Math.floor((dayRemainderMs * ATS_SCALE) / MS_PER_DAY);

    const kilo = Math.floor(intDays / 1000);
    let rem = intDays % 1000;
    const hecto = Math.floor(rem / 100);
    rem = rem % 100;
    const deka = Math.floor(rem / 10);
    const kin = rem % 10;

    return { sign, kilo, hecto, deka, kin, frac };
  }

  function toCanonical(ats) {
    return `${ats.sign} Δ ${ats.kilo}.${ats.hecto}.${ats.deka}.${ats.kin}.${pad(ats.frac, ATS_DECIMALS)}`;
  }

  // Short form: Δ K.H.D / cc  (Kin omitted, 2 fractional digits, sign assumed T+).
  function toShort(ats) {
    const cc = Math.floor(ats.frac / Math.pow(10, ATS_DECIMALS - 2));
    return `Δ ${ats.kilo}.${ats.hecto}.${ats.deka} / ${pad(cc, 2)}`;
  }

  // Decode a canonical ATS string back to milliseconds UTC.
  // Returns null when the string is not canonical.
  function canonicalToMs(str) {
    const m = /^\s*(T[+-])\s*Δ\s*(\d+)\.(\d)\.(\d)\.(\d)\.(\d{1,})\s*$/.exec(str);
    if (!m) return null;
    const sign = m[1];
    const kilo = parseInt(m[2], 10);
    const hecto = parseInt(m[3], 10);
    const deka = parseInt(m[4], 10);
    const kin = parseInt(m[5], 10);
    let fracStr = m[6].slice(0, ATS_DECIMALS).padEnd(ATS_DECIMALS, '0');
    const frac = parseInt(fracStr, 10);

    const days = kilo * 1000 + hecto * 100 + deka * 10 + kin + frac / ATS_SCALE;
    const deltaMs = (sign === 'T+' ? 1 : -1) * days * MS_PER_DAY;
    return ATS_EPOCH_MS + deltaMs;
  }

  global.ATS = {
    EPOCH_MS: ATS_EPOCH_MS,
    EPOCH_ISO: '1969-07-20T20:17:40Z',
    DECIMALS: ATS_DECIMALS,
    atsFromMs,
    toCanonical,
    toShort,
    canonicalToMs,
  };
})(window);
