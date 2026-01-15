import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";
import { toast } from "../components/Toast.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

let unsubscribe = null;

export async function documents() {
  setTimeout(() => loadDocuments(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-lg">📄 Dokumen</div>
            <div class="text-sm opacity-70 mt-1">Dokumen resmi organisasi</div>
          </div>
          <button id="btnAddDocument" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition hidden">
            + Upload
          </button>
        </div>
      </div>

      <!-- Add Document Form -->
      <div id="documentForm" class="rounded-2xl border border-border bg-card p-4 hidden">
        <div class="font-semibold mb-3">Upload Dokumen Baru</div>
        <div class="space-y-3">
          <input id="docTitle" type="text" placeholder="Judul dokumen" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <textarea id="docDescription" rows="2" placeholder="Deskripsi (opsional)" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)] resize-none"></textarea>
          <div>
            <input type="file" id="docFile" accept="image/*,.pdf,.doc,.docx" class="hidden">
            <button id="btnSelectFile" class="w-full px-4 py-2 rounded-xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">
              📎 Pilih File
            </button>
            <div id="fileInfo" class="mt-2 text-xs opacity-70 hidden"></div>
          </div>
          <div class="flex gap-2">
            <button id="btnSaveDocument" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold">Upload</button>
            <button id="btnCancelDoc" class="px-4 py-2 rounded-xl border border-border">Batal</button>
          </div>
        </div>
      </div>

      <!-- Documents List -->
      <div id="documentsList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat dokumen...</div>
      </div>
    </section>
  `;
}

async function loadDocuments() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  let selectedFile = null;

  // Check permissions
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      const canManage = hasAnyRole(profile, ['super_admin', 'ketua', 'sekretaris']);
      
      if (canManage) {
        const btnAdd = document.getElementById('btnAddDocument');
        const docForm = document.getElementById('documentForm');
        
        btnAdd?.classList.remove('hidden');
        
        btnAdd?.addEventListener('click', () => {
          docForm?.classList.remove('hidden');
        });

        document.getElementById('btnCancelDoc')?.addEventListener('click', () => {
          docForm?.classList.add('hidden');
          clearForm();
          selectedFile = null;
        });

        // File selection
        const btnSelectFile = document.getElementById('btnSelectFile');
        const docFile = document.getElementById('docFile');
        const fileInfo = document.getElementById('fileInfo');

        btnSelectFile?.addEventListener('click', () => docFile?.click());
        
        docFile?.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            selectedFile = file;
            fileInfo.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            fileInfo.classList.remove('hidden');
          }
        });

        // Save document
        document.getElementById('btnSaveDocument')?.addEventListener('click', async () => {
          await saveDocument(profile, selectedFile);
          selectedFile = null;
        });
      }
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }

  // Load documents
  const documentsQuery = query(
    collection(db, 'documents'),
    orderBy('createdAt', 'desc')
  );

  const documentsList = document.getElementById('documentsList');
  
  unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
    if (snapshot.empty) {
      documentsList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada dokumen</div>';
      return;
    }

    documentsList.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru';
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start gap-3">
            <div class="text-4xl">📄</div>
            <div class="flex-1">
              <div class="font-semibold text-lg">${escapeHtml(data.title || 'Tanpa Judul')}</div>
              ${data.description ? `
                <div class="text-sm opacity-70 mt-1">${escapeHtml(data.description)}</div>
              ` : ''}
              <div class="text-xs opacity-50 mt-2">
                📅 ${date} • oleh ${escapeHtml(data.createdByName || 'Admin')}
              </div>
              ${data.fileUrl ? `
                <div class="mt-3">
                  <a href="${data.fileUrl}" target="_blank" class="inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90 transition">
                    📥 Unduh / Lihat
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading documents:', error);
    documentsList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat dokumen</div>';
  });
}

async function saveDocument(profile, file) {
  const title = document.getElementById('docTitle')?.value?.trim();
  const description = document.getElementById('docDescription')?.value?.trim();

  if (!title) {
    toast('Judul dokumen wajib diisi');
    return;
  }

  if (!file) {
    toast('File harus dipilih');
    return;
  }

  const btnSave = document.getElementById('btnSaveDocument');
  btnSave.disabled = true;
  btnSave.textContent = 'Mengupload...';

  try {
    toast('Mengupload file...');
    const fileUrl = await uploadToCloudinary(file);

    await addDoc(collection(db, 'documents'), {
      title,
      description: description || null,
      fileUrl,
      createdBy: auth.currentUser.uid,
      createdByName: profile.fullName || 'Admin',
      createdAt: serverTimestamp()
    });

    toast('Dokumen berhasil diupload!');
    document.getElementById('documentForm')?.classList.add('hidden');
    clearForm();
  } catch (error) {
    console.error('Error saving document:', error);
    toast('Gagal mengupload dokumen');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Upload';
  }
}

function clearForm() {
  document.getElementById('docTitle').value = '';
  document.getElementById('docDescription').value = '';
  document.getElementById('docFile').value = '';
  document.getElementById('fileInfo').classList.add('hidden');
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