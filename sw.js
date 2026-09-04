const CACHE_NAME = 'offgrid-mesh-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'
];

// Step 1: Install event - cache all core application assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching off-grid assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Step 2: Activate event - clean up old caches if updated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Step 3: Fetch event - serve from local cache first (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached asset instantly
      }
      return fetch(event.request).catch(() => {
        // Fallback if network is completely dead and asset not cached
        return caches.match('./index.html');
      });
    })
  );
});