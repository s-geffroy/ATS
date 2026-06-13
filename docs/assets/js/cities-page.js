/**
 * cities-page.js — controller for /{fr,en}/cities.html.
 *
 * Renders a sortable/filterable matrix of representative world capitals
 * × daily activities (wake, breakfast, school, work, lunch, etc.). Each
 * cell shows the cultural-median LOCAL time plus the corresponding ATS
 * BC.M micro slice for that local hour, computed from each city's IANA
 * timezone (DST-aware via Intl.DateTimeFormat).
 *
 * Data: /assets/data/cities.json. ATS values are derived client-side so
 * DST transitions don't drift the static dataset.
 */

(function () {
  'use strict';

  const lang = (document.body.dataset.lang || 'en').toLowerCase();
  const DATA_URL = '../assets/data/cities.json';

  const T = {
    en: {
      title: 'Capitals × daily activities — local hour and ATS micro units',
      filter: 'Filter…',
      city: 'City',
      tz: 'Time zone',
      region: 'Region',
      loadError: 'Failed to load city data.',
      empty: 'No city matches the filter.',
    },
    fr: {
      title: 'Capitales × activités quotidiennes — heure locale et unités micro ATS',
      filter: 'Filtrer…',
      city: 'Ville',
      tz: 'Fuseau',
      region: 'Région',
      loadError: 'Échec du chargement des données.',
      empty: 'Aucune ville ne correspond au filtre.',
    },
  }[lang] || {};

  // Convert a "HH:MM" local time + IANA tz to ATS Bloc/Centi/Milli digits
  // for *today* in UTC. Same approach as the analog dial: ask Intl for the
  // current named offset, subtract from local minutes to get UTC minutes,
  // wrap mod 1440, divide by 1440 to get day-fraction.
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

  function localHHMMToAtsBCM(tz, hhmm, today) {
    const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
    if (!m) return { bc: 0, milli: 0 };
    const localMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    const offsetMin = getTzOffsetMin(tz, today);
    let utcMin = localMin - offsetMin;
    utcMin = ((utcMin % 1440) + 1440) % 1440;
    const frac = utcMin / 1440;                // 0..1
    const five = Math.floor(frac * 100000);    // BCMBb
    const bc = Math.floor(five / 1000);        // 00..99
    const milli = Math.floor(five / 100) % 10; // 0..9
    return { bc, milli };
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function makeCell(localHHMM, ats) {
    const td = document.createElement('td');
    td.className = 'cities-cell';
    const top = document.createElement('div');
    top.className = 'cities-cell-local';
    top.textContent = localHHMM;
    const bot = document.createElement('div');
    bot.className = 'cities-cell-ats';
    bot.textContent = pad2(ats.bc) + '.' + ats.milli;
    td.appendChild(top);
    td.appendChild(bot);
    return td;
  }

  async function boot() {
    const root = document.getElementById('cities-root');
    if (!root) return;
    root.innerHTML = '<p class="muted">…</p>';
    let payload;
    try {
      const r = await fetch(DATA_URL, { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      payload = await r.json();
    } catch (e) {
      root.innerHTML = '<p class="err">' + T.loadError + '</p>';
      return;
    }

    const note = lang === 'fr' ? payload.note_fr : payload.note_en;
    const activities = payload.activities;
    const cities = payload.cities;
    const today = new Date();

    root.innerHTML = '';

    const intro = document.createElement('p');
    intro.className = 'muted cities-note';
    intro.textContent = note;
    root.appendChild(intro);

    const controls = document.createElement('div');
    controls.className = 'cities-controls';
    const filter = document.createElement('input');
    filter.type = 'search';
    filter.placeholder = T.filter;
    filter.className = 'cities-filter';
    filter.setAttribute('aria-label', T.filter);
    controls.appendChild(filter);
    root.appendChild(controls);

    const wrap = document.createElement('div');
    wrap.className = 'cities-tablewrap';
    const table = document.createElement('table');
    table.className = 'cities-table';
    wrap.appendChild(table);
    root.appendChild(wrap);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thCity = document.createElement('th');
    thCity.textContent = T.city;
    thCity.className = 'cities-th-city';
    headRow.appendChild(thCity);
    for (const a of activities) {
      const th = document.createElement('th');
      th.textContent = lang === 'fr' ? a.label_fr : a.label_en;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (const city of cities) {
      const row = document.createElement('tr');
      const name = lang === 'fr' ? city.name_fr : city.name_en;
      row.dataset.search = (name + ' ' + city.code + ' ' + city.country + ' ' + city.region + ' ' + city.tz).toLowerCase();

      const tdCity = document.createElement('td');
      tdCity.className = 'cities-td-city';
      const codeBadge = document.createElement('span');
      codeBadge.className = 'cities-code';
      codeBadge.textContent = city.code;
      const nameSpan = document.createElement('span');
      nameSpan.className = 'cities-name';
      nameSpan.textContent = name;
      const tzSpan = document.createElement('span');
      tzSpan.className = 'cities-tz muted';
      tzSpan.textContent = city.tz;
      tdCity.appendChild(codeBadge);
      tdCity.appendChild(nameSpan);
      tdCity.appendChild(tzSpan);
      row.appendChild(tdCity);

      for (const a of activities) {
        const hhmm = city.times && city.times[a.key];
        if (!hhmm) {
          const td = document.createElement('td');
          td.className = 'cities-cell cities-cell-empty';
          td.textContent = '—';
          row.appendChild(td);
        } else {
          const ats = localHHMMToAtsBCM(city.tz, hhmm, today);
          row.appendChild(makeCell(hhmm, ats));
        }
      }
      tbody.appendChild(row);
    }

    filter.addEventListener('input', function () {
      const q = filter.value.trim().toLowerCase();
      let visible = 0;
      Array.from(tbody.children).forEach(function (r) {
        const match = !q || r.dataset.search.indexOf(q) !== -1;
        r.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      let emptyRow = tbody.querySelector('.cities-empty');
      if (visible === 0) {
        if (!emptyRow) {
          emptyRow = document.createElement('tr');
          emptyRow.className = 'cities-empty';
          const td = document.createElement('td');
          td.colSpan = 1 + activities.length;
          td.className = 'muted';
          td.textContent = T.empty;
          emptyRow.appendChild(td);
          tbody.appendChild(emptyRow);
        }
        emptyRow.style.display = '';
      } else if (emptyRow) {
        emptyRow.style.display = 'none';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
