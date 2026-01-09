/**
 * KARTEJI V2.5 - Enhanced Service Worker
 * Advanced caching strategies with background sync and push notifications
 */

const CACHE_VERSION = 'karteji-v2.5.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// App Shell - Critical files for offline functionality
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './src/main.js',
  './src/router.js',
  './src/render.js',
  './src/styles.css',
  './src/pages/index.js',
  './src/components/SmartSearch.js',
  './src/components/SocialShare.js',
  './src/components/Card3D.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

const MAX_CACHE_SIZE = 50;
const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Install event - Cache app shell
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.5...');
  
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.5...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('karteji-') && name !== CACHE_STATIC && name !== CACHE_DYNAMIC && name !== CACHE_IMAGES)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
      .catch(err => console.error('[SW] Activate failed:', err))
  );
});

/**
 * Fetch event - Serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch with caching strategies
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  
  // Strategy 1: Cache First for static assets
  if (isStaticAsset(url.pathname)) {
    return cacheFirst(request, CACHE_STATIC);
  }
  
  // Strategy 2: Cache First for images
  if (isImage(url.pathname)) {
    return cacheFirst(request, CACHE_IMAGES);
  }
  
  // Strategy 3: Network First for API calls and dynamic content
  return networkFirst(request, CACHE_DYNAMIC);
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      // Return cached and update in background
      fetchAndCache(request, cacheName);
      return cached;
    }
    
    // Not in cache, fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page or error
    return new Response('Offline - No cached version', { status: 503 });
  }
}

/**
 * Fetch and cache in background
 */
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
  } catch (error) {
    // Silently fail
  }
}

/**
 * Limit cache size
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxSize);
  }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
  return pathname.endsWith('.js') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.html') ||
         pathname.endsWith('.json');
}

/**
 * Check if URL is an image
 */
function isImage(pathname) {
  return pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i);
}

/**
 * Background Sync - For offline operations
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement your background sync logic here
  console.log('[SW] Syncing data...');
}

/**
 * Push Notifications
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'KARTEJI';
  const options = {
    body: data.body || 'New notification',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

/**
 * Message Handler - Communication with main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      })
    );
  }
});

console.log('[SW] Service Worker v2.5 loaded');
