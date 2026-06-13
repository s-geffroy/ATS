// Conformance test — JS implementation against docs/spec/test-vectors.json.
// Run with:  node tests/test_vectors.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');

// Inline the JS implementation (same logic as docs/assets/js/ats.js).
const ATS_EPOCH_MS = Date.parse('1969-07-20T00:00:00Z');
const ATS_DECIMALS = 5;
const ATS_SCALE = 100000;
const MS_PER_DAY = 86400000;

function atsFromMs(ms) {
  const deltaMs = ms - ATS_EPOCH_MS;
  const sign = deltaMs >= 0 ? 'T+' : 'T-';
  const absMs = Math.abs(deltaMs);
  const intDays = Math.floor(absMs / MS_PER_DAY);
  const dayRemainderMs = absMs - intDays * MS_PER_DAY;
  const frac = Math.floor((dayRemainderMs * ATS_SCALE) / MS_PER_DAY);
  const kilo = Math.floor(intDays / 1000);
  let rem = intDays % 1000;
  const hecto = Math.floor(rem / 100);
  rem = rem % 100;
  const deka = Math.floor(rem / 10);
  const kin = rem % 10;
  return { sign, kilo, hecto, deka, kin, frac };
}

function pad(n, w) { return String(n).padStart(w, '0'); }
function toCanonical(a) {
  return `${a.sign} Δ ${a.kilo}.${a.hecto}.${a.deka}.${a.kin}.${pad(a.frac, ATS_DECIMALS)}`;
}
function toShort(a) {
  const bc = Math.floor(a.frac / Math.pow(10, ATS_DECIMALS - 2));
  const milli = Math.floor(a.frac / Math.pow(10, ATS_DECIMALS - 3)) % 10;
  return `Δ${a.kilo}.${a.hecto}.${a.deka}.${a.kin}-${pad(bc, 2)}.${milli}`;
}

const vectors = JSON.parse(readFileSync(resolve(repo, 'docs/spec/test-vectors.json'), 'utf-8')).vectors;

let pass = 0;
let fail = 0;
for (const v of vectors) {
  const ms = Date.parse(v.utc);
  const a = atsFromMs(ms);
  try {
    assert.equal(toCanonical(a), v.canonical, `canonical(${v.label})`);
    assert.equal(toShort(a), v.display, `display(${v.label})`);
    assert.equal(a.sign, v.sign, `sign(${v.label})`);
    assert.equal(a.kilo, v.kilo, `kilo(${v.label})`);
    assert.equal(a.hecto, v.hecto, `hecto(${v.label})`);
    assert.equal(a.deka, v.deka, `deka(${v.label})`);
    assert.equal(a.kin, v.kin, `kin(${v.label})`);
    assert.equal(a.frac, v.frac, `frac(${v.label})`);
    pass += 1;
  } catch (e) {
    fail += 1;
    console.error('FAIL', v.label, '\n ', e.message);
  }
}

console.log(`${pass}/${vectors.length} JS vectors pass`);
if (fail) process.exit(1);
