/* Collection-Bound service worker
 *
 * What it caches:
 *   - the app shell (this folder's own files): cache-first, refreshed in the background
 *   - card set / product JSON from jsDelivr and card images: stale-while-revalidate,
 *     so the binder still opens on a plane or at a card shop with bad signal
 *
 * What it never touches:
 *   - Supabase (logins, binders, prices), Stripe, PayPal, Patreon. Those always go
 *     straight to the network so nobody ever sees someone else's data or a stale price.
 *
 * Bump CACHE_VERSION whenever the tracker code changes so phones pick up the new build.
 */
const CACHE_VERSION = 'cb-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

const NEVER_CACHE = [
  'supabase.co',
  'supabase.in',
  'stripe.com',
  'paypal.com',
  'patreon.com',
];

const DATA_HOSTS = [
  'cdn.jsdelivr.net',
  'raw.githubusercontent.com',
  'ddragon.leagueoflegends.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (NEVER_CACHE.some((h) => url.hostname.endsWith(h))) return;

  // Page navigations: network first, fall back to the cached shell, then the offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(async () => (await caches.match('/index.html')) || caches.match('/offline.html'))
    );
    return;
  }

  // Our own files: cache first, update in the background.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
    return;
  }

  // Card data and images.
  const isImage = req.destination === 'image';
  if (isImage || DATA_HOSTS.some((h) => url.hostname.endsWith(h))) {
    event.respondWith(staleWhileRevalidate(req, DATA_CACHE));
  }
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      // Opaque responses (cross-origin images without CORS) are fine to keep too.
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}
