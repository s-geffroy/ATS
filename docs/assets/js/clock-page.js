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

  // Analog face
  const handBloc      = document.getElementById('hand-bloc');
  const handCenti     = document.getElementById('hand-centi');
  const handMilli     = document.getElementById('hand-milli');
  const analogDateEl  = document.getElementById('analog-date');
  const utcDisplayAnalogEl = document.getElementById('utcDisplayAnalog');
  const tabNumeric    = document.getElementById('tab-numeric');
  const tabAnalog     = document.getElementById('tab-analog');
  const faceNumeric   = document.getElementById('face-numeric');
  const faceAnalog    = document.getElementById('face-analog');
  const faceToggleEl  = document.querySelector('.face-toggle');
  const strictCb      = document.getElementById('strictAnalog');

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
    updateAnalog(ats, dateForDisplay);
  }

  // -------- Analog face --------
  const STRICT_KEY = 'ats-strict-analog';
  let strictMode = false;
  try { strictMode = localStorage.getItem(STRICT_KEY) === '1'; } catch (e) {}
  if (strictCb) {
    strictCb.checked = strictMode;
    strictCb.addEventListener('change', function () {
      strictMode = strictCb.checked;
      try { localStorage.setItem(STRICT_KEY, strictMode ? '1' : '0'); } catch (e) {}
    });
  }

  function buildAnalogTicks() {
    const group = document.getElementById('analog-ticks');
    if (!group || group.childElementCount > 0) return;
    const NS = 'http://www.w3.org/2000/svg';
    // 100 ticks (10 major + 90 minor)
    for (let i = 0; i < 100; i++) {
      const isMajor = i % 10 === 0;
      const a = (i / 100) * Math.PI * 2 - Math.PI / 2;
      const r1 = isMajor ? 84 : 91;
      const t = document.createElementNS(NS, 'line');
      t.setAttribute('x1', (Math.cos(a) * r1).toFixed(2));
      t.setAttribute('y1', (Math.sin(a) * r1).toFixed(2));
      t.setAttribute('x2', (Math.cos(a) * 96).toFixed(2));
      t.setAttribute('y2', (Math.sin(a) * 96).toFixed(2));
      t.setAttribute('stroke', 'currentColor');
      t.setAttribute('stroke-width', isMajor ? '2' : '1');
      t.setAttribute('opacity', isMajor ? '0.75' : '0.3');
      group.appendChild(t);
    }
    // Labels 0..9 at radius 76 (between Centi tip 70 and Bloc tip 88)
    for (let n = 0; n < 10; n++) {
      const a = (n / 10) * Math.PI * 2 - Math.PI / 2;
      const lab = document.createElementNS(NS, 'text');
      lab.setAttribute('x', (Math.cos(a) * 76).toFixed(2));
      lab.setAttribute('y', (Math.sin(a) * 76 + 4).toFixed(2));
      lab.setAttribute('text-anchor', 'middle');
      lab.setAttribute('font-family', 'ui-monospace, Menlo, Consolas, monospace');
      lab.setAttribute('font-size', '12');
      lab.setAttribute('fill', 'currentColor');
      lab.setAttribute('opacity', '0.6');
      lab.textContent = String(n);
      group.appendChild(lab);
    }
  }

  function updateAnalog(ats, d) {
    if (!handBloc) return;
    const f = ats.frac / 100000;            // day-fraction in [0, 1)
    const blocPos  = Math.floor(f * 10);
    const centiPos = Math.floor(f * 100) % 10;
    const milliRaw = (f * 1000) % 10;
    const milliPos = strictMode ? Math.floor(milliRaw) : milliRaw;
    handBloc.setAttribute('transform',  'rotate(' + (blocPos  * 36).toFixed(3) + ')');
    handCenti.setAttribute('transform', 'rotate(' + (centiPos * 36).toFixed(3) + ')');
    handMilli.setAttribute('transform', 'rotate(' + (milliPos * 36).toFixed(3) + ')');
    if (analogDateEl) {
      analogDateEl.textContent = 'Δ ' + ats.kilo + '.' + ats.hecto + '.' + ats.deka + '.' + ats.kin;
    }
    if (utcDisplayAnalogEl) utcDisplayAnalogEl.textContent = fmtUTC(d);
  }

  // -------- Face toggle (numeric ↔ analog) --------
  const FACE_KEY = 'ats-face';
  let currentFace = 'numeric';
  try {
    const saved = localStorage.getItem(FACE_KEY);
    if (saved === 'analog' || saved === 'numeric') currentFace = saved;
  } catch (e) {}

  function selectFace(face) {
    if (face !== 'numeric' && face !== 'analog') face = 'numeric';
    currentFace = face;
    try { localStorage.setItem(FACE_KEY, face); } catch (e) {}
    if (faceNumeric) faceNumeric.hidden = face !== 'numeric';
    if (faceAnalog)  faceAnalog.hidden  = face !== 'analog';
    if (tabNumeric) {
      tabNumeric.setAttribute('aria-selected', face === 'numeric' ? 'true' : 'false');
      tabNumeric.setAttribute('tabindex', face === 'numeric' ? '0' : '-1');
    }
    if (tabAnalog) {
      tabAnalog.setAttribute('aria-selected', face === 'analog' ? 'true' : 'false');
      tabAnalog.setAttribute('tabindex', face === 'analog' ? '0' : '-1');
    }
  }

  if (tabNumeric) tabNumeric.addEventListener('click', function () { selectFace('numeric'); });
  if (tabAnalog)  tabAnalog.addEventListener('click', function () { selectFace('analog'); });

  if (faceToggleEl) {
    faceToggleEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = currentFace === 'numeric' ? 'analog' : 'numeric';
        selectFace(next);
        (next === 'numeric' ? tabNumeric : tabAnalog).focus();
      }
    });
  }

  buildAnalogTicks();
  selectFace(currentFace);

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
