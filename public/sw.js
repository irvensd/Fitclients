// Service Worker for FitClient App
const CACHE_NAME = 'fitclients-v1';
const STATIC_CACHE = 'fitclients-static-v1';
const DYNAMIC_CACHE = 'fitclients-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        // Caching static files
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            // Deleting old cache
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip unsupported URL schemes (chrome-extension, moz-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip browser extension URLs and other non-cacheable schemes
  if (url.protocol === 'chrome-extension:' || 
      url.protocol === 'moz-extension:' || 
      url.protocol === 'safari-extension:' ||
      url.protocol === 'edge-extension:') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/assets/')) {
    // Cache assets (JS, CSS, images)
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  } else if (url.pathname.startsWith('/api/')) {
    // Network first for API calls
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Static pages - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Additional safety check - don't cache unsupported URL schemes
    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) {
      return fetch(request);
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page or fallback
    return new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    // Additional safety check - don't cache unsupported URL schemes
    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) {
      return fetch(request);
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync tasks
  // Background sync triggered
  // You can add offline action handling here
} 