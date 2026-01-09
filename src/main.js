/**
 * main.js - v2.5.0
 * Enhanced with new v2.5.0 features:
 * - 3D Card Effects
 * - Glassmorphism UI
 * - Smart Search
 * - Social Sharing
 * - Enhanced PWA Support
 */
import "./splashFinal.js";
import "./styles.css";

import { initFirebase } from './lib/firebase.js';
import { router } from './router.js';
import { mountBottomNav } from './components/BottomNav.js';
import { toast } from './components/Toast.js';
import { theme } from './lib/theme.js';
import { net } from './lib/net.js';
import { themeEvents } from './lib/themeEvents.js';

// v2.5.0 Feature Imports
import { initCard3D } from './utils/card3d.js';
import { initPWA, registerServiceWorker } from './utils/pwa.js';
import { setOGMetaTags } from './utils/share.js';

// Make toast available globally for utilities
window.toast = toast;

function removeSplash(reason = "") {
  try { window.KARTEJI_SPLASH?.done(reason); } catch {}
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('opacity-0');
    setTimeout(() => splash.remove(), 320);
  }
}

function withTimeout(promise, ms, label = "timeout") {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

// Watchdog: prevent getting stuck
const watchdog = setTimeout(() => {
  removeSplash("Menyiapkan aplikasi…");
  const app = document.getElementById('app');
  if (app && !app.innerHTML.trim()) {
    app.innerHTML = `
      <section class="p-4 space-y-3 max-w-md mx-auto">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 glass">
          <h2 class="font-semibold">Aplikasi siap, namun UI belum muncul.</h2>
          <p class="text-sm opacity-80 mt-1">
            Ini biasanya karena modul JS terhambat (cache PWA / jaringan / hosting).
          </p>
          <div class="flex gap-2 mt-3">
            <button id="btnReload" class="w-full rounded-xl px-4 py-2 btn-gradient">Muat Ulang</button>
            <button id="btnHome" class="w-full rounded-xl px-4 py-2 border border-slate-300 dark:border-slate-600">Buka Home</button>
          </div>
        </div>
      </section>
    `;
    app.querySelector('#btnReload')?.addEventListener('click', () => location.reload());
    app.querySelector('#btnHome')?.addEventListener('click', () => { location.hash = '#/home'; });
  }
}, 5000);

window.addEventListener('error', (e) => {
  console.error("GLOBAL ERROR", e?.error || e);
  toast('Terjadi kesalahan saat memuat aplikasi.');
  removeSplash("Terjadi kendala…");
});

window.addEventListener('unhandledrejection', (e) => {
  console.error("UNHANDLED", e?.reason || e);
  toast('Terjadi kesalahan saat memuat aplikasi.');
  removeSplash("Terjadi kendala…");
});

(async function boot(){
  try {
    // Initialize theme and network detection
    theme.init();
    net.init();

    // Initialize v2.5.0 PWA features
    initPWA();
    
    // Set Open Graph meta tags
    setOGMetaTags({
      title: 'KARTEJI - Modern Organization Management',
      description: 'Modern SPA with premium UI for organization management',
      image: '/public/icon-512.png'
    });

    // Start router
    mountBottomNav();
    router.start();

    // Firebase (timeout anti-hang)
    await withTimeout(initFirebase(), 8000, "initFirebase timeout");

    // Register enhanced service worker
    await registerServiceWorker('/public/sw.js');

    // Dynamic theme overlay (timeout anti-hang)
    await withTimeout(themeEvents.init(), 5000, "themeEvents timeout").catch(() => {});

    // Initialize 3D card effects after DOM is ready
    setTimeout(() => {
      initCard3D('.card-3d');
    }, 500);

  } catch(err) {
    console.error(err);
    toast('Terjadi kesalahan saat memuat aplikasi.');
  } finally {
    clearTimeout(watchdog);
    removeSplash("");
  }
})();
