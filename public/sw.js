const CACHE_VERSION = 'taelos-shell-v3';
const OFFLINE_URL = '/offline';
const PRECACHE_URLS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/favicon.svg?v=3',
  '/icon-192.png?v=3',
  '/icon-512.png?v=3',
  '/icon-maskable-512.png?v=3',
  '/apple-touch-icon.png?v=3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter(
                (key) =>
                  (key.startsWith('dudu-shell-') ||
                    key.startsWith('taelos-shell-')) &&
                  key !== CACHE_VERSION,
              )
              .map((key) => caches.delete(key)),
          ),
        ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_VERSION);
        return cache.match(OFFLINE_URL);
      }),
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    ['font', 'image', 'script', 'style'].includes(request.destination);

  if (!isStaticAsset || url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          void caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      });
    }),
  );
});
