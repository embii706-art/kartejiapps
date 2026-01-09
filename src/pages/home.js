export async function home() {
  return `
    <section class="p-4 space-y-4">
      <!-- Premium Header with Version Badge -->
      <div class="rounded-2xl glass card-3d p-6 shadow-xl">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white text-3xl">home</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold">Beranda</h2>
              <span class="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 py-1 rounded-full font-bold">v2.5</span>
            </div>
            <p class="text-sm text-slate-500">Selamat datang di KARTEJI Premium 👋</p>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-700/30">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span class="material-symbols-rounded text-[14px] text-green-500">verified</span>
            <span>Premium Stable Release • Enhanced Performance</span>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards with Enhanced 3D -->
      <div class="grid grid-cols-2 gap-3">
        <a href="#/activities" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-2xl transition-all duration-300">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">event</span>
          </div>
          <div class="font-semibold text-sm">Kegiatan</div>
          <div class="text-xs text-slate-500 mt-1">Kelola acara</div>
        </a>

        <a href="#/finance" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-2xl transition-all duration-300">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">account_balance_wallet</span>
          </div>
          <div class="font-semibold text-sm">Keuangan</div>
          <div class="text-xs text-slate-500 mt-1">Kas & laporan</div>
        </a>

        <a href="#/calendar" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-2xl transition-all duration-300">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">calendar_today</span>
          </div>
          <div class="font-semibold text-sm">Kalender</div>
          <div class="text-xs text-slate-500 mt-1">Jadwal libur</div>
        </a>

        <a href="#/members" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-2xl transition-all duration-300">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span class="material-symbols-rounded text-white">group</span>
          </div>
          <div class="font-semibold text-sm">Anggota</div>
          <div class="text-xs text-slate-500 mt-1">Daftar member</div>
        </a>
      </div>

      <!-- Premium Features Showcase -->
      <div class="rounded-2xl glass-strong card-3d p-5 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-2xl text-purple-500">auto_awesome</span>
            <h3 class="font-bold text-lg">Premium Features</h3>
          </div>
          <span class="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg">NEW in v2.5</span>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-rounded text-[16px] text-white">3d_rotation</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Interactive 3D Card Effects</div>
              <div class="text-xs text-slate-500 mt-0.5">Hardware-accelerated smooth animations</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-rounded text-[16px] text-white">blur_on</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Premium Glassmorphism UI</div>
              <div class="text-xs text-slate-500 mt-0.5">iOS/macOS-style frosted glass design</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-rounded text-[16px] text-white">search</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Advanced Smart Search</div>
              <div class="text-xs text-slate-500 mt-0.5">Fuzzy matching • Press "/" to search</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-rounded text-[16px] text-white">share</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Social Media Integration</div>
              <div class="text-xs text-slate-500 mt-0.5">One-click sharing to all platforms</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-rounded text-[16px] text-white">install_mobile</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-slate-800 dark:text-slate-100">Full PWA Capabilities</div>
              <div class="text-xs text-slate-500 mt-0.5">Smart install prompts • Offline support</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Stats -->
      <div class="rounded-2xl glass border border-slate-200/30 dark:border-slate-700/30 p-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-rounded text-xl text-green-500">speed</span>
          <h3 class="font-semibold text-sm">Performance Improvements</h3>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">40%</div>
            <div class="text-xs text-slate-500 mt-1">Faster Load</div>
          </div>
          <div class="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">60%</div>
            <div class="text-xs text-slate-500 mt-1">Less Memory</div>
          </div>
          <div class="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
            <div class="text-xs text-slate-500 mt-1">Stable</div>
          </div>
        </div>
      </div>

      <!-- Getting Started -->
      <div class="rounded-2xl glass border border-slate-200/30 dark:border-slate-700/30 p-4 text-center">
        <span class="material-symbols-rounded text-4xl text-slate-400 mb-2 block">rocket_launch</span>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          <b>Mulai sekarang!</b><br/>
          Buat <b>Pengumuman</b> atau <b>Kegiatan</b> pertama Anda.
        </p>
      </div>
    </section>
  `;
}
