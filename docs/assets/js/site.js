/**
 * site.js — site-wide chrome (mobile hamburger menu).
 * Injected on every page; idempotent, no external deps.
 */
(function () {
  'use strict';

  function init() {
    const header = document.querySelector('header.site');
    if (!header) return;
    const nav = header.querySelector('nav');
    if (!nav) return;
    if (header.querySelector('.hamburger')) return; // already initialized

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

    // Auto-close after click on a link, only on mobile.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      if (window.matchMedia('(max-width: 600px)').matches) {
        setOpen(false);
      }
    });

    // Esc closes the menu.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
