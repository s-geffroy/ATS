/**
 * tz-utils.js — shared DST-aware timezone helpers used by both the analog
 * clock (clock-page.js) and the world-map Cities page (cities-page.js).
 *
 * Exposes a single global `window.ATSTzUtils` to avoid duplicating the
 * Intl.DateTimeFormat plumbing in every consumer. Must be loaded before
 * the pages that depend on it (plain <script src=…> ordering, no modules).
 */
(function () {
  'use strict';

  // Offset in minutes east of UTC for `tz` at the given `date` (DST-aware).
  // Returns 0 on any parsing failure so callers can still render something.
  function getTzOffsetMin(tz, date) {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' });
      const tzn = fmt.formatToParts(date).find(function (p) { return p.type === 'timeZoneName'; }).value;
      const m = /GMT(?:([+-−])(\d{1,2})(?::(\d{2}))?)?/.exec(tzn);
      if (!m || !m[1]) return 0;
      const sign = (m[1] === '-' || m[1] === '−') ? -1 : 1;
      const hours = parseInt(m[2], 10);
      const minutes = parseInt(m[3] || '0', 10);
      return sign * (hours * 60 + minutes);
    } catch (e) {
      return 0;
    }
  }

  // Local hour-of-day (0..24, fractional allowed) → fraction of the UTC day [0,1).
  // Used by the analog dial to position each city's daypart arcs.
  function localHourToDayFrac(tz, hour, today) {
    const offsetMin = getTzOffsetMin(tz, today);
    let utcHourMin = hour * 60 - offsetMin;
    utcHourMin = ((utcHourMin % 1440) + 1440) % 1440;
    return utcHourMin / 1440;
  }

  // Local "HH:MM" string + IANA tz → { bc: 0..99, milli: 0..9 } ATS micro slice.
  // The ATS day is encoded as 5 digits BCMBb; we return the leading BC + Milli.
  function localHHMMToAtsBCM(tz, hhmm, today) {
    const match = /^(\d{2}):(\d{2})$/.exec(hhmm || '');
    if (!match) return { bc: 0, milli: 0 };
    const localMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    const offsetMin = getTzOffsetMin(tz, today);
    let utcMin = localMin - offsetMin;
    utcMin = ((utcMin % 1440) + 1440) % 1440;
    const frac = utcMin / 1440;
    const fiveDigits = Math.floor(frac * 100000);
    return {
      bc:    Math.floor(fiveDigits / 1000),
      milli: Math.floor(fiveDigits / 100) % 10,
    };
  }

  // UTC minute-of-day → { bc, milli }. Used by the Cities reference instant.
  function utcMinToBCM(utcMin) {
    const frac = utcMin / 1440;
    const fiveDigits = Math.floor(frac * 100000);
    return {
      bc:    Math.floor(fiveDigits / 1000),
      milli: Math.floor(fiveDigits / 100) % 10,
    };
  }

  window.ATSTzUtils = {
    getTzOffsetMin: getTzOffsetMin,
    localHourToDayFrac: localHourToDayFrac,
    localHHMMToAtsBCM: localHHMMToAtsBCM,
    utcMinToBCM: utcMinToBCM,
  };
})();
