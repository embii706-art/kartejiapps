import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";
import { toast } from "../components/Toast.js";

let unsubscribe = null;

export async function activities() {
  setTimeout(() => loadActivities(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-lg">📅 Kegiatan</div>
            <div class="text-sm opacity-70 mt-1">Daftar kegiatan dan absensi</div>
          </div>
          <button id="btnCreateActivity" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition hidden">
            + Buat
          </button>
        </div>
      </div>

      <!-- Create Activity Form (Hidden by default) -->
      <div id="createForm" class="rounded-2xl border border-border bg-card p-4 hidden">
        <div class="font-semibold mb-3">Buat Kegiatan Baru</div>
        <div class="space-y-3">
          <input id="activityTitle" type="text" placeholder="Judul kegiatan" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <textarea id="activityDesc" rows="3" placeholder="Deskripsi kegiatan" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <input id="activityDate" type="date" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <input id="activityLocation" type="text" placeholder="Lokasi" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <div class="flex gap-2">
            <button id="btnSaveActivity" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold">Simpan</button>
            <button id="btnCancelCreate" class="px-4 py-2 rounded-xl border border-border">Batal</button>
          </div>
        </div>
      </div>

      <!-- Activities List -->
      <div id="activitiesList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat kegiatan...</div>
      </div>
    </section>
  `;
}

async function loadActivities() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  // Check if user has permission to create activities
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      const canManage = hasAnyRole(profile, ['super_admin', 'ketua', 'wakil_ketua', 'sekretaris', 'koordinator_sie']);
      
      const btnCreate = document.getElementById('btnCreateActivity');
      const createForm = document.getElementById('createForm');
      
      if (canManage && btnCreate) {
        btnCreate.classList.remove('hidden');
        
        btnCreate.addEventListener('click', () => {
          createForm?.classList.remove('hidden');
        });

        document.getElementById('btnCancelCreate')?.addEventListener('click', () => {
          createForm?.classList.add('hidden');
          clearForm();
        });

        document.getElementById('btnSaveActivity')?.addEventListener('click', async () => {
          await saveActivity(profile);
        });
      }
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }

  // Load activities
  const activitiesQuery = query(
    collection(db, 'activities'),
    orderBy('date', 'desc')
  );

  const activitiesList = document.getElementById('activitiesList');
  
  unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
    if (snapshot.empty) {
      activitiesList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada kegiatan terjadwal</div>';
      return;
    }

    activitiesList.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const activityId = docSnap.id;
      const date = data.date?.toDate ? new Date(data.date.toDate()).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'TBA';
      
      const statusColors = {
        draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        published: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      };
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="font-semibold text-lg">${escapeHtml(data.title || 'Tanpa Judul')}</div>
              <div class="text-sm opacity-70 mt-1">${escapeHtml(data.description || '')}</div>
              <div class="flex flex-wrap gap-2 mt-3 text-xs">
                <span class="px-3 py-1 rounded-full ${statusColors[data.status || 'draft']}">
                  ${data.status || 'draft'}
                </span>
                <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  📅 ${date}
                </span>
                ${data.location ? `
                  <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                    📍 ${escapeHtml(data.location)}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-border">
            <a href="#/activities/${activityId}" class="text-sm text-primary hover:underline">
              Lihat Detail & Absensi →
            </a>
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading activities:', error);
    activitiesList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat kegiatan</div>';
  });
}

async function saveActivity(profile) {
  const title = document.getElementById('activityTitle')?.value?.trim();
  const description = document.getElementById('activityDesc')?.value?.trim();
  const dateStr = document.getElementById('activityDate')?.value;
  const location = document.getElementById('activityLocation')?.value?.trim();

  if (!title || !description || !dateStr) {
    toast('Judul, deskripsi, dan tanggal wajib diisi');
    return;
  }

  const btnSave = document.getElementById('btnSaveActivity');
  btnSave.disabled = true;
  btnSave.textContent = 'Menyimpan...';

  try {
    const date = new Date(dateStr);
    
    await addDoc(collection(db, 'activities'), {
      title,
      description,
      date,
      location: location || null,
      status: 'published',
      createdBy: auth.currentUser.uid,
      createdByName: profile.fullName || 'Admin',
      createdAt: serverTimestamp()
    });

    toast('Kegiatan berhasil dibuat!');
    document.getElementById('createForm')?.classList.add('hidden');
    clearForm();
  } catch (error) {
    console.error('Error creating activity:', error);
    toast('Gagal membuat kegiatan');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Simpan';
  }
}

function clearForm() {
  document.getElementById('activityTitle').value = '';
  document.getElementById('activityDesc').value = '';
  document.getElementById('activityDate').value = '';
  document.getElementById('activityLocation').value = '';
}

function hasAnyRole(profile, roles) {
  const userRoles = [...(profile.roles || []), ...(profile.extraRoles || [])];
  return roles.some(role => userRoles.includes(role));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}