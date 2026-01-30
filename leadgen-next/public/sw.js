// `leadgen-0.1.0-1769748971234` will be replaced at build/deploy time with a unique cache name.
// This ensures each release uses a new cache and clients pick up updates automatically.
const CACHE_NAME = "__SW_CACHE_NAME__";

// Basic files to cache initially
const urlsToCache = ["/", "/manifest.json", "/leadgenlogo_square.svg"];

// Function to cache files dynamically
async function cacheAssets() {
  const cache = await caches.open(CACHE_NAME);

  // Try to cache the initial URLs
  try {
    await cache.addAll(urlsToCache);
    console.log("Initial assets cached successfully");
  } catch (error) {
    console.error("Failed to cache initial assets", error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAssets());
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Handle fetch events with strategies tuned for updates:
// - navigation (HTML): network-first (ensures users get latest HTML)
// - same-origin assets: stale-while-revalidate (fast + updates cache in background)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Ignore non-http(s) or cross-origin requests
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith("http")
  ) {
    return;
  }

  const acceptHeader = event.request.headers.get('accept') || '';

  // Network-first for navigation requests (HTML pages)
  if (event.request.mode === 'navigate' || acceptHeader.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Update cache with latest HTML
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return networkResponse;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // For same-origin assets (css, js, images, json): stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request.clone())
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => undefined);

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim any clients immediately
  self.clients.claim();
});

// Allow the page to trigger immediate activation of a waiting worker
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener("push", function (event) {
  let payload;
  try {
    payload = JSON.parse(event.data.text());
  } catch (e) {
    console.error("Error parsing push payload:", e);
    return;
  }

  const options = {
    body: payload.body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: payload.data,
    actions: [
      {
        action: "explore",
        title: "View Lead",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/dashboard"));
  }
});
