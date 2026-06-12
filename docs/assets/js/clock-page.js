/**
 * clock-page.js — shared controller for /fr/index.html and /en/index.html.
 * Reads <body data-lang="fr|en"> to pick UI strings.
 *
 * Features:
 *   • Live tick (10 Hz) of the Δ ATS short / canonical / per-unit values.
 *   • Permalink: `?t=<canonical>` or `?utc=<ISO>` freezes the clock at that instant.
 *   • Click the big short / canonical value to copy it (toast notification).
 *   • Keyboard shortcuts (when no input focused):
 *       C       — copy short
 *       Shift+C — copy canonical
 *       D       — toggle details panel
 *       N       — return to live mode (clears permalink)
 *       L       — switch language FR ↔ EN
 *   • Bidirectional Gregorian ↔ ATS converter.
 */

(function () {
  'use strict';

  const lang = (document.body.dataset.lang || 'en').toLowerCase();

  const I18N = {
    en: {
      gregInvalid: 'Invalid Gregorian date.',
      atsInvalid: 'Invalid canonical ATS.',
      gtoa: 'OK: converted to ATS.',
      atog: 'OK: converted to Gregorian (UTC).',
      loadedNow: 'Loaded current instant.',
      copied: 'Copied.',
      copyFailed: 'Copy failed.',
      frozen: (s) => `Frozen at ${s}`,
      back2live: 'Back to live time.',
      shortcuts: 'Shortcuts: C copy short · Shift+C canonical · D details · N now · L lang',
      otherLangHref: '../fr/',
    },
    fr: {
      gregInvalid: 'Date grégorienne invalide.',
      atsInvalid: 'ATS canonique invalide.',
      gtoa: 'OK : converti vers ATS.',
      atog: 'OK : converti vers Grégorien (UTC).',
      loadedNow: 'Maintenant chargé.',
      copied: 'Copié.',
      copyFailed: 'Échec de la copie.',
      frozen: (s) => `Figé à ${s}`,
      back2live: 'Retour au temps live.',
      shortcuts: 'Raccourcis : C copier court · Maj+C canonique · D détails · N maintenant · L langue',
      otherLangHref: '../en/',
    },
  };

  const T = I18N[lang] || I18N.en;

  // -------- DOM refs --------
  const shortEl = document.getElementById('shortDisplay');
  const utcEl   = document.getElementById('utcDisplay');
  const canonEl = document.getElementById('canonDisplay');
  const utcFull = document.getElementById('utcFull');
  const localEl = document.getElementById('localDisplay');
  const uKiloEl  = document.getElementById('uKilo');
  const uHectoEl = document.getElementById('uHecto');
  const uDekaEl  = document.getElementById('uDeka');
  const uKinEl   = document.getElementById('uKin');
  const uTotalEl = document.getElementById('uTotal');
  const gregInput = document.getElementById('gregInput');
  const atsInput  = document.getElementById('atsInput');
  const statusEl  = document.getElementById('status');
  const detailsEl = document.querySelector('.clock-card details');

  // -------- Toast --------
  let toastEl = null;
  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
    return toastEl;
  }
  let toastTimer = null;
  function toast(message) {
    const el = ensureToast();
    el.textContent = message;
    el.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 1400);
  }

  // -------- Clipboard --------
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast(T.copied);
    } catch (e) {
      toast(T.copyFailed);
    }
  }

  // -------- Status helper --------
  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'status ' + (ok === false ? 'err' : 'ok');
  }

  // -------- Format helpers --------
  function fmtUTC(d) {
    return d.getUTCFullYear() + '-' +
      String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(d.getUTCDate()).padStart(2, '0') + ' ' +
      String(d.getUTCHours()).padStart(2, '0') + ':' +
      String(d.getUTCMinutes()).padStart(2, '0') + ':' +
      String(d.getUTCSeconds()).padStart(2, '0') + 'Z';
  }

  function applyAtsToDom(ats, dateForDisplay) {
    shortEl.textContent  = ATS.toShort(ats);
    utcEl.textContent    = fmtUTC(dateForDisplay);
    canonEl.textContent  = ATS.toCanonical(ats);
    utcFull.textContent  = dateForDisplay.toISOString();
    localEl.textContent  = dateForDisplay.toString();
    uKiloEl.textContent  = ats.kilo;
    uHectoEl.textContent = ats.hecto;
    uDekaEl.textContent  = ats.deka;
    uKinEl.textContent   = ats.kin;
    const totalDays = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin;
    uTotalEl.textContent = totalDays.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') +
      (lang === 'fr' ? ' j' : ' d');
  }

  // -------- Frozen / live mode --------
  let frozenAtMs = null; // null = live
  let tickHandle = null;

  function liveTick() {
    const now = new Date();
    applyAtsToDom(ATS.atsFromMs(now.getTime()), now);
  }

  function freezeAt(ms, sourceLabel) {
    frozenAtMs = ms;
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
    const d = new Date(ms);
    applyAtsToDom(ATS.atsFromMs(ms), d);
    setStatus(T.frozen(sourceLabel || d.toISOString()), true);
    if (detailsEl && !detailsEl.open) detailsEl.open = true;
  }

  function goLive() {
    frozenAtMs = null;
    if (tickHandle) clearInterval(tickHandle);
    liveTick();
    tickHandle = setInterval(liveTick, 100);
    setStatus(T.back2live, true);
    // Clean URL
    const u = new URL(window.location.href);
    u.searchParams.delete('t');
    u.searchParams.delete('utc');
    window.history.replaceState(null, '', u.pathname);
  }

  // -------- Permalink (?t=canonical, ?utc=ISO) --------
  function applyPermalink() {
    const u = new URL(window.location.href);
    const t = u.searchParams.get('t');
    const utc = u.searchParams.get('utc');
    if (t) {
      // Accept short forms like "20.7.8.0.43210" (default sign T+) and full canonical.
      const canonical = /^\s*T[+-]\s*Δ/.test(t) ? t : ('T+ Δ ' + t);
      const ms = ATS.canonicalToMs(canonical);
      if (ms !== null) {
        freezeAt(ms, ATS.toCanonical(ATS.atsFromMs(ms)));
        return true;
      }
    }
    if (utc) {
      const ms = Date.parse(utc);
      if (!isNaN(ms)) {
        freezeAt(ms, new Date(ms).toISOString());
        return true;
      }
    }
    return false;
  }

  // -------- Click-to-copy --------
  function bindClickToCopy() {
    function setupCopyable(el) {
      if (!el) return;
      el.style.cursor = 'pointer';
      el.title = T.shortcuts;
      el.addEventListener('click', () => copyText(el.textContent.trim()));
    }
    setupCopyable(shortEl);
    setupCopyable(canonEl);
  }

  // -------- Keyboard shortcuts --------
  function bindShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'c') {
        e.preventDefault();
        copyText(e.shiftKey ? canonEl.textContent.trim() : shortEl.textContent.trim());
      } else if (k === 'd') {
        e.preventDefault();
        if (detailsEl) detailsEl.open = !detailsEl.open;
      } else if (k === 'n') {
        e.preventDefault();
        goLive();
      } else if (k === 'l') {
        e.preventDefault();
        window.location.href = T.otherLangHref;
      }
    });
  }

  // -------- Converter --------
  function bindConverter() {
    const btnG = document.getElementById('btnGtoA');
    const btnA = document.getElementById('btnAtoG');
    const btnN = document.getElementById('btnNow');
    if (btnG) btnG.addEventListener('click', () => {
      const ms = Date.parse(gregInput.value.trim());
      if (isNaN(ms)) { setStatus(T.gregInvalid, false); return; }
      atsInput.value = ATS.toCanonical(ATS.atsFromMs(ms));
      setStatus(T.gtoa, true);
    });
    if (btnA) btnA.addEventListener('click', () => {
      const ms = ATS.canonicalToMs(atsInput.value.trim());
      if (ms === null) { setStatus(T.atsInvalid, false); return; }
      gregInput.value = new Date(ms).toISOString();
      setStatus(T.atog, true);
    });
    if (btnN) btnN.addEventListener('click', () => {
      const now = new Date();
      gregInput.value = now.toISOString();
      atsInput.value  = ATS.toCanonical(ATS.atsFromMs(now.getTime()));
      setStatus(T.loadedNow, true);
    });
  }

  // -------- Boot --------
  function boot() {
    bindClickToCopy();
    bindShortcuts();
    bindConverter();
    if (!applyPermalink()) {
      goLive();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
