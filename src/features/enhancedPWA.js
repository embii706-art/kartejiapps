/**
 * Enhanced PWA Features
 * Better install prompts and offline handling
 */

export class EnhancedPWA {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.checkInstallStatus();
  }

  checkInstallStatus() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
    if (navigator.standalone === true) {
      this.isInstalled = true; // iOS
    }
  }

  init() {
    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Show custom install prompt after delay
      if (!this.isInstalled && !localStorage.getItem('pwa_prompt_dismissed')) {
        setTimeout(() => this.showInstallPrompt(), 30000); // Show after 30 seconds
      }
    });

    // Detect if app was installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      localStorage.setItem('pwa_installed', 'true');
      this.showSuccessMessage();
    });

    // Add install button to UI if available
    if (!this.isInstalled) {
      this.addInstallButton();
    }
  }

  showInstallPrompt() {
    if (!this.deferredPrompt || this.isInstalled) return;
    
    const prompt = document.createElement('div');
    prompt.id = 'pwaPrompt';
    prompt.className = 'fixed bottom-20 left-4 right-4 z-[9998] sm:left-auto sm:right-4 sm:w-96';
    prompt.innerHTML = `
      <div class="glass-strong rounded-2xl shadow-2xl p-4 scale-in">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-xl bg-[rgb(var(--primary))] flex items-center justify-center flex-shrink-0">
            <img src="/apple-touch-icon.png" alt="KARTEJI" class="w-10 h-10 rounded-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm mb-1">Install KARTEJI</div>
            <div class="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Install aplikasi untuk akses cepat dan pengalaman yang lebih baik
            </div>
            <div class="flex gap-2">
              <button id="pwaInstall" class="flex-1 py-2 px-3 rounded-lg bg-[rgb(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition">
                Install
              </button>
              <button id="pwaDismiss" class="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Nanti
              </button>
            </div>
          </div>
          <button id="pwaClose" class="flex-shrink-0 w-6 h-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">
            <span class="material-symbols-rounded text-[16px]">close</span>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    document.getElementById('pwaInstall')?.addEventListener('click', () => {
      this.promptInstall();
      prompt.remove();
    });
    
    document.getElementById('pwaDismiss')?.addEventListener('click', () => {
      localStorage.setItem('pwa_prompt_dismissed', Date.now());
      prompt.remove();
    });
    
    document.getElementById('pwaClose')?.addEventListener('click', () => {
      localStorage.setItem('pwa_prompt_dismissed', Date.now());
      prompt.remove();
    });
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      this.showIOSInstructions();
      return;
    }
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    this.deferredPrompt = null;
  }

  showIOSInstructions() {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
      <div class="relative glass-strong w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 slide-in-right">
        <div class="text-center">
          <div class="w-16 h-16 rounded-2xl bg-[rgb(var(--primary))] mx-auto mb-4 flex items-center justify-center">
            <span class="material-symbols-rounded text-3xl text-white">install_mobile</span>
          </div>
          <h3 class="text-lg font-bold mb-2">Install KARTEJI di iOS</h3>
          <div class="text-sm text-slate-600 dark:text-slate-300 space-y-3 text-left mb-4">
            <div class="flex gap-3">
              <span class="material-symbols-rounded text-[rgb(var(--primary))]">share</span>
              <div>
                <div class="font-semibold">1. Tap tombol Share</div>
                <div class="text-xs opacity-70">Di toolbar bagian bawah Safari</div>
              </div>
            </div>
            <div class="flex gap-3">
              <span class="material-symbols-rounded text-[rgb(var(--primary))]">add_box</span>
              <div>
                <div class="font-semibold">2. Tap "Add to Home Screen"</div>
                <div class="text-xs opacity-70">Scroll ke bawah jika perlu</div>
              </div>
            </div>
            <div class="flex gap-3">
              <span class="material-symbols-rounded text-[rgb(var(--primary))]">check_circle</span>
              <div>
                <div class="font-semibold">3. Tap "Add"</div>
                <div class="text-xs opacity-70">Aplikasi akan muncul di home screen</div>
              </div>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full py-3 px-4 rounded-xl bg-[rgb(var(--primary))] text-white font-semibold hover:opacity-90 transition">
            Mengerti
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  addInstallButton() {
    // Add install button to header
    const header = document.querySelector('header .flex');
    if (header && !document.getElementById('installBtn')) {
      const installBtn = document.createElement('button');
      installBtn.id = 'installBtn';
      installBtn.className = 'w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition';
      installBtn.innerHTML = '<span class="material-symbols-rounded text-[22px]">install_mobile</span>';
      installBtn.onclick = () => this.promptInstall();
      header.insertBefore(installBtn, header.lastElementChild);
    }
  }

  showSuccessMessage() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[9999] scale-in';
    toast.innerHTML = `
      <div class="glass-strong px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <span class="material-symbols-rounded text-green-500 text-2xl">check_circle</span>
        <div>
          <div class="font-bold text-sm">Berhasil Install!</div>
          <div class="text-xs text-slate-600 dark:text-slate-300">KARTEJI sudah ada di perangkat Anda</div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // Offline indicator enhancement
  enhanceOfflineIndicator() {
    window.addEventListener('online', () => {
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[9999] scale-in';
      toast.innerHTML = `
        <div class="glass-strong px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span class="material-symbols-rounded text-green-500">wifi</span>
          <span class="font-semibold text-sm">Kembali online</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });
  }
}

// Global instance
export const enhancedPWA = new EnhancedPWA();
