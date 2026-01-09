export function renderHome() {
  return `
    <section class="p-4 pb-20 space-y-4">
      <!-- Welcome Card with Gradient -->
      <div class="rounded-2xl glass p-6 shadow-xl bg-gradient-primary text-white">
        <h2 class="text-2xl font-bold">Selamat Datang 👋</h2>
        <p class="text-sm opacity-90 mt-2">
          KARTEJI v2.5.0 - Modern organization management dengan UI premium
        </p>
      </div>

      <!-- Search Bar with Glassmorphism -->
      <div class="glass rounded-xl p-3 shadow-lg">
        <div class="flex items-center gap-2">
          <span class="material-symbols-rounded text-slate-600 dark:text-slate-400">search</span>
          <input 
            type="text" 
            id="home-search" 
            placeholder="Cari aktivitas, anggota, atau konten..."
            class="flex-1 bg-transparent border-none outline-none text-sm"
          />
        </div>
      </div>

      <!-- Quick Stats Grid with 3D Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="card-3d rounded-xl glass p-4 shadow-lg">
          <div class="text-3xl mb-2">📊</div>
          <div class="text-lg font-bold">24</div>
          <div class="text-xs text-slate-600 dark:text-slate-400">Kegiatan</div>
        </div>
        <div class="card-3d rounded-xl glass p-4 shadow-lg">
          <div class="text-3xl mb-2">👥</div>
          <div class="text-lg font-bold">156</div>
          <div class="text-xs text-slate-600 dark:text-slate-400">Anggota</div>
        </div>
        <div class="card-3d rounded-xl glass p-4 shadow-lg">
          <div class="text-3xl mb-2">💰</div>
          <div class="text-lg font-bold">Rp 2.5M</div>
          <div class="text-xs text-slate-600 dark:text-slate-400">Kas</div>
        </div>
        <div class="card-3d rounded-xl glass p-4 shadow-lg">
          <div class="text-3xl mb-2">📝</div>
          <div class="text-lg font-bold">12</div>
          <div class="text-xs text-slate-600 dark:text-slate-400">Dokumen</div>
        </div>
      </div>

      <!-- Recent Activity with Share Button -->
      <div class="glass rounded-2xl p-4 shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Aktivitas Terbaru</h3>
          <button id="share-btn" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <span class="material-symbols-rounded text-[20px]">share</span>
          </button>
        </div>
        <div class="space-y-2">
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-blue-500">event</span>
              <div class="flex-1">
                <div class="text-sm font-medium">Rapat Koordinasi</div>
                <div class="text-xs text-slate-600 dark:text-slate-400">2 jam yang lalu</div>
              </div>
            </div>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-green-500">task_alt</span>
              <div class="flex-1">
                <div class="text-sm font-medium">Laporan Keuangan Q4</div>
                <div class="text-xs text-slate-600 dark:text-slate-400">5 jam yang lalu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button class="btn-gradient rounded-xl py-3 px-4 font-semibold shadow-lg">
          <span class="material-symbols-rounded inline-block mr-1">add</span>
          Buat Kegiatan
        </button>
        <button class="rounded-xl py-3 px-4 font-semibold border border-slate-300 dark:border-slate-700 glass shadow-lg">
          <span class="material-symbols-rounded inline-block mr-1">analytics</span>
          Lihat Laporan
        </button>
      </div>
    </section>
    
    <script type="module">
      import { initCard3D } from '/src/utils/card3d.js';
      import { shareContent } from '/src/utils/share.js';
      
      // Initialize 3D cards
      setTimeout(() => initCard3D('.card-3d'), 100);
      
      // Setup share button
      const shareBtn = document.getElementById('share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
          const result = await shareContent({
            title: 'KARTEJI - Aktivitas Terbaru',
            text: 'Lihat aktivitas terbaru organisasi kami',
            url: window.location.href
          });
          
          if (result.success && window.toast) {
            window.toast(result.method === 'native' ? 'Berhasil dibagikan!' : 'Link disalin ke clipboard!');
          }
        });
      }
      
      // Setup search
      const searchInput = document.getElementById('home-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          console.log('Searching for:', e.target.value);
          // Search functionality can be extended here
        });
      }
    </script>
  `;
}
