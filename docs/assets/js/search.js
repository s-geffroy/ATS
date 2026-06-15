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

  // Defense-in-depth: Pagefind index data is built from sanitized markdown,
  // but escaping the plain-text fields (url, title) before injecting into
  // innerHTML keeps an XSS bug in an upstream Pagefind release from landing
  // here. it.excerpt stays raw — it intentionally carries Pagefind's <mark>.
  function escText(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escAttr(s) {
    return escText(s).replace(/"/g, '&quot;');
  }

  // CSS for .ats-search / .ats-search-results is now inlined in
  // docs/assets/css/style.css so the placeholder reaches its final
  // dimensions at first paint (CLS prevention). This is a no-op kept
  // for forward compatibility — if a page loads search.js without the
  // bundled style.css for some reason, search will work without polish.
  function ensureStyles() {
    // Intentionally empty.
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
        // it.excerpt is intentionally HTML (Pagefind injects <mark> for
        // hit highlighting); it.url and it.meta.title are plain text from
        // the static index — escape them defense-in-depth.
        results.innerHTML = items.map((it) => {
          const title = it.meta.title || it.url;
          return `
          <a href="${escAttr(it.url)}">
            <span class="title">${escText(title)}</span>
            <span>${it.excerpt}</span>
          </a>
        `;
        }).join('');
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
