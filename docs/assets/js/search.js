/**
 * search.js — minimal Pagefind wrapper for FAQ and manifesto pages.
 *
 * Loads the Pagefind module lazily on first focus to avoid the ~30 KB
 * cold-start cost on pages that don't use search. Renders a simple
 * dropdown of results beneath the input. No external CSS used.
 *
 * Activation: include `<script src="../assets/js/search.js" defer></script>`
 * and add an element with `id="ats-search"` somewhere on the page.
 * The script injects an input + results container inside it.
 */
(function () {
  'use strict';

  const lang = (document.body.dataset.lang || 'en').toLowerCase();
  const L = {
    en: { placeholder: 'Search FAQ + manifesto…', empty: 'No results.', label: 'Search' },
    fr: { placeholder: 'Chercher FAQ + manifeste…', empty: 'Aucun résultat.', label: 'Rechercher' },
  }[lang] || { placeholder: 'Search…', empty: 'No results.', label: 'Search' };

  function pagefindPath() {
    const segments = location.pathname.split('/').filter(Boolean);
    return (segments[0] === 'ATS' ? '/ATS/' : '/') + '_pagefind/pagefind.js';
  }

  function ensureStyles() {
    if (document.getElementById('ats-search-style')) return;
    const css = `
      .ats-search { position: relative; margin: 0.75rem 0 1.5rem; }
      .ats-search input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--bg);
        color: var(--fg);
        font-family: inherit;
        font-size: 0.95rem;
      }
      .ats-search-results {
        position: absolute;
        top: 100%; left: 0; right: 0;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        margin-top: 4px;
        max-height: 360px;
        overflow-y: auto;
        z-index: 1500;
        display: none;
      }
      .ats-search-results.visible { display: block; }
      .ats-search-results a {
        display: block;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        color: var(--fg);
        border-bottom: 1px solid var(--border);
        font-size: 0.9rem;
      }
      .ats-search-results a:hover { background: var(--bg); }
      .ats-search-results .title { font-weight: 600; color: var(--accent); display: block; }
      .ats-search-results mark { background: color-mix(in oklab, var(--accent) 30%, transparent); color: inherit; }
      .ats-search-results .empty { padding: 0.6rem; color: var(--muted); }
    `;
    const tag = document.createElement('style');
    tag.id = 'ats-search-style';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function init() {
    let root = document.getElementById('ats-search');
    if (!root) {
      // Auto-insert at the top of <main> for pages that opt in by loading
      // this script but don't bother with the explicit container.
      const main = document.querySelector('main');
      if (!main) return;
      root = document.createElement('div');
      root.id = 'ats-search';
      main.insertBefore(root, main.firstChild);
    }
    if (root.dataset.bound === '1') return;
    root.dataset.bound = '1';
    root.classList.add('ats-search');
    ensureStyles();

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = L.placeholder;
    input.setAttribute('aria-label', L.label);

    const results = document.createElement('div');
    results.className = 'ats-search-results';

    root.appendChild(input);
    root.appendChild(results);

    let pagefindMod = null;
    let pending = null;
    async function loadPagefind() {
      if (pagefindMod) return pagefindMod;
      if (pending) return pending;
      pending = import(pagefindPath()).then((m) => {
        pagefindMod = m;
        if (typeof m.init === 'function') return m.init().then(() => m);
        return m;
      }).catch(() => null);
      return pending;
    }

    let lastQuery = '';
    let inflight = 0;
    async function doSearch(q) {
      const myInflight = ++inflight;
      const mod = await loadPagefind();
      if (!mod) {
        results.innerHTML = '';
        results.classList.remove('visible');
        return;
      }
      if (myInflight !== inflight) return;
      const out = await mod.search(q);
      if (myInflight !== inflight) return;
      const items = await Promise.all(out.results.slice(0, 8).map((r) => r.data()));
      if (myInflight !== inflight) return;

      if (!items.length) {
        results.innerHTML = `<div class="empty">${L.empty}</div>`;
      } else {
        results.innerHTML = items.map((it) => `
          <a href="${it.url}">
            <span class="title">${it.meta.title || it.url}</span>
            <span>${it.excerpt}</span>
          </a>
        `).join('');
      }
      results.classList.add('visible');
    }

    let debounce = null;
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (debounce) clearTimeout(debounce);
      if (!q) {
        results.classList.remove('visible');
        results.innerHTML = '';
        return;
      }
      if (q === lastQuery) return;
      lastQuery = q;
      debounce = setTimeout(() => doSearch(q), 120);
    });

    input.addEventListener('focus', () => loadPagefind());
    document.addEventListener('click', (ev) => {
      if (!root.contains(ev.target)) {
        results.classList.remove('visible');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
