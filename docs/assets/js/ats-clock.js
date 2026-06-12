/**
 * <ats-clock> — Web Component for the Apollonian Time System.
 *
 * Attributes:
 *   format="short" | "canonical" | "both"   default: "short"
 *   lang="en" | "fr"                        default: "en"
 *   updates-per-second="N"                  default: 10
 *
 * Usage:
 *   <script src="https://s-geffroy.github.io/ATS/assets/js/ats-clock.js" defer></script>
 *   <ats-clock format="short"></ats-clock>
 *
 * Depends on the embedded ATS routines (no other JS required).
 */

(function () {
  'use strict';

  if (typeof customElements === 'undefined' || customElements.get('ats-clock')) return;

  const ATS_EPOCH_MS = Date.parse('1969-07-20T20:17:40Z');
  const ATS_DECIMALS = 5;
  const ATS_SCALE = 100000;
  const MS_PER_DAY = 86400000;

  function pad(n, w) { return String(n).padStart(w, '0'); }

  function atsFromMs(ms) {
    const deltaMs = ms - ATS_EPOCH_MS;
    const sign = deltaMs >= 0 ? 'T+' : 'T-';
    const absMs = Math.abs(deltaMs);
    const intDays = Math.floor(absMs / MS_PER_DAY);
    const dayRemainderMs = absMs - intDays * MS_PER_DAY;
    const frac = Math.floor((dayRemainderMs * ATS_SCALE) / MS_PER_DAY);
    const kilo = Math.floor(intDays / 1000);
    let rem = intDays % 1000;
    const hecto = Math.floor(rem / 100);
    rem = rem % 100;
    const deka = Math.floor(rem / 10);
    const kin = rem % 10;
    return { sign, kilo, hecto, deka, kin, frac };
  }

  function toCanonical(a) {
    return `${a.sign} Δ ${a.kilo}.${a.hecto}.${a.deka}.${a.kin}.${pad(a.frac, ATS_DECIMALS)}`;
  }

  function toShort(a) {
    const cc = Math.floor(a.frac / Math.pow(10, ATS_DECIMALS - 2));
    return `Δ ${a.kilo}.${a.hecto}.${a.deka}.${a.kin}/${pad(cc, 2)}`;
  }

  class AtsClock extends HTMLElement {
    static get observedAttributes() { return ['format', 'lang', 'updates-per-second']; }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._timer = null;
    }

    connectedCallback() {
      this._render();
      this._startTimer();
    }

    disconnectedCallback() {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }

    attributeChangedCallback() {
      if (!this.shadowRoot) return;
      this._render();
      this._startTimer();
    }

    _startTimer() {
      if (this._timer) clearInterval(this._timer);
      const ups = Math.max(1, Math.min(20, parseInt(this.getAttribute('updates-per-second') || '10', 10)));
      this._timer = setInterval(() => this._tick(), Math.round(1000 / ups));
      this._tick();
    }

    _render() {
      const format = this.getAttribute('format') || 'short';
      const lang = (this.getAttribute('lang') || 'en').toLowerCase();
      const labelShort = lang === 'fr' ? 'Δ ATS (court)' : 'Δ ATS (short)';
      const labelCanon = lang === 'fr' ? 'Δ ATS (canonique)' : 'Δ ATS (canonical)';

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            color: inherit;
          }
          .wrap { display: flex; flex-direction: column; gap: 0.15rem; align-items: center; }
          .label {
            font-size: 0.7rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            opacity: 0.6;
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          .value { font-size: clamp(1.2rem, 4vw, 2rem); letter-spacing: 0.02em; }
          .canonical { font-size: 0.95em; opacity: 0.85; }
        </style>
        <div class="wrap">
          ${format === 'canonical' || format === 'both' ? `
            <div class="label">${labelCanon}</div>
            <div class="value" data-slot="canonical">—</div>
          ` : ''}
          ${format === 'short' || format === 'both' ? `
            <div class="label">${labelShort}</div>
            <div class="value ${format === 'both' ? 'canonical' : ''}" data-slot="short">—</div>
          ` : ''}
        </div>
      `;
    }

    _tick() {
      const a = atsFromMs(Date.now());
      const shortEl = this.shadowRoot.querySelector('[data-slot="short"]');
      const canonEl = this.shadowRoot.querySelector('[data-slot="canonical"]');
      if (shortEl) shortEl.textContent = toShort(a);
      if (canonEl) canonEl.textContent = toCanonical(a);
    }
  }

  customElements.define('ats-clock', AtsClock);
})();
