#!/usr/bin/env node
/**
 * render-md.mjs — pre-render the 8 Markdown spec pages into HTML fragments
 * and inline them into the matching docs/{fr,en}/*.html shells.
 *
 * Removes the runtime <script src=".../marked"></script> +
 * <script src=".../dompurify"></script> + the inline fetch block on each
 * touched HTML page, and tightens the CSP <meta> by dropping
 * cdn.jsdelivr.net from script-src/style-src on those pages only.
 *
 * Idempotent: subsequent runs detect the <!-- ATS:INLINE <src> --> marker
 * left inside #content and re-render in place.
 *
 * Usage (Docker, no local install):
 *   docker run --rm -v "$PWD:/app" -w /app/scripts node:20-slim \
 *     sh -c 'npm install --no-save --silent && node render-md.mjs'
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve as resolvePath, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolvePath(__dirname, '..');
const DOCS_DIR = resolvePath(REPO_ROOT, 'docs');
const SPEC_DIR = resolvePath(DOCS_DIR, 'spec');
const RENDERED_DIR = resolvePath(SPEC_DIR, '_rendered');

// HTML page -> spec MD relative path (inside docs/spec/).
const TARGETS = [
  ['fr/manifeste.html',     'manifesto.fr.md'],
  ['fr/philosophie.html',   'philosophy.fr.md'],
  ['fr/comparaison.html',   'comparison.fr.md'],
  ['fr/faq.html',           'faq.fr.md'],
  ['fr/conventions.html',   'conventions.fr.md'],
  ['en/manifesto.html',     'manifesto.en.md'],
  ['en/philosophy.html',    'philosophy.en.md'],
  ['en/comparison.html',    'comparison.en.md'],
  ['en/faq.html',           'faq.en.md'],
  ['en/conventions.html',   'conventions.en.md'],
];

marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });

function renderMd(source) {
  const raw = marked.parse(source);
  return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
}

function inlineIntoHtml(html, mdRelPath, renderedHtml) {
  const marker = `<!-- ATS:INLINE ${mdRelPath} -->`;
  const articleOpen = /<article\s+id="content"[^>]*>/i;
  const m = articleOpen.exec(html);
  if (!m) {
    throw new Error('Could not locate <article id="content"> in target HTML');
  }
  const openTag = m[0];
  const startIdx = m.index;
  // Find matching closing </article> — the article block contains only the
  // markdown shell; no nested article expected.
  const closeIdx = html.indexOf('</article>', startIdx + openTag.length);
  if (closeIdx === -1) {
    throw new Error('Could not locate closing </article> for #content');
  }
  const before = html.slice(0, startIdx);
  const after = html.slice(closeIdx + '</article>'.length);
  const newArticle = `${openTag}\n${marker}\n${renderedHtml}\n</article>`;
  let result = before + newArticle + after;

  // Drop the two CDN script tags for marked + dompurify (whatever the
  // current pinned version is).
  result = result.replace(
    /\s*<script[^>]+cdn\.jsdelivr\.net\/npm\/(?:marked|dompurify)[^>]+><\/script>/gi,
    '',
  );

  // Drop the runtime fetch+sanitize block (marker-aware: only remove the
  // `<script>...fetch('../spec/...md')...</script>` we put there).
  result = result.replace(
    /\s*<script>\s*fetch\([^]*?\.md['"][^]*?<\/script>/g,
    '',
  );

  // Tighten the CSP on this page: cdn.jsdelivr.net is no longer required
  // for script-src or style-src (marked/dompurify gone). Leave 'unsafe-inline'
  // in place because the clock pages still rely on it.
  result = result.replace(
    /(<meta\s+http-equiv="Content-Security-Policy"\s+content=")([^"]+)(")/,
    (_m, prefix, content, suffix) => {
      const cleaned = content.replace(/\s+https:\/\/cdn\.jsdelivr\.net/g, '');
      return prefix + cleaned + suffix;
    },
  );

  return result;
}

async function main() {
  await mkdir(RENDERED_DIR, { recursive: true });

  let totalSavedScripts = 0;
  for (const [htmlRel, mdRel] of TARGETS) {
    const htmlPath = resolvePath(DOCS_DIR, htmlRel);
    const mdPath = resolvePath(SPEC_DIR, mdRel);
    const md = await readFile(mdPath, 'utf8');
    const rendered = renderMd(md);

    // Write the standalone fragment.
    const fragPath = resolvePath(RENDERED_DIR, mdRel.replace(/\.md$/, '.html'));
    await writeFile(fragPath, rendered + '\n', 'utf8');

    // Inline into the HTML shell.
    const html = await readFile(htmlPath, 'utf8');
    const before = html.length;
    const beforeScripts = (html.match(/cdn\.jsdelivr\.net\/npm\/(?:marked|dompurify)/g) || []).length;
    const next = inlineIntoHtml(html, mdRel, rendered);
    await writeFile(htmlPath, next, 'utf8');
    totalSavedScripts += beforeScripts;
    console.log(`✓ ${htmlRel}  ←  spec/${mdRel}  (${before}→${next.length} B, CDN scripts removed: ${beforeScripts})`);
  }
  console.log(`\nTotal CDN <script> tags removed: ${totalSavedScripts}`);
  console.log(`Fragments written to ${relative(REPO_ROOT, RENDERED_DIR)}/`);
}

main().catch((err) => {
  console.error('render-md failed:', err);
  process.exit(1);
});
