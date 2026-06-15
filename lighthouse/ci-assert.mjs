#!/usr/bin/env node
/**
 * ci-assert.mjs — Lighthouse runner for CI.
 *
 * Boots a headless Chrome via `chrome-launcher`, runs Lighthouse on each
 * (page, form-factor) pair, persists the JSON reports to
 * lighthouse/ci-reports/, then asserts every category score is ≥ the
 * threshold defined below. Exits 1 with a readable summary if anything
 * falls short.
 *
 * Intended to run inside GitHub Actions on ubuntu-latest, with a static
 * file server already listening on http://127.0.0.1:8088. See
 * .github/workflows/lighthouse.yml.
 *
 * Env knobs:
 *   LIGHTHOUSE_BASE_URL  default http://127.0.0.1:8088 — point at the
 *                        deployed origin (https://s-geffroy.github.io/ATS)
 *                        for a prod measurement job.
 *   LIGHTHOUSE_RUNS      default 1 — number of runs per (page, form).
 *                        When > 1 each category's median score across runs
 *                        is what gets gated. CI sets RUNS=3 to tame the
 *                        ~20-point variance Lighthouse exhibits on small
 *                        single-page sites.
 *   LIGHTHOUSE_MIN_SCORE default 0.90 — gate threshold (0..1). The prod
 *                        job sets this higher (typically 0.95) because the
 *                        gzipped/CDN-served site outperforms localhost.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

// 4 pages that exercise the bulk of the site surface:
//   - /fr/ : analog clock + dynamic JS tick + tz-utils (heaviest UI)
//   - /fr/manifeste.html : pre-rendered Markdown spec page (longest content)
//   - /fr/cities.html : world-map view, 73 KB GeoJSON + per-city emoji
//   - /fr/faq.html : Markdown + Pagefind static search
const PAGES = [
  '/fr/index.html',
  '/fr/manifeste.html',
  '/fr/cities.html',
  '/fr/faq.html',
];

const FORM_FACTORS = ['mobile', 'desktop'];

// Categories Lighthouse returns by default that we gate on.
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const BASE_URL = process.env.LIGHTHOUSE_BASE_URL || 'http://127.0.0.1:8088';
const RUNS = Math.max(1, parseInt(process.env.LIGHTHOUSE_RUNS || '1', 10));
const MIN_SCORE = Number.parseFloat(process.env.LIGHTHOUSE_MIN_SCORE || '0.90');
const REPORTS_DIR = resolve(process.cwd(), 'lighthouse/ci-reports');

// `is-on-https` (Best Practices, weight 5/27) always scores 0 against
// http://127.0.0.1 — localhost can't legitimately serve HTTPS, but the
// deployed site at https://s-geffroy.github.io/ATS/ does. Skipping it on
// localhost prevents the BP gate from being unfairly capped ~0.81. The
// skip turns off automatically when LIGHTHOUSE_BASE_URL points at a
// public origin. See lighthouse/README.md § "Localhost vs deployed site".
const LOCAL_HOSTS = ['127.0.0.1', 'localhost', '[::1]'];
const LOCALHOST_SKIP_AUDITS = ['is-on-https'];
function isLocalhost(baseUrl) {
  try {
    const u = new URL(baseUrl);
    return u.protocol === 'http:' && LOCAL_HOSTS.includes(u.hostname);
  } catch { return false; }
}

async function runOne(chrome, url, formFactor) {
  // throttling=devtools mirrors Chrome DevTools' "Lighthouse" tab so local
  // and CI numbers align; 'mobile' applies the standard Moto G4 emulation.
  const flags = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: CATEGORIES,
    port: chrome.port,
    formFactor,
    screenEmulation: formFactor === 'mobile'
      ? { mobile: true,  width: 360, height: 640, deviceScaleFactor: 2, disabled: false }
      : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttlingMethod: 'simulate',
  };
  if (isLocalhost(BASE_URL)) flags.skipAudits = LOCALHOST_SKIP_AUDITS;
  const runnerResult = await lighthouse(url, flags);
  return runnerResult;
}

function shortSlug(page, form) {
  return page.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') + '-' + form;
}

// Median for variance-taming. For even counts we pick the lower of the two
// middle samples (conservative: the gate trips on the lower side).
function median(values) {
  const finite = values.filter(v => Number.isFinite(v)).slice().sort((a, b) => a - b);
  if (finite.length === 0) return null;
  return finite[Math.floor((finite.length - 1) / 2)];
}

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true });

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  const summary = [];

  console.log(
    `Lighthouse runner — base=${BASE_URL} runs=${RUNS} threshold=${(MIN_SCORE * 100) | 0}`
  );

  try {
    for (const page of PAGES) {
      for (const form of FORM_FACTORS) {
        const url = BASE_URL + page;
        const slug = shortSlug(page, form);
        const runScores = Object.fromEntries(CATEGORIES.map(c => [c, []]));
        const runReports = [];

        for (let i = 0; i < RUNS; i++) {
          const label = RUNS > 1 ? ` run ${i + 1}/${RUNS}` : '';
          process.stdout.write(`▶ ${page} (${form})${label} … `);
          const result = await runOne(chrome, url, form);

          const suffix = RUNS > 1 ? `-run${i + 1}` : '';
          await writeFile(`${REPORTS_DIR}/${slug}${suffix}.json`, result.report);

          const scores = {};
          for (const cat of CATEGORIES) {
            const c = result.lhr.categories[cat];
            const s = c ? c.score : null;
            scores[cat] = s;
            runScores[cat].push(s);
          }
          runReports.push(result.report);
          const fmt = CATEGORIES.map(c => `${c[0].toUpperCase()}:${(scores[c] ?? 0) * 100 | 0}`).join(' ');
          console.log(fmt);
        }

        const medianScores = {};
        for (const cat of CATEGORIES) medianScores[cat] = median(runScores[cat]);

        // Pick the run whose performance score equals the median Performance —
        // that's the artefact we keep as the canonical `slug.json` when RUNS > 1.
        let medianRunIdx = 0;
        if (RUNS > 1) {
          const target = medianScores.performance;
          medianRunIdx = runScores.performance.findIndex(s => s === target);
          if (medianRunIdx < 0) medianRunIdx = 0;
          await writeFile(`${REPORTS_DIR}/${slug}.json`, runReports[medianRunIdx]);
        }
        summary.push({ page, form, scores: medianScores, runScores, medianRunIdx });

        for (const cat of CATEGORIES) {
          const score = medianScores[cat];
          if (score == null || score < MIN_SCORE) {
            failures.push({ page, form, category: cat, score });
          }
        }
      }
    }
  } finally {
    await chrome.kill();
  }

  // Pretty table — median scores (when RUNS > 1, mins per category in
  // parentheses to surface the variance the median is hiding).
  console.log('\n────── Summary ──────');
  console.log('PAGE                          FORM      P    A    BP   SEO');
  for (const row of summary) {
    const cells = CATEGORIES.map(c => String(((row.scores[c] ?? 0) * 100) | 0).padStart(4));
    console.log(
      row.page.padEnd(30) +
      row.form.padEnd(10) +
      cells.join(' ')
    );
    if (RUNS > 1) {
      const mins = CATEGORIES.map(c => {
        const arr = row.runScores[c].filter(Number.isFinite);
        const lo = arr.length ? Math.min(...arr) : 0;
        return String((lo * 100) | 0).padStart(4);
      }).join(' ');
      console.log(' '.repeat(40) + mins + '   (min of ' + RUNS + ' runs)');
    }
  }

  if (failures.length === 0) {
    const note = RUNS > 1 ? ` median of ${RUNS} runs` : '';
    console.log(`\n✓ All ${summary.length} pairs ≥ ${(MIN_SCORE * 100) | 0}${note} on every gated category.`);
    process.exit(0);
  } else {
    console.log(`\n✗ ${failures.length} category score(s) below threshold ${(MIN_SCORE * 100) | 0}:`);
    for (const f of failures) {
      console.log(`  - ${f.page} (${f.form}) ${f.category}: ${((f.score ?? 0) * 100) | 0}`);
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(2);
});
