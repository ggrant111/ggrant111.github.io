const CACHE_NAME = "leadgen-v1";

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

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip some third-party requests and non-http(s) requests
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith("http")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();

          // Don't cache auth related requests
          if (!event.request.url.match(/^(.*)?\/api\/auth\/(.*)$/)) {
            caches.open(CACHE_NAME).then((cache) => {
              // Add fetched resource to cache
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // If both cache and network fail, serve offline page
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          // For non-HTML requests, return nothing
          return new Response("", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
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
