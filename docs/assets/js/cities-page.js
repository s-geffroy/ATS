/**
 * cities-page.js — controller for /{fr,en}/cities.html.
 *
 * Renders a world map (Natural Earth 110m land, equirectangular projection)
 * with ~40 representative capitals plotted at their lat/lon. Each city dot
 * carries an emoji that morphs with what's happening LOCALLY at the current
 * reference UTC instant (sleep / wake / breakfast / work / lunch / dinner /
 * leisure). Hovering or focusing a dot reveals: city name, local HH:MM,
 * ATS BC.M slice, and the activity label.
 *
 * Reference instant:
 *   • Live by default — re-renders every second from the wall clock.
 *   • A slider lets the user scrub a virtual UTC instant across the day
 *     and watch the world cycle through its routines. "Now" returns live.
 *
 * Data: /assets/data/cities.json + /assets/data/world-land.geo.json. All
 * ATS values are derived client-side so DST transitions don't drift the
 * static dataset.
 */

(function () {
  'use strict';

  const lang = (document.body.dataset.lang || 'en').toLowerCase();
  const DATA_URL  = '../assets/data/cities.json';
  const WORLD_URL = '../assets/data/world-land.geo.json';
  const NS = 'http://www.w3.org/2000/svg';

  const T = ({
    en: {
      loadError: 'Failed to load map data.',
      now: 'Now',
      scrub: 'Drag to scrub through 24 h UTC',
      live: 'Live',
      frozen: 'Frozen',
      legend: 'Hover or tap a city to see local time, ATS slice, and current activity.',
    },
    fr: {
      loadError: 'Échec du chargement de la carte.',
      now: 'Maintenant',
      scrub: 'Faire défiler les 24 h UTC',
      live: 'En direct',
      frozen: 'Figé',
      legend: 'Survoler ou toucher une ville pour voir l\'heure locale, l\'éclat ATS et l\'activité en cours.',
    },
  })[lang] || {};

  // -------- Helpers --------
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function parseHM(s) {
    const m = /^(\d{2}):(\d{2})$/.exec(s || '');
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  // Timezone helpers live in tz-utils.js (shared with clock-page.js).
  const getTzOffsetMin = window.ATSTzUtils.getTzOffsetMin;
  const utcMinToBCM    = window.ATSTzUtils.utcMinToBCM;

  function fmtAtsBCM(bcm) { return pad2(bcm.bc) + '.' + bcm.milli; }
  function fmtLocalHHMM(m) { return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60); }
  function fmtUTCHHMM(m)  { return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60) + ' UTC'; }

  // Project lat/lon onto an equirectangular 720×360 viewBox.
  function projectLatLon(lat, lon) {
    return { x: (lon + 180) * 2, y: (90 - lat) * 2 };
  }

  // Derive the city's current state key from its local minute-of-day and
  // its activity timestamps. Returns one of the keys in `states` (sleep,
  // wake, breakfast, commute, work, lunch, evening, dinner, leisure).
  // Conservative state machine — boundaries blur the activity windows so a
  // city is rarely caught between buckets.
  function stateAt(times, mLocal) {
    const wake = parseHM(times.wake);
    const br   = parseHM(times.breakfast);
    const si   = parseHM(times.school_in);
    const wi   = parseHM(times.work_in);
    const lu   = parseHM(times.lunch);
    const so   = parseHM(times.school_out);
    const wo   = parseHM(times.work_out);
    const di   = parseHM(times.dinner);
    const tv   = parseHM(times.tv_movie);

    const startWork = Math.min(si == null ? wi : si, wi == null ? si : wi);
    const endWork   = Math.max(so == null ? wo : so, wo == null ? so : wo);
    const bedtime   = Math.min(tv + 90, 1439);
    const morning   = Math.max(wake - 30, 0);

    if (mLocal >= bedtime || mLocal < morning) return 'sleep';
    if (mLocal < wake + 30) return 'wake';
    if (mLocal < br   + 30) return 'breakfast';
    if (mLocal < startWork - 5)  return 'breakfast';
    if (mLocal < startWork + 15) return 'commute';
    if (mLocal < lu - 15) return 'work';
    if (mLocal < lu + 60) return 'lunch';
    if (mLocal < endWork - 15) return 'work';
    if (mLocal < endWork + 30) return 'commute';
    if (mLocal < di - 15) return 'evening';
    if (mLocal < di + 60) return 'dinner';
    if (mLocal < tv + 90) return 'leisure';
    return 'sleep';
  }

  // -------- Boot --------
  async function boot() {
    const root = document.getElementById('cities-root');
    if (!root) return;
    root.innerHTML = '<p class="muted">…</p>';

    let payload, world;
    try {
      const [r1, r2] = await Promise.all([
        fetch(DATA_URL, { cache: 'no-store' }),
        fetch(WORLD_URL, { cache: 'force-cache' }),
      ]);
      if (!r1.ok) throw new Error('cities ' + r1.status);
      if (!r2.ok) throw new Error('world '  + r2.status);
      payload = await r1.json();
      world   = await r2.json();
    } catch (e) {
      root.innerHTML = '<p class="err">' + T.loadError + '</p>';
      return;
    }

    const note   = lang === 'fr' ? payload.note_fr : payload.note_en;
    const cities = payload.cities;
    const states = payload.states || [];
    const stateMap = {};
    states.forEach(function (s) { stateMap[s.key] = s; });

    root.innerHTML = '';

    // ---- Intro note + legend strip ----
    const intro = document.createElement('p');
    intro.className = 'muted cities-note';
    intro.textContent = note;
    root.appendChild(intro);

    const legend = document.createElement('div');
    legend.className = 'cities-legend';
    states.forEach(function (s) {
      const item = document.createElement('span');
      item.className = 'cities-legend-item';
      item.innerHTML = '<span class="cities-legend-icon">' + s.icon + '</span> ' +
                       (lang === 'fr' ? s.label_fr : s.label_en);
      legend.appendChild(item);
    });
    root.appendChild(legend);

    // ---- SVG map ----
    const mapWrap = document.createElement('div');
    mapWrap.className = 'cities-map';
    root.appendChild(mapWrap);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 720 360');
    svg.setAttribute('class', 'cities-map-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', T.legend);
    mapWrap.appendChild(svg);

    // Ocean rectangle so the contrast against land is theme-controlled.
    const ocean = document.createElementNS(NS, 'rect');
    ocean.setAttribute('class', 'cities-ocean');
    ocean.setAttribute('x', '0'); ocean.setAttribute('y', '0');
    ocean.setAttribute('width', '720'); ocean.setAttribute('height', '360');
    svg.appendChild(ocean);

    // Continents — one <path> per feature.
    const landGroup = document.createElementNS(NS, 'g');
    landGroup.setAttribute('class', 'cities-land');
    svg.appendChild(landGroup);

    function ringToPath(ring) {
      let d = '';
      for (let i = 0; i < ring.length; i++) {
        const p = projectLatLon(ring[i][1], ring[i][0]);
        d += (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1);
      }
      return d + 'Z';
    }

    world.features.forEach(function (feature) {
      const geom = feature.geometry;
      const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
      polys.forEach(function (poly) {
        let d = '';
        poly.forEach(function (ring) { d += ringToPath(ring); });
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill-rule', 'evenodd');
        landGroup.appendChild(path);
      });
    });

    // City dots — one <g> per city, holding a circle and a text node
    // with the activity emoji centred on it. The whole group is focusable
    // and gets click/hover/focus listeners for the tooltip.
    const citiesGroup = document.createElementNS(NS, 'g');
    citiesGroup.setAttribute('class', 'cities-pins');
    svg.appendChild(citiesGroup);

    const dots = cities.map(function (city) {
      const p = projectLatLon(city.lat, city.lon);
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'cities-pin');
      g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      const aria = (lang === 'fr' ? city.name_fr : city.name_en);
      g.setAttribute('aria-label', aria);
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '9');
      dot.setAttribute('class', 'cities-pin-dot');
      g.appendChild(dot);
      const icon = document.createElementNS(NS, 'text');
      icon.setAttribute('class', 'cities-pin-icon');
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('dominant-baseline', 'central');
      icon.setAttribute('y', '0.5');
      g.appendChild(icon);
      citiesGroup.appendChild(g);

      const ref = { city: city, group: g, icon: icon };
      g.addEventListener('mouseenter', function (e) { showTooltip(ref, e); });
      g.addEventListener('mousemove',  function (e) { positionTooltip(e); });
      g.addEventListener('mouseleave', hideTooltip);
      g.addEventListener('focus',      function () { showTooltip(ref, null); });
      g.addEventListener('blur',       hideTooltip);
      g.addEventListener('click',      function (e) { showTooltip(ref, e); });
      return ref;
    });

    // ---- Controls (slider + Now button + caption) ----
    const ctrls = document.createElement('div');
    ctrls.className = 'cities-controls';
    root.appendChild(ctrls);

    const liveBtn = document.createElement('button');
    liveBtn.type = 'button';
    liveBtn.className = 'cities-now-btn';
    liveBtn.textContent = T.now;
    ctrls.appendChild(liveBtn);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1439';                   // minutes in a day
    slider.step = '1';
    slider.className = 'cities-slider';
    slider.setAttribute('aria-label', T.scrub);
    ctrls.appendChild(slider);

    const caption = document.createElement('span');
    caption.className = 'cities-caption';
    ctrls.appendChild(caption);

    // ---- Tooltip (HTML overlay) ----
    const tip = document.createElement('div');
    tip.className = 'cities-tooltip';
    tip.hidden = true;
    document.body.appendChild(tip);

    let activeRef = null;
    function showTooltip(ref, evt) {
      activeRef = ref;
      renderTooltip();
      tip.hidden = false;
      if (evt) positionTooltip(evt);
      else {
        // Focus came via keyboard — anchor near the pin in viewport coords.
        const rect = ref.group.getBoundingClientRect();
        positionTooltipAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
    function hideTooltip() {
      activeRef = null;
      tip.hidden = true;
    }
    function positionTooltip(evt) { positionTooltipAt(evt.clientX, evt.clientY); }
    function positionTooltipAt(cx, cy) {
      // Place to the right by default, mirror to the left if off-screen.
      const pad = 14;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let x = cx + pad, y = cy + pad;
      if (x + w > window.innerWidth - 8) x = cx - pad - w;
      if (y + h > window.innerHeight - 8) y = cy - pad - h;
      tip.style.left = Math.max(8, x) + 'px';
      tip.style.top  = Math.max(8, y) + 'px';
    }

    // ---- Reference instant + render loop ----
    // referenceUtcMin: null → live (read clock each tick), else fixed minute-of-day.
    // referenceDate is used for tz-offset lookups (DST around "today" is fine).
    let referenceUtcMin = null;
    const referenceDate = new Date();
    let tickHandle = null;

    function currentUtcMin() {
      if (referenceUtcMin != null) return referenceUtcMin;
      const d = new Date();
      return d.getUTCHours() * 60 + d.getUTCMinutes();
    }

    function renderAll() {
      const utcMin = currentUtcMin();
      for (let i = 0; i < dots.length; i++) {
        const ref = dots[i];
        const off = getTzOffsetMin(ref.city.tz, referenceDate);
        const localMin = ((utcMin + off) % 1440 + 1440) % 1440;
        const stateKey = stateAt(ref.city.times, localMin);
        const s = stateMap[stateKey] || stateMap.sleep;
        if (ref.icon.textContent !== s.icon) ref.icon.textContent = s.icon;
        ref.group.dataset.state = stateKey;
        // Cache last-computed local context for the tooltip
        ref.localMin = localMin;
        ref.stateKey = stateKey;
      }
      // Caption: ATS BC.M + UTC HH:MM + live/frozen badge
      const bcm = utcMinToBCM(utcMin);
      const tag = referenceUtcMin == null ? T.live : T.frozen;
      caption.innerHTML = '<span class="cities-caption-ats mono">Δ-..-' + fmtAtsBCM(bcm) +
                          '</span> · <span class="mono">' + fmtUTCHHMM(utcMin) +
                          '</span> · <span class="cities-caption-tag">' + tag + '</span>';
      // Sync slider thumb when live so the user can grab it at the current spot
      if (referenceUtcMin == null) slider.value = String(utcMin);
      // Refresh the tooltip in place if one is open
      if (activeRef) renderTooltip();
    }

    function renderTooltip() {
      if (!activeRef) return;
      const r = activeRef;
      const off = getTzOffsetMin(r.city.tz, referenceDate);
      const utcMin = currentUtcMin();
      const localMin = ((utcMin + off) % 1440 + 1440) % 1440;
      const bcm = utcMinToBCM(utcMin);
      const sk = r.stateKey || stateAt(r.city.times, localMin);
      const s  = stateMap[sk] || stateMap.sleep;
      const name = lang === 'fr' ? r.city.name_fr : r.city.name_en;
      const stateLabel = lang === 'fr' ? s.label_fr : s.label_en;
      tip.innerHTML =
        '<div class="cities-tooltip-head">' +
          '<span class="cities-tooltip-icon">' + s.icon + '</span>' +
          '<span class="cities-tooltip-name">' + name + '</span>' +
          '<span class="cities-tooltip-code">' + r.city.code + '</span>' +
        '</div>' +
        '<div class="cities-tooltip-row"><span class="lbl">' + (lang === 'fr' ? 'Heure locale' : 'Local') + '</span>' +
          '<span class="mono">' + fmtLocalHHMM(localMin) + '</span></div>' +
        '<div class="cities-tooltip-row"><span class="lbl">ATS</span>' +
          '<span class="mono">Δ-..-' + fmtAtsBCM(bcm) + '</span></div>' +
        '<div class="cities-tooltip-row"><span class="lbl">' + (lang === 'fr' ? 'Activité' : 'Activity') + '</span>' +
          '<span>' + stateLabel + '</span></div>';
    }

    function startLive() {
      referenceUtcMin = null;
      if (tickHandle) clearInterval(tickHandle);
      renderAll();
      tickHandle = setInterval(renderAll, 1000);
    }

    liveBtn.addEventListener('click', startLive);
    slider.addEventListener('input', function () {
      if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
      referenceUtcMin = parseInt(slider.value, 10);
      renderAll();
    });

    startLive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
