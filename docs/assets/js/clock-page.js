/**
 * clock-page.js — shared controller for /fr/index.html and /en/index.html.
 * Reads <body data-lang="fr|en"> to pick UI strings.
 *
 * Features:
 *   • Live tick (10 Hz) of the Δ ATS short / canonical / per-unit values.
 *   • Permalink: `?t=<canonical>` or `?utc=<ISO>` freezes the clock at that instant.
 *     Optional `?face=numeric|analog` overrides the saved face for this visit
 *     only (does not write to localStorage).
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
  const uBlocEl  = document.getElementById('uBloc');
  const uCentiEl = document.getElementById('uCenti');
  const uMilliEl = document.getElementById('uMilli');
  const uBeatEl  = document.getElementById('uBeat');
  const uBlinkEl = document.getElementById('uBlink');
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
  const atsReadoutEl  = document.getElementById('atsReadout');
  const cityListEl    = document.getElementById('city-list');
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
    // Micro units share the same digits as the analog readout
    const fr = ats.frac;
    if (uBlocEl)  uBlocEl.textContent  = Math.floor(fr / 10000);
    if (uCentiEl) uCentiEl.textContent = Math.floor(fr / 1000) % 10;
    if (uMilliEl) uMilliEl.textContent = Math.floor(fr / 100)  % 10;
    if (uBeatEl)  uBeatEl.textContent  = Math.floor(fr / 10)   % 10;
    if (uBlinkEl) uBlinkEl.textContent = fr % 10;
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
    if (atsReadoutEl) {
      // Pedagogical breakdown: Bloc · Centi · Milli · Beat · Blink (.fffff)
      const fr = ats.frac;
      const bloc  = Math.floor(fr / 10000);
      const centi = Math.floor(fr / 1000) % 10;
      const milli = Math.floor(fr / 100)  % 10;
      const beat  = Math.floor(fr / 10)   % 10;
      const blink = fr % 10;
      const fracStr = String(fr).padStart(5, '0');
      atsReadoutEl.innerHTML =
        'Bloc ' + bloc + ' · Centi ' + centi + ' · Milli ' + milli +
        ' · Beat ' + beat + ' · Blink ' + blink +
        '<span class="frac">.' + fracStr + '</span>';
    }
  }

  // -------- City "working day" arcs --------
  // 7 world cities, IANA tz, plus a 2-3 letter glyph drawn at the start of the arc.
  // West → East ordering, 8 cities total. 2 rows × 4 in the legend.
  // Each city carries its own color; the slot pattern (dashed/solid/dotted)
  // disambiguates morning/midday/evening within a single city.
  const CITIES = [
    { code: 'LA',  tz: 'America/Los_Angeles', label: 'Los Angeles',                                 color: '#ef4444' }, // red
    { code: 'NYC', tz: 'America/New_York',    label: 'New York',                                    color: '#f97316' }, // orange
    { code: 'LDN', tz: 'Europe/London',       label: lang === 'fr' ? 'Londres'   : 'London',        color: '#eab308' }, // gold
    { code: 'PAR', tz: 'Europe/Paris',        label: 'Paris',                                       color: '#22c55e' }, // green
    { code: 'JER', tz: 'Asia/Jerusalem',      label: lang === 'fr' ? 'Jérusalem' : 'Jerusalem',     color: '#14b8a6' }, // teal
    { code: 'DXB', tz: 'Asia/Dubai',          label: lang === 'fr' ? 'Dubaï'     : 'Dubai',         color: '#06b6d4' }, // cyan
    { code: 'BJG', tz: 'Asia/Shanghai',       label: lang === 'fr' ? 'Pékin'     : 'Beijing',       color: '#8b5cf6' }, // purple
    { code: 'TKO', tz: 'Asia/Tokyo',          label: 'Tokyo',                                       color: '#ec4899' }, // pink
  ];
  // Pattern per slot:
  //   matin       08-12 — dashed (hachures)
  //   midi        12-14 — solid
  //   après-midi  14-18 — dotted (pointillés)
  //   soir        18-22 — dash-dot
  const SLOTS = [
    { from:  8, to: 12, dasharray: '6 2',       linecap: 'butt'  }, // matin
    { from: 12, to: 14, dasharray: null,        linecap: 'butt'  }, // midi
    { from: 14, to: 18, dasharray: '0.5 3.5',   linecap: 'round' }, // après-midi
    { from: 18, to: 22, dasharray: '5 2 0.5 2', linecap: 'round' }, // soir
  ];

  function getTzOffsetMin(tz, date) {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' });
      const tzn = fmt.formatToParts(date).find(p => p.type === 'timeZoneName').value;
      const m = /GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?/.exec(tzn);
      if (!m) return 0;
      if (!m[1]) return 0;
      const sign = m[1] === '-' ? -1 : 1;
      const hours = parseInt(m[2], 10);
      const minutes = parseInt(m[3] || '0', 10);
      return sign * (hours * 60 + minutes);
    } catch (e) {
      return 0;
    }
  }

  function localHourToDayFrac(tz, hour, today) {
    const offsetMin = getTzOffsetMin(tz, today);
    let utcHourMin = hour * 60 - offsetMin;       // minutes from UTC midnight
    utcHourMin = ((utcHourMin % 1440) + 1440) % 1440;
    return utcHourMin / 1440;
  }

  function arcPath(r, startFrac, endFrac) {
    const a1 = startFrac * 2 * Math.PI - Math.PI / 2;
    const a2 = endFrac   * 2 * Math.PI - Math.PI / 2;
    const x1 = r * Math.cos(a1);
    const y1 = r * Math.sin(a1);
    const x2 = r * Math.cos(a2);
    const y2 = r * Math.sin(a2);
    let delta = endFrac - startFrac;
    if (delta < 0) delta += 1;
    const large = delta > 0.5 ? 1 : 0;
    return 'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
           ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2);
  }

  function buildCityArcs() {
    const group = document.getElementById('city-arcs');
    if (!group) return;
    group.innerHTML = '';                       // idempotent on rebuild
    const NS = 'http://www.w3.org/2000/svg';
    const today = new Date();
    const baseR = 104;
    const stepR = 4;
    // First pass: arcs (drawn first so labels and their halos sit on top).
    for (let i = 0; i < CITIES.length; i++) {
      const city = CITIES[i];
      const r = baseR + i * stepR;
      for (let s = 0; s < SLOTS.length; s++) {
        const slot = SLOTS[s];
        const f1 = localHourToDayFrac(city.tz, slot.from, today);
        const f2 = localHourToDayFrac(city.tz, slot.to,   today);
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', arcPath(r, f1, f2));
        path.setAttribute('stroke', city.color);
        path.setAttribute('stroke-width', '2.8');
        path.setAttribute('stroke-linecap', slot.linecap);
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.95');
        if (slot.dasharray) path.setAttribute('stroke-dasharray', slot.dasharray);
        group.appendChild(path);
      }
    }
    // Second pass: city code labels, each with a halo for readability.
    for (let i = 0; i < CITIES.length; i++) {
      const city = CITIES[i];
      const r = baseR + i * stepR;
      const startFrac = localHourToDayFrac(city.tz, 8, today);
      const a = startFrac * 2 * Math.PI - Math.PI / 2;
      const lx = (r + 10) * Math.cos(a);
      const ly = (r + 10) * Math.sin(a);
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', lx.toFixed(2));
      halo.setAttribute('cy', ly.toFixed(2));
      halo.setAttribute('r', '8.5');
      halo.setAttribute('class', 'city-halo');
      group.appendChild(halo);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', lx.toFixed(2));
      t.setAttribute('y', ly.toFixed(2));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('dominant-baseline', 'middle');
      t.setAttribute('font-family', 'ui-monospace, Menlo, Consolas, monospace');
      t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '700');
      t.setAttribute('class', 'city-code');
      t.textContent = city.code;
      group.appendChild(t);
    }
    // City legend below the dial, 4-col grid; each entry: colored dot + name + UTC offset.
    if (cityListEl) {
      cityListEl.textContent = '';
      CITIES.forEach(function (city) {
        const om = getTzOffsetMin(city.tz, today);
        const sign = om >= 0 ? '+' : '−';
        const h = Math.floor(Math.abs(om) / 60);
        const m = Math.abs(om) % 60;
        const off = sign + h + (m ? (':' + String(m).padStart(2, '0')) : '');
        const row = document.createElement('span');
        row.className = 'row';
        const sw = document.createElement('span');
        sw.className = 'swatch';
        sw.style.background = city.color;
        row.appendChild(sw);
        row.appendChild(document.createTextNode(city.label + ' ' + off));
        cityListEl.appendChild(row);
      });
    }
  }

  // -------- Face toggle (numeric ↔ analog) --------
  const FACE_KEY = 'ats-face';
  let currentFace = 'numeric';
  try {
    const saved = localStorage.getItem(FACE_KEY);
    if (saved === 'analog' || saved === 'numeric') currentFace = saved;
  } catch (e) {}

  function selectFace(face, opts) {
    if (face !== 'numeric' && face !== 'analog') face = 'numeric';
    const persist = !(opts && opts.persist === false);
    currentFace = face;
    if (persist) {
      try { localStorage.setItem(FACE_KEY, face); } catch (e) {}
    }
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
  buildCityArcs();
  selectFace(currentFace);

  // -------- Frozen / live mode --------
  let frozenAtMs = null; // null = live
  let tickHandle = null;

  // Easter egg: Konami code (set by site.js) → confetti at each Beat
  // boundary (1/10000 of a day ≈ 8.6 s) while the flag is up (30 s).
  const CONFETTI_GLYPHS = ['Δ', '✦', '◉', '✺', '✧', '⌬'];
  let lastBeat = -1;
  function maybeSpawnConfetti(ats) {
    if (!window.__atsKonami) return;
    const beatIdx = Math.floor(ats.frac / 10);   // 10000 beats per day
    if (beatIdx === lastBeat) return;
    lastBeat = beatIdx;
    for (let i = 0; i < 12; i++) {
      const span = document.createElement('span');
      span.className = 'konami-confetti';
      span.textContent = CONFETTI_GLYPHS[Math.floor(i % CONFETTI_GLYPHS.length)];
      span.style.left = (5 + Math.floor((i * 8.31) % 90)) + 'vw';
      span.style.animationDelay = ((i % 4) * 0.07) + 's';
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 1800);
    }
  }

  function liveTick() {
    const now = new Date();
    const ats = ATS.atsFromMs(now.getTime());
    applyAtsToDom(ats, now);
    maybeSpawnConfetti(ats);
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
    u.searchParams.delete('face');
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
    // ?face=numeric|analog overrides the saved face for this visit only —
    // a shared permalink must not silently overwrite the recipient's
    // preference. selectFace was already called at module init with
    // localStorage value; this re-selects without persisting.
    try {
      const faceParam = new URL(window.location.href).searchParams.get('face');
      if (faceParam === 'numeric' || faceParam === 'analog') {
        selectFace(faceParam, { persist: false });
      }
    } catch (e) {}
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
