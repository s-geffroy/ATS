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
  const handBeat      = document.getElementById('hand-beat');
  const handBlink     = document.getElementById('hand-blink');
  const handBlinkDot  = document.getElementById('hand-blink-dot');
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
    const beatRaw  = (f * 10000) % 10;
    const blinkRaw = (f * 100000) % 10;
    const milliPos = strictMode ? Math.floor(milliRaw) : milliRaw;
    const beatPos  = strictMode ? Math.floor(beatRaw)  : beatRaw;
    const blinkPos = strictMode ? Math.floor(blinkRaw) : blinkRaw;
    handBloc.setAttribute('transform',  'rotate(' + (blocPos  * 36).toFixed(3) + ')');
    handCenti.setAttribute('transform', 'rotate(' + (centiPos * 36).toFixed(3) + ')');
    handMilli.setAttribute('transform', 'rotate(' + (milliPos * 36).toFixed(3) + ')');
    if (handBeat)  handBeat.setAttribute('transform',  'rotate(' + (beatPos  * 36).toFixed(3) + ')');
    if (handBlink) {
      const blinkAngle = 'rotate(' + (blinkPos * 36).toFixed(3) + ')';
      handBlink.setAttribute('transform', blinkAngle);
      if (handBlinkDot) handBlinkDot.setAttribute('transform', blinkAngle);
    }
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
        '<span class="u-bloc">Bloc</span> '   + bloc  +
        ' · <span class="u-centi">Centi</span> ' + centi +
        ' · <span class="u-milli">Milli</span> ' + milli +
        ' · <span class="u-beat">Beat</span> '   + beat  +
        ' · <span class="u-blink">Blink</span> ' + blink +
        '<span class="frac">.' + fracStr + '</span>';
    }
  }

  // -------- City "working day" arcs --------
  // 7 world cities, IANA tz, plus a 2-3 letter glyph drawn at the start of the arc.
  // West → East ordering, 8 cities total. 2 rows × 4 in the legend.
  // Each city carries its own color; the slot pattern (dashed/solid/dotted)
  // disambiguates morning/midday/evening within a single city.
  // Colors are reshuffled (vs alphabetical/rainbow order) so adjacent cities
  // around the dial never share a hue family — every third step on the wheel.
  // Minimum hue gap between neighbours: 75° (DXB pink → BJG gold).
  const DEFAULT_CITIES = [
    { code: 'LA',  tz: 'America/Los_Angeles', label: 'Los Angeles',                                 color: '#ef4444' }, // red
    { code: 'NYC', tz: 'America/New_York',    label: 'New York',                                    color: '#22c55e' }, // green
    { code: 'LDN', tz: 'Europe/London',       label: lang === 'fr' ? 'Londres'   : 'London',        color: '#8b5cf6' }, // purple
    { code: 'PAR', tz: 'Europe/Paris',        label: 'Paris',                                       color: '#f97316' }, // orange
    { code: 'JER', tz: 'Asia/Jerusalem',      label: lang === 'fr' ? 'Jérusalem' : 'Jerusalem',     color: '#14b8a6' }, // teal
    { code: 'DXB', tz: 'Asia/Dubai',          label: lang === 'fr' ? 'Dubaï'     : 'Dubai',         color: '#ec4899' }, // pink
    { code: 'BJG', tz: 'Asia/Shanghai',       label: lang === 'fr' ? 'Pékin'     : 'Beijing',       color: '#eab308' }, // gold
    { code: 'TKO', tz: 'Asia/Tokyo',          label: 'Tokyo',                                       color: '#06b6d4' }, // cyan
  ];
  // Mutated through addCustomCity / resetCustomCities — buildCityArcs reads
  // the current effective list. Filled in from localStorage at boot.
  const CUSTOM_CITIES_KEY = 'ats-custom-cities';
  const MAX_CUSTOM_CITIES = 6;
  let CITIES = DEFAULT_CITIES.slice();
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

  // Pick a legible text color (black or white) against a given hex background.
  // Uses the YIQ luminance approximation — fast, dependency-free, accurate enough
  // for the city palette which sits between L≈0.30 (purple) and L≈0.65 (gold).
  function pickContrastText(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 140 ? '#000000' : '#ffffff';
  }

  // Timezone helpers live in tz-utils.js (shared with cities-page.js).
  const getTzOffsetMin     = window.ATSTzUtils.getTzOffsetMin;
  const localHourToDayFrac = window.ATSTzUtils.localHourToDayFrac;

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

  // City focus state (set by clicking a trigram on the dial). Drives:
  //   • dim/highlight of arc paths
  //   • the centred camembert
  //   • hand-inner-radius offset (so hands don't overlap the camembert)
  let focusedCity = null;
  // Camembert fills the inner dial to r=100 (the main ring). Wedges are
  // semi-transparent so the ticks, labels, and the 5 hands stay legible
  // straight through them.
  const CAMEMBERT_R = 100;
  const CAMEMBERT_OPACITY = 0.20;
  // Focused trigram emphasis on the outer ring: bigger halo + bigger code.
  const HALO_R_DEFAULT = 8.5;
  const HALO_R_FOCUS   = 12;
  const CODE_SIZE_DEFAULT = 10;
  const CODE_SIZE_FOCUS   = 14;

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
        path.dataset.cityCode = city.code;
        group.appendChild(path);
      }
    }
    // Second pass: city code labels, each with a halo matching the arc color.
    // An invisible larger hit-circle is added on top so the click target stays
    // comfortable on touch devices and survives the focus opacity changes.
    for (let i = 0; i < CITIES.length; i++) {
      const city = CITIES[i];
      const r = baseR + i * stepR;
      const startFrac = localHourToDayFrac(city.tz, 8, today);
      const a = startFrac * 2 * Math.PI - Math.PI / 2;
      const lx = (r + 10) * Math.cos(a);
      const ly = (r + 10) * Math.sin(a);
      const textColor = pickContrastText(city.color);
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', lx.toFixed(2));
      halo.setAttribute('cy', ly.toFixed(2));
      halo.setAttribute('r', String(HALO_R_DEFAULT));
      halo.setAttribute('class', 'city-halo');
      halo.setAttribute('fill', city.color);
      halo.setAttribute('pointer-events', 'none');
      halo.dataset.cityCode = city.code;
      group.appendChild(halo);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', lx.toFixed(2));
      t.setAttribute('y', ly.toFixed(2));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('dominant-baseline', 'middle');
      t.setAttribute('font-family', 'ui-monospace, Menlo, Consolas, monospace');
      t.setAttribute('font-size', String(CODE_SIZE_DEFAULT));
      t.setAttribute('font-weight', '700');
      t.setAttribute('class', 'city-code');
      t.setAttribute('fill', textColor);
      t.setAttribute('pointer-events', 'none');
      t.dataset.cityCode = city.code;
      t.textContent = city.code;
      group.appendChild(t);
      const hit = document.createElementNS(NS, 'circle');
      hit.setAttribute('cx', lx.toFixed(2));
      hit.setAttribute('cy', ly.toFixed(2));
      hit.setAttribute('r', '18');
      hit.setAttribute('class', 'city-hit');
      hit.setAttribute('fill', 'transparent');
      hit.setAttribute('role', 'button');
      hit.setAttribute('tabindex', '0');
      hit.setAttribute('aria-label', city.label);
      hit.addEventListener('click', function (ev) {
        ev.stopPropagation();
        setFocusedCity(focusedCity === city ? null : city);
      });
      hit.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          setFocusedCity(focusedCity === city ? null : city);
        }
      });
      group.appendChild(hit);
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

  // -------- Camembert + focus state --------
  // Build (or rebuild) the centred wedge group for the currently focused city.
  // Each of the 4 slots (matin / midi / après-midi / soir) becomes a pie wedge
  // anchored at the city's LOCAL hour-of-day on the 24 h dial. Wedges fan all
  // the way out to the main ring (r=100) and are very transparent so the
  // hands, ticks, and labels remain fully readable on top.
  function buildCamembert(city) {
    const group = document.getElementById('city-camembert');
    if (!group) return;
    group.innerHTML = '';
    if (!city) { group.setAttribute('hidden', ''); return; }
    group.removeAttribute('hidden');
    const NS = 'http://www.w3.org/2000/svg';
    const today = new Date();
    const boundaryHours = new Set();
    for (let s = 0; s < SLOTS.length; s++) {
      const slot = SLOTS[s];
      const f1 = localHourToDayFrac(city.tz, slot.from, today);
      const f2 = localHourToDayFrac(city.tz, slot.to,   today);
      const a1 = f1 * 2 * Math.PI - Math.PI / 2;
      const a2 = f2 * 2 * Math.PI - Math.PI / 2;
      const x1 = CAMEMBERT_R * Math.cos(a1);
      const y1 = CAMEMBERT_R * Math.sin(a1);
      const x2 = CAMEMBERT_R * Math.cos(a2);
      const y2 = CAMEMBERT_R * Math.sin(a2);
      let delta = f2 - f1; if (delta < 0) delta += 1;
      const large = delta > 0.5 ? 1 : 0;
      const d = 'M 0 0 L ' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
                ' A ' + CAMEMBERT_R + ' ' + CAMEMBERT_R + ' 0 ' + large +
                ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z';
      const wedge = document.createElementNS(NS, 'path');
      wedge.setAttribute('d', d);
      wedge.setAttribute('fill', city.color);
      wedge.setAttribute('opacity', String(CAMEMBERT_OPACITY));
      wedge.setAttribute('stroke', 'none');
      group.appendChild(wedge);
      boundaryHours.add(slot.from);
      boundaryHours.add(slot.to);
    }
    // Radial separators between adjacent periods (matin|midi, midi|après-midi, etc.)
    // and on the two edges of the 22-08 night gap. Same city colour at higher
    // opacity than the wedge fill so the boundaries read clearly through the
    // transparent fill without competing with the hands on top.
    boundaryHours.forEach(function (h) {
      const f = localHourToDayFrac(city.tz, h, today);
      const a = f * 2 * Math.PI - Math.PI / 2;
      const x = CAMEMBERT_R * Math.cos(a);
      const y = CAMEMBERT_R * Math.sin(a);
      const sep = document.createElementNS(NS, 'line');
      sep.setAttribute('x1', '0');
      sep.setAttribute('y1', '0');
      sep.setAttribute('x2', x.toFixed(2));
      sep.setAttribute('y2', y.toFixed(2));
      sep.setAttribute('stroke', city.color);
      sep.setAttribute('stroke-width', '1');
      sep.setAttribute('opacity', '0.55');
      group.appendChild(sep);
    });
  }

  // Bring the selected city's halo + trigram to the foreground on the outer
  // ring, restoring all the others to their default size. With the centre
  // label gone, this is the only on-dial signal of which city is focused.
  function highlightSelectedTrigram(city) {
    const arcGroup = document.getElementById('city-arcs');
    if (!arcGroup) return;
    const halos = arcGroup.querySelectorAll('circle.city-halo[data-city-code]');
    for (let i = 0; i < halos.length; i++) {
      const h = halos[i];
      const focused = city && h.dataset.cityCode === city.code;
      h.setAttribute('r', String(focused ? HALO_R_FOCUS : HALO_R_DEFAULT));
    }
    const codes = arcGroup.querySelectorAll('text.city-code[data-city-code]');
    for (let i = 0; i < codes.length; i++) {
      const t = codes[i];
      const focused = city && t.dataset.cityCode === city.code;
      t.setAttribute('font-size', String(focused ? CODE_SIZE_FOCUS : CODE_SIZE_DEFAULT));
    }
  }

  // Single entry-point for any change to the focused city. Idempotent.
  function setFocusedCity(city) {
    focusedCity = city || null;
    // Dim the arc paths that belong to other cities; the trigrams/halos stay
    // at full opacity so they remain clickable as switch targets.
    const arcGroup = document.getElementById('city-arcs');
    if (arcGroup) {
      const paths = arcGroup.querySelectorAll('path[data-city-code]');
      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        const matches = focusedCity && p.dataset.cityCode === focusedCity.code;
        if (focusedCity && !matches) {
          p.setAttribute('opacity', '0.25');
        } else {
          p.setAttribute('opacity', '0.95');
        }
      }
    }
    buildCamembert(focusedCity);
    highlightSelectedTrigram(focusedCity);
  }

  // ESC unfocuses; the listener is always on (it's a no-op when focusedCity
  // is already null) and is cheap.
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && focusedCity) {
      setFocusedCity(null);
    }
  });

  // Clicking on the analog dial background (anywhere outside a .city-hit)
  // also exits focus mode. The handler is attached to the SVG so the rest of
  // the page (face toggle, details, etc.) is unaffected.
  function bindDialBackgroundClick() {
    const svg = document.querySelector('.analog-dial');
    if (!svg) return;
    svg.addEventListener('click', function (ev) {
      if (!focusedCity) return;
      const t = ev.target;
      if (t && t.classList && t.classList.contains('city-hit')) return;
      setFocusedCity(null);
    });
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

  // -------- Custom cities (user-added pins on the analog dial) ----------
  // Each entry shape: { code, label, tz, color }. Same shape as DEFAULT_CITIES
  // — they are merged together and fed to buildCityArcs(). Persistence is
  // purely local; nothing ever leaves the browser.
  function loadCustomCities() {
    try {
      const raw = localStorage.getItem(CUSTOM_CITIES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Defensive validation — survives older formats / hand-edited storage.
      return parsed.filter(function (c) {
        return c && typeof c.code === 'string' && typeof c.label === 'string'
            && typeof c.tz === 'string' && typeof c.color === 'string';
      }).slice(0, MAX_CUSTOM_CITIES);
    } catch (e) { return []; }
  }
  function saveCustomCities(list) {
    try { localStorage.setItem(CUSTOM_CITIES_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function rebuildCityList() {
    const customs = loadCustomCities();
    CITIES = DEFAULT_CITIES.concat(customs);
    buildCityArcs();
    renderCustomCityList(customs);
  }
  function renderCustomCityList(customs) {
    const ul = document.getElementById('custom-city-list');
    if (!ul) return;
    ul.innerHTML = '';
    customs.forEach(function (city, idx) {
      const li = document.createElement('li');
      li.className = 'custom-city-item';
      const swatch = document.createElement('span');
      swatch.className = 'custom-city-swatch';
      swatch.style.background = city.color;
      li.appendChild(swatch);
      const name = document.createElement('span');
      name.className = 'custom-city-name';
      name.textContent = city.code + ' — ' + city.label + ' (' + city.tz + ')';
      li.appendChild(name);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-city-remove';
      btn.setAttribute('aria-label', (lang === 'fr' ? 'Retirer ' : 'Remove ') + city.label);
      btn.textContent = '×';
      btn.addEventListener('click', function () {
        const next = loadCustomCities();
        next.splice(idx, 1);
        saveCustomCities(next);
        rebuildCityList();
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }
  function populateIanaDatalist() {
    const dl = document.getElementById('iana-tz-list');
    if (!dl || dl.childElementCount > 0) return;
    let zones = [];
    try {
      if (Intl.supportedValuesOf) zones = Intl.supportedValuesOf('timeZone');
    } catch (e) {}
    if (!zones.length) return; // Safari < 15.4 lacks supportedValuesOf — datalist stays empty, type-in still works.
    const frag = document.createDocumentFragment();
    zones.forEach(function (z) {
      const opt = document.createElement('option');
      opt.value = z;
      frag.appendChild(opt);
    });
    dl.appendChild(frag);
  }
  function bindCustomCityForm() {
    const form = document.getElementById('custom-city-form');
    if (!form) return;
    const codeEl  = document.getElementById('customCityCode');
    const labelEl = document.getElementById('customCityLabel');
    const tzEl    = document.getElementById('customCityTz');
    const colorEl = document.getElementById('customCityColor');
    const statusEl = document.getElementById('customCityStatus');
    function setStat(msg, ok) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'status ' + (ok === false ? 'err' : 'ok');
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const code  = codeEl.value.trim().toUpperCase();
      const label = labelEl.value.trim();
      const tz    = tzEl.value.trim();
      const color = colorEl.value;
      const T = lang === 'fr' ? {
        bad_code: 'Code invalide (2-4 lettres).',
        bad_tz:   'Fuseau IANA invalide.',
        dup:      'Code déjà utilisé.',
        full:     'Maximum atteint (6 villes personnalisées).',
        added:    'Ajouté.',
      } : {
        bad_code: 'Invalid code (2-4 letters).',
        bad_tz:   'Invalid IANA time zone.',
        dup:      'Code already in use.',
        full:     'Maximum reached (6 custom cities).',
        added:    'Added.',
      };
      if (!/^[A-Z]{2,4}$/.test(code)) { setStat(T.bad_code, false); return; }
      // Validate tz by asking Intl to build a formatter — throws if unknown.
      try { new Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date()); }
      catch (e) { setStat(T.bad_tz, false); return; }
      const customs = loadCustomCities();
      if (customs.length >= MAX_CUSTOM_CITIES) { setStat(T.full, false); return; }
      const allCodes = DEFAULT_CITIES.concat(customs).map(function (c) { return c.code; });
      if (allCodes.indexOf(code) !== -1) { setStat(T.dup, false); return; }
      customs.push({ code: code, label: label, tz: tz, color: color });
      saveCustomCities(customs);
      rebuildCityList();
      setStat(T.added, true);
      codeEl.value = ''; labelEl.value = ''; tzEl.value = '';
    });
    const resetBtn = document.getElementById('btnResetCustomCities');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      saveCustomCities([]);
      rebuildCityList();
      setStat(lang === 'fr' ? 'Réinitialisé.' : 'Reset.', true);
    });
  }

  buildAnalogTicks();
  // Pre-load custom cities BEFORE first buildCityArcs so they appear on
  // first render without a flash of the default-only dial.
  CITIES = DEFAULT_CITIES.concat(loadCustomCities());
  buildCityArcs();
  populateIanaDatalist();
  bindCustomCityForm();
  renderCustomCityList(loadCustomCities());
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
    bindDialBackgroundClick();
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
