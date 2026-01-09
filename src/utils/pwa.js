/**
 * PWA Utility - v2.5.0
 * Handles PWA installation prompt and service worker
 */

let deferredPrompt = null;

/**
 * Initialize PWA functionality
 */
export function initPWA() {
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });
  
  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    hideInstallButton();
  });
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App is running in standalone mode');
  }
}

/**
 * Show install button/banner
 */
function showInstallButton() {
  // Check if install button already exists
  let installBtn = document.getElementById('pwa-install-btn');
  
  if (!installBtn) {
    installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'fixed bottom-20 right-4 z-40 px-4 py-3 rounded-xl bg-gradient-primary text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform';
    installBtn.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
      <span>Install App</span>
      <button class="ml-2 text-white/80 hover:text-white" onclick="this.closest('#pwa-install-btn').remove()">✕</button>
    `;
    
    installBtn.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return; // Ignore close button
      promptInstall();
    });
    
    document.body.appendChild(installBtn);
    
    // Animate in
    setTimeout(() => {
      installBtn.style.animation = 'fadeUp 0.3s ease-out';
    }, 100);
  }
}

/**
 * Hide install button
 */
function hideInstallButton() {
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.opacity = '0';
    installBtn.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => installBtn.remove(), 300);
  }
}

/**
 * Prompt user to install PWA
 */
export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to install prompt: ${outcome}`);
  
  if (outcome === 'accepted') {
    deferredPrompt = null;
    hideInstallButton();
    return true;
  }
  
  return false;
}

/**
 * Check if app can be installed
 */
export function canInstall() {
  return deferredPrompt !== null;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(swPath = '/public/sw.js') {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/'
    });
    
    console.log('Service Worker registered:', registration.scope);
    
    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          showUpdateNotification();
        }
      });
    });
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

/**
 * Show update notification
 */
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 flex items-center gap-3 max-w-sm';
  notification.innerHTML = `
    <div class="flex-1">
      <div class="font-semibold text-sm">New version available!</div>
      <div class="text-xs opacity-70 mt-1">Reload to update the app</div>
    </div>
    <button id="reload-btn" class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
      Reload
    </button>
  `;
  
  document.body.appendChild(notification);
  
  notification.querySelector('#reload-btn').addEventListener('click', () => {
    window.location.reload();
  });
}

/**
 * Unregister service worker (for development)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Worker unregistered');
  }
}
