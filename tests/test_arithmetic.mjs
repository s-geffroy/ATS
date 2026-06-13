// Conformance test — JS implementation of Δ/Δd algebra (spec §11.4)
// against docs/spec/test-vectors-arithmetic.json.
//
// Run with:  node tests/test_arithmetic.mjs
//
// Loads docs/assets/js/ats.js into a `node:vm` context (the IIFE binds
// to `globalThis.ATS` when `window` is absent), avoiding duplication.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');

const sourceCode = readFileSync(resolve(repo, 'docs/assets/js/ats.js'), 'utf-8');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(sourceCode, ctx);
const ATS = ctx.ATS;
assert.ok(ATS && typeof ATS.add === 'function', 'ATS.add must be exposed from ats.js');

const ATS_SCALE = 100000;

function parseAts(str) {
  const m = /^\s*(T[+-])\s*Δ\s+(\d+)\.(\d)\.(\d)\.(\d)\.(\d+)\s*$/.exec(str);
  if (!m) throw new Error(`Bad canonical: ${str}`);
  const fracStr = m[6].slice(0, 5).padEnd(5, '0');
  return {
    sign: m[1],
    kilo: parseInt(m[2], 10),
    hecto: parseInt(m[3], 10),
    deka: parseInt(m[4], 10),
    kin: parseInt(m[5], 10),
    frac: parseInt(fracStr, 10),
  };
}

function materialize(op) {
  if (op.kind === 'ats') return parseAts(op.canonical);
  if (op.kind === 'dur') {
    if (op.signed_days !== undefined) return ATS.dur(Number(op.signed_days));
    return ATS.durFromCanonical(op.canonical);
  }
  if (op.kind === 'scalar') return op.value;
  if (op.kind === 'bool') return op.value;
  throw new Error(`Unknown kind: ${op.kind}`);
}

function runOp(op, lhs, rhs) {
  switch (op) {
    case 'add': return ATS.add(lhs, rhs);
    case 'sub': return ATS.sub(lhs, rhs);
    case 'mul': return ATS.mul(lhs, rhs);
    case 'div': return ATS.div(lhs, rhs);
    case 'lt':  return ATS.lt(lhs, rhs);
    case 'le':  return ATS.le(lhs, rhs);
    case 'eq':  return ATS.eq(lhs, rhs);
    case 'gt':  return ATS.gt(lhs, rhs);
    case 'ge':  return ATS.ge(lhs, rhs);
    default: throw new Error(`Unknown op: ${op}`);
  }
}

function expectedCanonical(expected) {
  if (expected.kind === 'ats') return expected.canonical;
  if (expected.kind === 'dur') {
    if (expected.canonical) return expected.canonical;
    return ATS.durToCanonical(ATS.dur(Number(expected.signed_days)));
  }
  throw new Error(`No canonical for ${expected.kind}`);
}

const vectors = JSON.parse(
  readFileSync(resolve(repo, 'docs/spec/test-vectors-arithmetic.json'), 'utf-8'),
).vectors;

let pass = 0, fail = 0;
for (const v of vectors) {
  const lhs = materialize(v.lhs);
  const rhs = materialize(v.rhs);
  try {
    const got = runOp(v.op, lhs, rhs);
    if (v.expected.kind === 'bool') {
      assert.equal(got, v.expected.value, v.label);
    } else {
      const gotCanonical = v.expected.kind === 'ats'
        ? ATS.toCanonical(got)
        : ATS.durToCanonical(got);
      assert.equal(gotCanonical, expectedCanonical(v.expected), v.label);
    }
    pass += 1;
  } catch (e) {
    fail += 1;
    console.error('FAIL', v.label, '\n ', e.message);
  }
}

// Extra: sign-zero equality + duration neg/abs round trip.
const plusZero = parseAts('T+ Δ 0.0.0.0.00000');
const minusZero = parseAts('T- Δ 0.0.0.0.00000');
try {
  assert.equal(ATS.eq(plusZero, minusZero), true, 'T+0 == T-0');
  const d = ATS.dur(1.5);
  assert.equal(ATS.neg(d).signedDays, -1.5, '-Δd');
  assert.equal(ATS.abs(ATS.neg(d)).signedDays, 1.5, '|−Δd|');
  pass += 3;
} catch (e) {
  fail += 1;
  console.error('FAIL extras\n ', e.message);
}

console.log(`${pass}/${vectors.length + 3} JS arithmetic vectors pass`);
if (fail) process.exit(1);
