import { collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";

let unsubscribe = null;

export function home() {
  setTimeout(() => loadHomeData(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <div class="rounded-xl bg-card p-4 shadow">
        <h2 class="text-lg font-semibold">Beranda</h2>
        <p class="text-sm opacity-70">
          Selamat datang di KARTEJI 👋
        </p>
      </div>

      <!-- Announcements Section -->
      <div class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-base">📢 Pengumuman</h3>
          <a href="#/announcements" class="text-xs text-primary">Lihat Semua</a>
        </div>
        <div id="announcements-list" class="space-y-2">
          <div class="text-sm opacity-70 text-center py-4">Memuat pengumuman...</div>
        </div>
      </div>

      <!-- Activities Section -->
      <div class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-base">📅 Kegiatan Terbaru</h3>
          <a href="#/activities" class="text-xs text-primary">Lihat Semua</a>
        </div>
        <div id="activities-list" class="space-y-2">
          <div class="text-sm opacity-70 text-center py-4">Memuat kegiatan...</div>
        </div>
      </div>

      <!-- Posts/Feed Section -->
      <div class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-base">💬 Feed Terbaru</h3>
          <a href="#/feed" class="text-xs text-primary">Lihat Semua</a>
        </div>
        <div id="posts-list" class="space-y-2">
          <div class="text-sm opacity-70 text-center py-4">Memuat feed...</div>
        </div>
      </div>
    </section>
  `;
}

async function loadHomeData() {
  // Clean up previous listeners
  if (unsubscribe) unsubscribe();

  if (!auth.currentUser) return;

  try {
    // Load announcements
    const announcementsQuery = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const announcementsList = document.getElementById('announcements-list');
    onSnapshot(announcementsQuery, (snapshot) => {
      if (snapshot.empty) {
        announcementsList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Belum ada pengumuman</div>';
      } else {
        announcementsList.innerHTML = snapshot.docs.map(doc => {
          const data = doc.data();
          const date = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru';
          return `
            <div class="p-3 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <div class="font-semibold text-sm">${escapeHtml(data.title || 'Tanpa Judul')}</div>
              <div class="text-xs opacity-70 mt-1">${escapeHtml(data.content?.substring(0, 100) || '')}${(data.content?.length > 100) ? '...' : ''}</div>
              <div class="text-xs opacity-50 mt-1">${date}</div>
            </div>
          `;
        }).join('');
      }
    }, (error) => {
      console.error('Error loading announcements:', error);
      announcementsList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Gagal memuat pengumuman</div>';
    });

    // Load activities
    const activitiesQuery = query(
      collection(db, 'activities'),
      orderBy('date', 'desc'),
      limit(3)
    );

    const activitiesList = document.getElementById('activities-list');
    onSnapshot(activitiesQuery, (snapshot) => {
      if (snapshot.empty) {
        activitiesList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Belum ada kegiatan</div>';
      } else {
        activitiesList.innerHTML = snapshot.docs.map(doc => {
          const data = doc.data();
          const date = data.date?.toDate ? new Date(data.date.toDate()).toLocaleDateString('id-ID') : 'TBA';
          return `
            <div class="p-3 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <div class="font-semibold text-sm">${escapeHtml(data.title || 'Tanpa Judul')}</div>
              <div class="text-xs opacity-70 mt-1">${escapeHtml(data.description?.substring(0, 80) || '')}${(data.description?.length > 80) ? '...' : ''}</div>
              <div class="text-xs opacity-50 mt-1">📅 ${date}</div>
            </div>
          `;
        }).join('');
      }
    }, (error) => {
      console.error('Error loading activities:', error);
      activitiesList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Gagal memuat kegiatan</div>';
    });

    // Load posts
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const postsList = document.getElementById('posts-list');
    onSnapshot(postsQuery, (snapshot) => {
      if (snapshot.empty) {
        postsList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Belum ada postingan</div>';
      } else {
        postsList.innerHTML = snapshot.docs.map(doc => {
          const data = doc.data();
          const date = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru';
          return `
            <div class="p-3 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <div class="font-semibold text-sm">${escapeHtml(data.authorName || 'Anonim')}</div>
              <div class="text-xs opacity-70 mt-1">${escapeHtml(data.content?.substring(0, 100) || '')}${(data.content?.length > 100) ? '...' : ''}</div>
              <div class="text-xs opacity-50 mt-1">${date}</div>
            </div>
          `;
        }).join('');
      }
    }, (error) => {
      console.error('Error loading posts:', error);
      postsList.innerHTML = '<div class="text-sm opacity-70 text-center py-2">Gagal memuat feed</div>';
    });

  } catch (error) {
    console.error('Error in loadHomeData:', error);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Keep renderHome for backward compatibility
export const renderHome = home;
