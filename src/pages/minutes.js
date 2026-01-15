import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";
import { toast } from "../components/Toast.js";

let unsubscribe = null;

export async function minutes() {
  setTimeout(() => loadMinutes(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-lg">📝 Notulen Rapat</div>
            <div class="text-sm opacity-70 mt-1">Catatan hasil rapat organisasi</div>
          </div>
          <button id="btnAddMinute" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition hidden">
            + Buat
          </button>
        </div>
      </div>

      <!-- Add Minute Form -->
      <div id="minuteForm" class="rounded-2xl border border-border bg-card p-4 hidden">
        <div class="font-semibold mb-3">Buat Notulen Baru</div>
        <div class="space-y-3">
          <input id="minuteTitle" type="text" placeholder="Judul rapat" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <input id="minuteDate" type="date" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <input id="minuteLocation" type="text" placeholder="Lokasi rapat" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <textarea id="minuteAttendees" rows="2" placeholder="Peserta rapat (pisahkan dengan koma)" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <textarea id="minuteAgenda" rows="3" placeholder="Agenda rapat" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <textarea id="minuteContent" rows="5" placeholder="Isi notulen / hasil rapat" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <textarea id="minuteDecisions" rows="3" placeholder="Keputusan rapat" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <div class="flex gap-2">
            <button id="btnSaveMinute" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold">Simpan</button>
            <button id="btnCancelMinute" class="px-4 py-2 rounded-xl border border-border">Batal</button>
          </div>
        </div>
      </div>

      <!-- Minutes List -->
      <div id="minutesList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat notulen...</div>
      </div>
    </section>
  `;
}

async function loadMinutes() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  // Check permissions
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      const canManage = hasAnyRole(profile, ['super_admin', 'ketua', 'sekretaris']);
      
      if (canManage) {
        const btnAdd = document.getElementById('btnAddMinute');
        const minuteForm = document.getElementById('minuteForm');
        
        btnAdd?.classList.remove('hidden');
        
        btnAdd?.addEventListener('click', () => {
          minuteForm?.classList.remove('hidden');
        });

        document.getElementById('btnCancelMinute')?.addEventListener('click', () => {
          minuteForm?.classList.add('hidden');
          clearForm();
        });

        // Save minute
        document.getElementById('btnSaveMinute')?.addEventListener('click', async () => {
          await saveMinute(profile);
        });
      }
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }

  // Load minutes
  const minutesQuery = query(
    collection(db, 'minutes'),
    orderBy('meetingDate', 'desc')
  );

  const minutesList = document.getElementById('minutesList');
  
  unsubscribe = onSnapshot(minutesQuery, (snapshot) => {
    if (snapshot.empty) {
      minutesList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada notulen rapat</div>';
      return;
    }

    minutesList.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const meetingDate = data.meetingDate?.toDate ? new Date(data.meetingDate.toDate()).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'TBA';
      const createdDate = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru';
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start gap-3">
            <div class="text-4xl">📝</div>
            <div class="flex-1">
              <div class="font-semibold text-lg">${escapeHtml(data.title || 'Tanpa Judul')}</div>
              <div class="text-sm opacity-70 mt-1">📅 ${meetingDate}</div>
              ${data.location ? `
                <div class="text-sm opacity-70">📍 ${escapeHtml(data.location)}</div>
              ` : ''}
              
              ${data.attendees ? `
                <div class="mt-3">
                  <div class="text-xs font-semibold opacity-80 mb-1">Peserta:</div>
                  <div class="text-sm opacity-70">${escapeHtml(data.attendees)}</div>
                </div>
              ` : ''}
              
              ${data.agenda ? `
                <div class="mt-3">
                  <div class="text-xs font-semibold opacity-80 mb-1">Agenda:</div>
                  <div class="text-sm opacity-70 whitespace-pre-wrap">${escapeHtml(data.agenda)}</div>
                </div>
              ` : ''}
              
              ${data.content ? `
                <div class="mt-3">
                  <div class="text-xs font-semibold opacity-80 mb-1">Isi Notulen:</div>
                  <div class="text-sm opacity-70 whitespace-pre-wrap">${escapeHtml(data.content)}</div>
                </div>
              ` : ''}
              
              ${data.decisions ? `
                <div class="mt-3">
                  <div class="text-xs font-semibold opacity-80 mb-1">Keputusan:</div>
                  <div class="text-sm opacity-70 whitespace-pre-wrap">${escapeHtml(data.decisions)}</div>
                </div>
              ` : ''}
              
              <div class="text-xs opacity-50 mt-3 pt-3 border-t border-border">
                Dibuat ${createdDate} oleh ${escapeHtml(data.createdByName || 'Admin')}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading minutes:', error);
    minutesList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat notulen</div>';
  });
}

async function saveMinute(profile) {
  const title = document.getElementById('minuteTitle')?.value?.trim();
  const dateStr = document.getElementById('minuteDate')?.value;
  const location = document.getElementById('minuteLocation')?.value?.trim();
  const attendees = document.getElementById('minuteAttendees')?.value?.trim();
  const agenda = document.getElementById('minuteAgenda')?.value?.trim();
  const content = document.getElementById('minuteContent')?.value?.trim();
  const decisions = document.getElementById('minuteDecisions')?.value?.trim();

  if (!title || !dateStr || !content) {
    toast('Judul, tanggal, dan isi notulen wajib diisi');
    return;
  }

  const btnSave = document.getElementById('btnSaveMinute');
  btnSave.disabled = true;
  btnSave.textContent = 'Menyimpan...';

  try {
    const meetingDate = new Date(dateStr);

    await addDoc(collection(db, 'minutes'), {
      title,
      meetingDate,
      location: location || null,
      attendees: attendees || null,
      agenda: agenda || null,
      content,
      decisions: decisions || null,
      createdBy: auth.currentUser.uid,
      createdByName: profile.fullName || 'Admin',
      createdAt: serverTimestamp()
    });

    toast('Notulen berhasil disimpan!');
    document.getElementById('minuteForm')?.classList.add('hidden');
    clearForm();
  } catch (error) {
    console.error('Error saving minute:', error);
    toast('Gagal menyimpan notulen');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Simpan';
  }
}

function clearForm() {
  document.getElementById('minuteTitle').value = '';
  document.getElementById('minuteDate').value = '';
  document.getElementById('minuteLocation').value = '';
  document.getElementById('minuteAttendees').value = '';
  document.getElementById('minuteAgenda').value = '';
  document.getElementById('minuteContent').value = '';
  document.getElementById('minuteDecisions').value = '';
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