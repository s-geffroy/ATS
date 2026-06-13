// ATS — Apollonian Time System v0.6 reference (browser).
// Epoch: 1969-07-20T00:00:00Z (start of Apollo 11 landing day).
// Bloc 5 = 12:00 UTC exactly. The landing itself (20:17:40 UTC) sits at Δ 0 . 8.4.5.6 (frac 0.84560…).
// Spec: /spec/manifesto.en.md (or .fr.md).
//
// v0.6+: adds Δ/Δd arithmetic per spec §11.4. JS uses Number (float64) so
// the duration arithmetic is precise to ~15 significant digits — fine for
// any practical day-scale computation but documented as a precision floor.
// The Python reference (code/ats.py) uses Decimal for full exactness.

(function (global) {
  'use strict';

  const ATS_EPOCH_MS = Date.parse('1969-07-20T00:00:00Z');
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

  // Short form: ΔK.H.D.Kin-BC.M  (no space, Kin always shown, 2-digit Bloc+Centi
  // pair, single Milli digit always emitted, sign assumed T+).
  function toShort(ats) {
    const bc = Math.floor(ats.frac / Math.pow(10, ATS_DECIMALS - 2));
    const milli = Math.floor(ats.frac / Math.pow(10, ATS_DECIMALS - 3)) % 10;
    return `Δ${ats.kilo}.${ats.hecto}.${ats.deka}.${ats.kin}-${pad(bc, 2)}.${milli}`;
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

  // -- v0.6 arithmetic (spec §11.4) -------------------------------------

  function signedDays(ats) {
    // ats: {sign, kilo, hecto, deka, kin, frac}
    const days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
      + ats.frac / ATS_SCALE;
    return ats.sign === 'T-' ? -days : days;
  }

  function fromSignedDays(d) {
    const sign = d >= 0 ? 'T+' : 'T-';
    const abs = Math.abs(d);
    const intDays = Math.floor(abs);
    const frac = Math.floor((abs - intDays) * ATS_SCALE);
    const kilo = Math.floor(intDays / 1000);
    let rem = intDays % 1000;
    const hecto = Math.floor(rem / 100);
    rem = rem % 100;
    const deka = Math.floor(rem / 10);
    const kin = rem % 10;
    return { sign, kilo, hecto, deka, kin, frac };
  }

  function dur(signed) {
    // Plain shape so callers can JSON.stringify a duration.
    return { kind: 'dur', signedDays: Number(signed) };
  }

  function isDur(x) { return x && x.kind === 'dur'; }
  function isAts(x) { return x && typeof x.kilo === 'number' && typeof x.frac === 'number' && !x.kind; }

  function durToCanonical(d) {
    const sign = d.signedDays < 0 ? 'T-' : 'T+';
    const abs = Math.abs(d.signedDays);
    const intDays = Math.floor(abs);
    const frac = Math.floor((abs - intDays) * ATS_SCALE);
    const kilo = Math.floor(intDays / 1000);
    let rem = intDays % 1000;
    const hecto = Math.floor(rem / 100);
    rem = rem % 100;
    const deka = Math.floor(rem / 10);
    const kin = rem % 10;
    return `${sign} Δd ${kilo}.${hecto}.${deka}.${kin}.${pad(frac, ATS_DECIMALS)}`;
  }

  function durFromCanonical(str) {
    const m = /^\s*(T[+-])\s*Δd\s+(\d+)\.(\d)\.(\d)\.(\d)\.(\d+)\s*$/.exec(str);
    if (!m) return null;
    const sign = m[1];
    const kilo = parseInt(m[2], 10);
    const hecto = parseInt(m[3], 10);
    const deka = parseInt(m[4], 10);
    const kin = parseInt(m[5], 10);
    const fracStr = m[6].slice(0, ATS_DECIMALS).padEnd(ATS_DECIMALS, '0');
    const frac = parseInt(fracStr, 10);
    const days = kilo * 1000 + hecto * 100 + deka * 10 + kin + frac / ATS_SCALE;
    return dur(sign === 'T-' ? -days : days);
  }

  // Polymorphic add: (ats, dur) → ats ; (dur, dur) → dur.
  function add(a, b) {
    if (isAts(a) && isDur(b)) return fromSignedDays(signedDays(a) + b.signedDays);
    if (isDur(a) && isAts(b)) return fromSignedDays(a.signedDays + signedDays(b));
    if (isDur(a) && isDur(b)) return dur(a.signedDays + b.signedDays);
    throw new TypeError('ATS.add: unsupported operands');
  }

  // Polymorphic sub: (ats, ats) → dur ; (ats, dur) → ats ; (dur, dur) → dur.
  function sub(a, b) {
    if (isAts(a) && isAts(b)) return dur(signedDays(a) - signedDays(b));
    if (isAts(a) && isDur(b)) return fromSignedDays(signedDays(a) - b.signedDays);
    if (isDur(a) && isDur(b)) return dur(a.signedDays - b.signedDays);
    throw new TypeError('ATS.sub: unsupported operands');
  }

  function mul(d, n) {
    if (!isDur(d) || typeof n !== 'number') {
      throw new TypeError('ATS.mul expects (dur, number)');
    }
    return dur(d.signedDays * n);
  }

  function div(d, n) {
    if (!isDur(d) || typeof n !== 'number') {
      throw new TypeError('ATS.div expects (dur, number)');
    }
    return dur(d.signedDays / n);
  }

  function neg(d) { return dur(-d.signedDays); }
  function absDur(d) { return dur(Math.abs(d.signedDays)); }

  function cmp(a, b) {
    const sa = isDur(a) ? a.signedDays : signedDays(a);
    const sb = isDur(b) ? b.signedDays : signedDays(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  }
  function lt(a, b) { return cmp(a, b) <  0; }
  function le(a, b) { return cmp(a, b) <= 0; }
  function eq(a, b) { return cmp(a, b) === 0; }
  function gt(a, b) { return cmp(a, b) >  0; }
  function ge(a, b) { return cmp(a, b) >= 0; }

  global.ATS = {
    EPOCH_MS: ATS_EPOCH_MS,
    EPOCH_ISO: '1969-07-20T00:00:00Z',
    DECIMALS: ATS_DECIMALS,
    atsFromMs,
    toCanonical,
    toShort,
    canonicalToMs,
    // v0.6 — Δ/Δd algebra (spec §11.4)
    signedDays,
    fromSignedDays,
    dur,
    durToCanonical,
    durFromCanonical,
    add,
    sub,
    mul,
    div,
    neg,
    abs: absDur,
    cmp,
    lt, le, eq, gt, ge,
  };
})(typeof window !== 'undefined' ? window : globalThis);
