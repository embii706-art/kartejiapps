export async function home() {
  return `
    <section class="p-4 space-y-4">
      <!-- Premium Header with Gradient -->
      <div class="rounded-2xl glass card-3d p-6 shadow-premium">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white text-3xl">home</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold gradient-text">Beranda</h2>
              <span class="text-xs gradient-primary text-white px-2.5 py-1 rounded-full font-bold shadow-lg">v2.5</span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Selamat datang di KARTEJI Premium 👋</p>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-700/30">
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span class="material-symbols-rounded text-[14px] text-green-500">verified</span>
            <span>Premium Stable Release • Enhanced Performance</span>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards with Premium Gradients -->
      <div class="grid grid-cols-2 gap-3">
        <a href="#/activities" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-premium transition-all duration-300">
          <div class="w-12 h-12 rounded-full gradient-primary mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">event</span>
          </div>
          <div class="font-semibold text-sm">Kegiatan</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelola acara</div>
        </a>

        <a href="#/finance" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-premium transition-all duration-300">
          <div class="w-12 h-12 rounded-full gradient-accent mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">account_balance_wallet</span>
          </div>
          <div class="font-semibold text-sm">Keuangan</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Kas & laporan</div>
        </a>

        <a href="#/calendar" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-premium transition-all duration-300">
          <div class="w-12 h-12 rounded-full gradient-secondary mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">calendar_today</span>
          </div>
          <div class="font-semibold text-sm">Kalender</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Jadwal libur</div>
        </a>

        <a href="#/members" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-premium transition-all duration-300">
          <div class="w-12 h-12 rounded-full gradient-primary mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">group</span>
          </div>
          <div class="font-semibold text-sm">Anggota</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Daftar member</div>
        </a>
      </div>

      <!-- Premium Features Showcase with Gradient -->
      <div class="rounded-2xl glass-strong card-3d p-5 shadow-premium">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-2xl gradient-text">auto_awesome</span>
            <h3 class="font-bold text-lg">Premium Features</h3>
          </div>
          <span class="text-xs gradient-secondary text-white px-3 py-1.5 rounded-full font-bold shadow-lg gradient-animate">NEW in v2.5</span>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow">
              <span class="material-symbols-rounded text-[16px] text-white">3d_rotation</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Interactive 3D Card Effects</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hardware-accelerated smooth animations</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0 shadow">
              <span class="material-symbols-rounded text-[16px] text-white">blur_on</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Premium Glassmorphism UI</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modern frosted glass with purple theme</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0 shadow">
              <span class="material-symbols-rounded text-[16px] text-white">search</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Advanced Smart Search</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fuzzy matching • Press "/" to search</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow">
              <span class="material-symbols-rounded text-[16px] text-white">share</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Social Media Integration</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">One-click sharing to all platforms</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0 shadow">
              <span class="material-symbols-rounded text-[16px] text-white">install_mobile</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Full PWA Capabilities</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Smart install prompts • Offline support</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Stats with Gradient Accents -->
      <div class="rounded-2xl glass border border-slate-200/30 dark:border-slate-700/30 p-4 shadow-premium">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-rounded text-xl gradient-text">speed</span>
          <h3 class="font-semibold text-sm">Performance Improvements</h3>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2 rounded-lg glass">
            <div class="text-2xl font-bold gradient-text">40%</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Faster Load</div>
          </div>
          <div class="p-2 rounded-lg glass">
            <div class="text-2xl font-bold gradient-text">60%</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Less Memory</div>
          </div>
          <div class="p-2 rounded-lg glass">
            <div class="text-2xl font-bold gradient-text">100%</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Stable</div>
          </div>
        </div>
      </div>

      <!-- Getting Started with Gradient -->
      <div class="rounded-2xl glass border border-slate-200/30 dark:border-slate-700/30 p-4 text-center shadow-premium">
        <span class="material-symbols-rounded text-4xl gradient-text mb-2 block">rocket_launch</span>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          <b>Mulai sekarang!</b><br/>
          Buat <b>Pengumuman</b> atau <b>Kegiatan</b> pertama Anda.
        </p>
      </div>
    </section>
  `;
}
