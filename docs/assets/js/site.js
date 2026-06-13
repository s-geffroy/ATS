/**
 * site.js — site-wide chrome (mobile hamburger menu + theme toggle).
 * Injected on every page; idempotent, no external deps.
 *
 * Theme toggle (§1.2):
 *   • 3 states: 'auto' (default, follows prefers-color-scheme), 'light', 'dark'.
 *   • Persisted in localStorage['ats-theme'].
 *   • Applied via documentElement.dataset.theme; CSS reads :root[data-theme=…].
 *   • A small flash is possible on first paint because this script is
 *     `defer`red — acceptable trade-off vs adding a per-page inline head
 *     script. To fully eliminate, inline the theme-apply block in each
 *     page <head> (deferred to a future commit).
 */
(function () {
  'use strict';

  const THEME_KEY = 'ats-theme';
  const THEMES = ['auto', 'light', 'dark'];
  const GLYPHS = { auto: '⊙', light: '☼', dark: '☾' };
  const LABELS = {
    en: { auto: 'Auto', light: 'Light', dark: 'Dark', toggle: 'Theme' },
    fr: { auto: 'Auto', light: 'Clair', dark: 'Sombre', toggle: 'Thème' },
  };

  function readTheme() {
    try {
      const v = localStorage.getItem(THEME_KEY);
      if (v === 'light' || v === 'dark' || v === 'auto') return v;
    } catch (e) {}
    return 'auto';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto' || !theme) {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = theme;
    }
  }

  // Apply ASAP — before init() — to minimize FOUC.
  applyTheme(readTheme());

  function initHamburger(header) {
    const nav = header.querySelector('nav');
    if (!nav) return;
    if (header.querySelector('.hamburger')) return;

    nav.id = nav.id || 'site-nav';

    const btn = document.createElement('button');
    btn.className = 'hamburger';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', nav.id);
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span aria-hidden="true">☰</span>';
    header.insertBefore(btn, nav);

    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('span').textContent = open ? '✕' : '☰';
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      if (window.matchMedia('(max-width: 600px)').matches) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  function initThemeToggle(header) {
    if (header.querySelector('.theme-toggle')) return;
    const langSwitch = header.querySelector('.lang-switch');
    const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
    const L = LABELS[lang];

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', L.toggle);
    btn.title = L.toggle;

    function render() {
      const t = readTheme();
      btn.dataset.themeState = t;
      btn.textContent = GLYPHS[t];
      btn.setAttribute('aria-label', L.toggle + ' (' + L[t] + ')');
      btn.title = L.toggle + ' — ' + L[t];
    }

    btn.addEventListener('click', function () {
      const cur = readTheme();
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
      render();
    });

    // Place the button just before .lang-switch, or at the end of the header
    // if no lang-switch exists on the page.
    if (langSwitch) {
      header.insertBefore(btn, langSwitch);
    } else {
      header.appendChild(btn);
    }
    render();
  }

  function init() {
    const header = document.querySelector('header.site');
    if (!header) return;
    initHamburger(header);
    initThemeToggle(header);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
