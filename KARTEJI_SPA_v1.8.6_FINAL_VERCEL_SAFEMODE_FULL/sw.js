
const CACHE = 'karteji-v1.8.6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './src/main.js',
  './src/router.js',
  './src/render.js',
  './src/splashFinal.js',
  './src/styles.css',
  './src/lib/firebase.js',
  './src/lib/gates.js',
  './src/lib/theme.js',
  './src/lib/net.js',
  './src/lib/ui.js',
  './src/lib/themeEvents.js',
  './src/lib/cloudinary.js',
  './src/components/BottomNav.js',
  './src/components/Toast.js',
  './src/pages/index.js',
  './src/pages/home.js',
  './src/pages/auth/masuk.js',
  './src/pages/auth/daftar.js',
  './src/pages/auth/buatProfil.js',
  './src/pages/pending.js',
  './assets/logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(cached=>{
      const fetchPromise = fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=> cached || new Response('', {status: 504}));
      return cached || fetchPromise;
    })
  );
});
