/**
 * test-vectors-page.js — controller for /{fr,en}/test-vectors.html.
 *
 * Loads the 7 vector JSON files from docs/spec/ and renders one
 * filterable, copyable table per dataset.
 */
(function () {
  'use strict';

  const lang = (document.body.dataset.lang || 'en').toLowerCase();
  const I18N = {
    en: {
      loading: 'Loading vector JSON…',
      missing: '(file not found)',
      filter: 'Filter…',
      copyRow: 'Copy JSON',
      copyCanonical: 'Copy canonical',
      copied: 'Copied.',
      copyFailed: 'Copy failed.',
      count: (n) => `${n} vector${n === 1 ? '' : 's'}`,
    },
    fr: {
      loading: 'Chargement des vecteurs…',
      missing: '(fichier introuvable)',
      filter: 'Filtrer…',
      copyRow: 'Copier JSON',
      copyCanonical: 'Copier canonique',
      copied: 'Copié.',
      copyFailed: 'Échec de la copie.',
      count: (n) => `${n} vecteur${n === 1 ? '' : 's'}`,
    },
  };
  const T = I18N[lang] || I18N.en;

  const SOURCES = [
    { key: 'core',     path: '../spec/test-vectors.json',                    title: 'Core (12) — instants' },
    { key: 'arith',    path: '../spec/test-vectors-arithmetic.json',         title: 'Arithmetic (12) — Δ/Δd algebra' },
    { key: 'hebrew',   path: '../spec/test-vectors-bridges-hebrew.json',     title: 'Bridge — Hebrew (10)' },
    { key: 'islamic',  path: '../spec/test-vectors-bridges-islamic.json',    title: 'Bridge — Islamic (10)' },
    { key: 'chinese',  path: '../spec/test-vectors-bridges-chinese.json',    title: 'Bridge — Chinese (10)' },
    { key: 'hindu',    path: '../spec/test-vectors-bridges-hindu.json',      title: 'Bridge — Hindu / Saka (10)' },
    { key: 'maya',     path: '../spec/test-vectors-bridges-maya.json',       title: 'Bridge — Maya Long Count (10)' },
    { key: 'mars',     path: '../spec/test-vectors-multi-planetary-mars.json', title: 'Multi-planetary — Mars (10)' },
    { key: 'moon',     path: '../spec/test-vectors-multi-planetary-moon.json', title: 'Multi-planetary — Moon (10)' },
  ];

  let toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    setTimeout(() => toastEl.classList.remove('visible'), 1400);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(T.copied);
    } catch (e) {
      toast(T.copyFailed);
    }
  }

  function pickCanonical(vector) {
    // The vector schemas vary; the canonical is one of these fields.
    return vector.canonical
        || vector.ats_canonical
        || (vector.expected && (vector.expected.canonical));
  }

  function renderDataset(source, payload) {
    const section = document.createElement('section');
    section.className = 'vec-card';
    const h2 = document.createElement('h2');
    h2.textContent = source.title;
    section.appendChild(h2);

    if (payload && payload.description) {
      const desc = document.createElement('p');
      desc.className = 'muted';
      desc.textContent = payload.description;
      section.appendChild(desc);
    }

    const filter = document.createElement('input');
    filter.type = 'search';
    filter.placeholder = T.filter;
    filter.className = 'vec-filter';
    section.appendChild(filter);

    if (!payload || !Array.isArray(payload.vectors)) {
      const err = document.createElement('p');
      err.className = 'status err';
      err.textContent = T.missing;
      section.appendChild(err);
      return section;
    }

    const count = document.createElement('p');
    count.className = 'muted';
    count.textContent = T.count(payload.vectors.length);
    section.appendChild(count);

    const wrap = document.createElement('div');
    wrap.className = 'vec-tablewrap';
    const table = document.createElement('table');
    table.className = 'vec-table';
    wrap.appendChild(table);
    section.appendChild(wrap);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    payload.vectors.forEach((v, idx) => {
      const row = document.createElement('tr');
      row.dataset.search = JSON.stringify(v).toLowerCase();

      const label = document.createElement('td');
      label.className = 'vec-label';
      label.textContent = v.label || `#${idx}`;
      row.appendChild(label);

      const canonical = document.createElement('td');
      canonical.className = 'vec-canonical';
      const c = pickCanonical(v) || '';
      canonical.textContent = c;
      row.appendChild(canonical);

      const json = document.createElement('td');
      json.className = 'vec-json';
      const pre = document.createElement('pre');
      pre.textContent = JSON.stringify(v, null, 2);
      json.appendChild(pre);
      row.appendChild(json);

      const actions = document.createElement('td');
      actions.className = 'vec-actions';
      if (c) {
        const b1 = document.createElement('button');
        b1.type = 'button';
        b1.textContent = T.copyCanonical;
        b1.addEventListener('click', () => copy(c));
        actions.appendChild(b1);
      }
      const b2 = document.createElement('button');
      b2.type = 'button';
      b2.textContent = T.copyRow;
      b2.addEventListener('click', () => copy(JSON.stringify(v, null, 2)));
      actions.appendChild(b2);
      row.appendChild(actions);

      tbody.appendChild(row);
    });

    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      Array.from(tbody.children).forEach((row) => {
        row.style.display = (!q || row.dataset.search.includes(q)) ? '' : 'none';
      });
    });

    return section;
  }

  async function boot() {
    const root = document.getElementById('vec-root');
    if (!root) return;

    const loading = document.createElement('p');
    loading.className = 'muted';
    loading.textContent = T.loading;
    root.appendChild(loading);

    const payloads = await Promise.all(
      SOURCES.map((s) =>
        fetch(s.path)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ),
    );

    root.removeChild(loading);
    SOURCES.forEach((s, i) => {
      root.appendChild(renderDataset(s, payloads[i]));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
