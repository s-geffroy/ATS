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

// Threshold per category. v1.0 gate is 90 everywhere; lower it here only
// if a measurable, documented constraint justifies it.
const MIN_SCORE = 0.90;

// Categories Lighthouse returns by default that we gate on.
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const BASE_URL = process.env.LIGHTHOUSE_BASE_URL || 'http://127.0.0.1:8088';
const REPORTS_DIR = resolve(process.cwd(), 'lighthouse/ci-reports');

// Audits we skip when the target is a local HTTP server — they always fail
// against http://127.0.0.1 for environmental reasons, not real regressions:
//   • `is-on-https` (Best Practices, weight 5/27) — localhost can't
//     legitimately serve HTTPS in CI.
//   • `uses-text-compression` (Performance) — Python's `http.server` does
//     not emit `Content-Encoding: gzip`, but GitHub Pages prod does.
// Without these skips the gates are unfair (BP capped ~0.81, Perf ~75-80
// even when the prod-deployed site scores ≥ 90 on the same code).
// The deployed s-geffroy.github.io site IS HTTPS and IS gzipped — leave the
// audits ON whenever LIGHTHOUSE_BASE_URL points at a public origin. See
// lighthouse/README.md § "Localhost vs deployed site".
const LOCAL_HOSTS = ['127.0.0.1', 'localhost', '[::1]'];
const LOCALHOST_SKIP_AUDITS = ['is-on-https', 'uses-text-compression'];
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

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true });

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  const summary = [];

  try {
    for (const page of PAGES) {
      for (const form of FORM_FACTORS) {
        const url = BASE_URL + page;
        process.stdout.write(`▶ ${page} (${form}) … `);
        const result = await runOne(chrome, url, form);

        const slug = shortSlug(page, form);
        await writeFile(`${REPORTS_DIR}/${slug}.json`, result.report);

        const scores = {};
        for (const cat of CATEGORIES) {
          const c = result.lhr.categories[cat];
          scores[cat] = c ? c.score : null;
        }
        summary.push({ page, form, scores });

        for (const cat of CATEGORIES) {
          const score = scores[cat];
          if (score == null || score < MIN_SCORE) {
            failures.push({ page, form, category: cat, score });
          }
        }
        const fmt = CATEGORIES.map(c => `${c[0].toUpperCase()}:${(scores[c] ?? 0) * 100 | 0}`).join(' ');
        console.log(fmt);
      }
    }
  } finally {
    await chrome.kill();
  }

  // Pretty table
  console.log('\n────── Summary ──────');
  console.log('PAGE                          FORM      P    A    BP   SEO');
  for (const row of summary) {
    const cells = CATEGORIES.map(c => String(((row.scores[c] ?? 0) * 100) | 0).padStart(4));
    console.log(
      row.page.padEnd(30) +
      row.form.padEnd(10) +
      cells.join(' ')
    );
  }

  if (failures.length === 0) {
    console.log(`\n✓ All ${summary.length} runs ≥ ${MIN_SCORE * 100} on every gated category.`);
    process.exit(0);
  } else {
    console.log(`\n✗ ${failures.length} category score(s) below threshold ${MIN_SCORE * 100}:`);
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
