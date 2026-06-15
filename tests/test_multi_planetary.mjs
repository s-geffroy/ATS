// Conformance test — JS multi-planetary annex (spec §3) against
// docs/spec/test-vectors-multi-planetary-{mars,moon}.json.
//
// Run with:  node tests/test_multi_planetary.mjs
//
// Loads docs/assets/js/ats.js into a `node:vm` context (same pattern as
// test_arithmetic.mjs) so the file under test is the actual shipped
// bundle, not a fresh copy.

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
assert.ok(ATS && typeof ATS.utcMsToBody === 'function', 'ATS.utcMsToBody must be exposed');
assert.ok(ATS.MARS && ATS.MOON && ATS.EARTH, 'ATS.{EARTH,MARS,MOON} must be exposed');

function runVectorFile(path, body) {
  const data = JSON.parse(readFileSync(resolve(repo, path), 'utf-8'));
  let pass = 0, fail = 0;
  for (const v of data.vectors) {
    const ms = Date.parse(v.utc);
    const b = ATS.utcMsToBody(ms, body);
    try {
      assert.equal(ATS.bodyToCanonical(b), v.ats_canonical, `${path} :: ${v.label}`);
      pass += 1;
    } catch (e) {
      fail += 1;
      console.error('FAIL', v.label, '\n ', e.message);
    }
  }
  return { pass, fail, total: data.vectors.length };
}

const mars = runVectorFile('docs/spec/test-vectors-multi-planetary-mars.json', ATS.MARS);
console.log(`${mars.pass}/${mars.total} Mars vectors pass`);

const moon = runVectorFile('docs/spec/test-vectors-multi-planetary-moon.json', ATS.MOON);
console.log(`${moon.pass}/${moon.total} Moon vectors pass`);

// Extra coverage: epoch instants land on T+ Δ_X 0.0.0.0.00000.
let extras = 0;
const cases = [
  { body: ATS.EARTH, epochIso: '1969-07-20T00:00:00Z' },
  { body: ATS.MARS,  epochIso: '1997-07-04T16:56:55Z' },
  { body: ATS.MOON,  epochIso: '1969-07-20T00:00:00Z' },
];
for (const c of cases) {
  const b = ATS.utcMsToBody(Date.parse(c.epochIso), c.body);
  assert.equal(b.sign, 'T+');
  assert.equal(b.kilo + b.hecto + b.deka + b.kin + b.frac, 0,
    `epoch ${c.body.ascii} must land on 0.0.0.0.00000`);
  extras += 1;
}

// Cross-body arithmetic and comparison must throw (spec §5).
const earthNow = ATS.utcMsToEarth(Date.parse('2026-06-13T12:00:00Z'));
const marsNow  = ATS.utcMsToMars(Date.parse('2026-06-13T12:00:00Z'));
assert.throws(() => ATS.bodySub(earthNow, marsNow), /Cross-body/);
extras += 1;

// Δ_X + Δd → Δ_X round-trip.
const oneSol = ATS.dur(1);
const marsPlus = ATS.bodyAdd(marsNow, oneSol);
const back = ATS.bodySub(marsPlus, marsNow);
assert.equal(back.signedDays, 1, '(Δ_Mars + 1) − Δ_Mars must equal Δd 1');
extras += 1;

// Canonical round-trip via parser.
const marsCanon = ATS.bodyToCanonical(marsNow);
const ms2 = ATS.bodyCanonicalToUtcMs(marsCanon);
const drift = Math.abs(ms2 - Date.parse('2026-06-13T12:00:00Z'));
assert.ok(drift < 86400, `Mars canonical round-trip drift ${drift} ms exceeds 1 day`);
extras += 1;

// Bare Δ parses as Earth (backward compat with v0.6).
const bareDelta = ATS.bodyCanonicalToUtcMs('T+ Δ 20.7.8.2.50000');
assert.equal(bareDelta, Date.parse('2026-06-13T12:00:00Z'),
  'Bare Δ MUST parse as Earth (spec §0.3)');
extras += 1;

const totalPass = mars.pass + moon.pass + extras;
const totalAll  = mars.total + moon.total + extras;
console.log(`${extras} algebra/epoch extras pass`);
console.log(`${totalPass}/${totalAll} multi-planetary checks pass`);

if (mars.fail || moon.fail) process.exit(1);
