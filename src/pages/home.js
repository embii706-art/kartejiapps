export async function home() {
  return `
    <section class="p-4 space-y-4">
      <div class="rounded-2xl glass card-3d p-6 shadow-xl">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="material-symbols-rounded text-white text-2xl">home</span>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold">Beranda</h2>
            <p class="text-sm text-slate-500">Selamat datang di KARTEJI 👋</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <a href="#/activities" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-xl transition">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-2 flex items-center justify-center">
            <span class="material-symbols-rounded text-blue-600 dark:text-blue-400">event</span>
          </div>
          <div class="font-semibold text-sm">Kegiatan</div>
          <div class="text-xs text-slate-500 mt-1">Kelola acara</div>
        </a>

        <a href="#/finance" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-xl transition">
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-2 flex items-center justify-center">
            <span class="material-symbols-rounded text-green-600 dark:text-green-400">account_balance_wallet</span>
          </div>
          <div class="font-semibold text-sm">Keuangan</div>
          <div class="text-xs text-slate-500 mt-1">Kas & laporan</div>
        </a>

        <a href="#/calendar" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-xl transition">
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-2 flex items-center justify-center">
            <span class="material-symbols-rounded text-purple-600 dark:text-purple-400">calendar_today</span>
          </div>
          <div class="font-semibold text-sm">Kalender</div>
          <div class="text-xs text-slate-500 mt-1">Jadwal libur</div>
        </a>

        <a href="#/members" class="block rounded-xl glass-strong card-3d-lift p-4 text-center hover:shadow-xl transition">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mx-auto mb-2 flex items-center justify-center">
            <span class="material-symbols-rounded text-orange-600 dark:text-orange-400">group</span>
          </div>
          <div class="font-semibold text-sm">Anggota</div>
          <div class="text-xs text-slate-500 mt-1">Daftar member</div>
        </a>
      </div>

      <div class="rounded-2xl glass-strong card-3d p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold">Fitur Terbaru ✨</h3>
          <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-semibold">v2.0</span>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="material-symbols-rounded text-[16px] text-blue-500">auto_awesome</span>
            <span>3D Card Effects & Animasi Smooth</span>
          </div>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="material-symbols-rounded text-[16px] text-purple-500">blur_on</span>
            <span>Glassmorphism UI Design</span>
          </div>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="material-symbols-rounded text-[16px] text-green-500">search</span>
            <span>Smart Search (Tekan "/" untuk cari)</span>
          </div>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="material-symbols-rounded text-[16px] text-orange-500">share</span>
            <span>Social Media Sharing</span>
          </div>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span class="material-symbols-rounded text-[16px] text-red-500">install_mobile</span>
            <span>Enhanced PWA Install Prompts</span>
          </div>
        </div>
      </div>

      <div class="rounded-2xl glass border border-slate-200/30 dark:border-slate-700/30 p-4 text-center">
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Belum ada data ditampilkan.<br/>
          Mulai dengan membuat <b>Pengumuman</b> atau <b>Kegiatan</b>.
        </p>
      </div>
    </section>
  `;
}
