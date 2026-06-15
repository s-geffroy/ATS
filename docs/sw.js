/**
 * sw.js — ATS service worker (§3.2).
 *
 * Strategy:
 *   • Pre-cache the application shell on install: clock pages (FR + EN),
 *     style, the 4 JS modules, and the SVG icon.
 *   • Fetch handler:
 *       - cache-first for /assets/  (long-lived, content-addressed-ish)
 *       - network-first for HTML, with /fr/ as the offline fallback
 *       - pass-through everything else
 *   • Activate sweeps old caches.
 *
 * v0.7.0 Kilo-versaire background sync hook lives in registerSync().
 * See §5.6 CHANGELOG entry for the best-effort limits documentation.
 *
 * CACHE_NAME MUST track the project version (package.json / pyproject.toml).
 * Bumping it triggers the activate handler's sweep of older `ats-*` caches,
 * preventing stale asset bundles from sticking on returning visitors.
 */

const CACHE_NAME = 'ats-v0.7.0';
const SHELL_BASE = self.registration ? new URL(self.registration.scope).pathname : '/ATS/';

const SHELL = [
  SHELL_BASE,
  SHELL_BASE + 'fr/',
  SHELL_BASE + 'en/',
  SHELL_BASE + 'assets/css/style.css',
  SHELL_BASE + 'assets/js/ats.js',
  SHELL_BASE + 'assets/js/ats-clock.js',
  SHELL_BASE + 'assets/js/clock-page.js',
  SHELL_BASE + 'assets/js/site.js',
  SHELL_BASE + 'assets/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL).catch(() => {
      // Best-effort pre-cache; never block install if a shell URL is missing
      // (the fallback fetch handler will still serve from network on demand).
    })),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n.startsWith('ats-') && n !== CACHE_NAME)
             .map((n) => caches.delete(n)),
      ),
    ).then(() => self.clients.claim()),
  );
});

function isAsset(url) {
  return url.pathname.includes('/assets/');
}

function isHtmlGet(req) {
  if (req.method !== 'GET') return false;
  const accept = req.headers.get('accept') || '';
  return accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return res;
        }),
      ),
    );
    return;
  }

  if (isHtmlGet(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) =>
            cached || caches.match(SHELL_BASE + 'fr/'),
          ),
        ),
    );
  }
});

// Best-effort Kilo-versaire periodic check (§5.6). Requires Chrome with
// the PWA installed AND user permission for periodic-background-sync.
// Falls back to no-op everywhere else; in-page detection in age.html
// handles the on-open case.
self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'ats-kilo-versaire-check') return;
  event.waitUntil(checkKiloVersaire());
});

async function checkKiloVersaire() {
  try {
    const clientsList = await self.clients.matchAll({ type: 'window' });
    const sample = clientsList[0];
    if (!sample) return; // No window open — silently noop.
    const reply = await new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (ev) => resolve(ev.data || null);
      sample.postMessage({ type: 'ATS_BIRTHDATE_QUERY' }, [channel.port2]);
      setTimeout(() => resolve(null), 500);
    });
    if (!reply || !reply.birthIso) return;

    const epochMs = Date.parse('1969-07-20T00:00:00Z');
    const birthMs = Date.parse(reply.birthIso);
    if (!Number.isFinite(birthMs)) return;
    const nowMs = Date.now();
    const dayMs = 86_400_000;
    const dBirth = Math.floor((birthMs - epochMs) / dayMs);
    const dNow = Math.floor((nowMs - epochMs) / dayMs);
    const age = dNow - dBirth;
    const nextKilo = Math.ceil(age / 1000) * 1000;
    const daysToKilo = nextKilo - age;
    if (daysToKilo >= 0 && daysToKilo <= 2) {
      await self.registration.showNotification('Δ Kilo-versaire imminent', {
        body: `Vous atteignez ${nextKilo} Δd dans ${daysToKilo} jour${daysToKilo === 1 ? '' : 's'}.`,
        icon: SHELL_BASE + 'assets/icon-192.png',
        badge: SHELL_BASE + 'assets/icon-192.png',
        tag: `kilo-${nextKilo}`,
      });
    }
  } catch (e) {
    // Best-effort — silently swallow.
  }
}
