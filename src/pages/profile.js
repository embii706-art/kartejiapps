
import { auth } from '../utils/firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { toast } from '../components/Toast.js';

export async function profile(){
  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email || 'Pengguna';
  const email = user?.email || 'Tidak ada email';

  // Setup event listener immediately after render
  setTimeout(() => {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', async () => {
        try {
          await signOut(auth);
          toast('Berhasil keluar');
          location.hash = '#/auth/masuk';
        } catch (e) {
          console.error(e);
          toast('Gagal keluar: ' + e.message);
        }
      });
    }
  }, 50);

  return `
    <section class="p-4 space-y-4 max-w-md mx-auto">
      <div class="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white text-2xl font-bold">
            ${displayName.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1">
            <div class="font-semibold text-lg">${escapeHtml(displayName)}</div>
            <div class="text-sm text-[var(--muted)]">${escapeHtml(email)}</div>
          </div>
        </div>

        <div class="space-y-2">
          <a href="#/calendar" class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
            <span class="material-symbols-rounded text-[22px]">calendar_today</span>
            <span>Kalender</span>
          </a>
          <a href="#/members" class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
            <span class="material-symbols-rounded text-[22px]">group</span>
            <span>Daftar Anggota</span>
          </a>
          <a href="#/minutes" class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
            <span class="material-symbols-rounded text-[22px]">description</span>
            <span>Notulen</span>
          </a>
          <a href="#/documents" class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
            <span class="material-symbols-rounded text-[22px]">folder</span>
            <span>Dokumen</span>
          </a>
          <a href="#/periods" class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-3">
            <span class="material-symbols-rounded text-[22px]">date_range</span>
            <span>Periode</span>
          </a>
        </div>
      </div>

      <div class="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <button id="btnLogout" class="w-full py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition flex items-center justify-center gap-2">
          <span class="material-symbols-rounded text-[20px]">logout</span>
          <span>Keluar</span>
        </button>
      </div>
    </section>
  `;
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}
