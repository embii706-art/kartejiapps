import { collection, query, where, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth, functions } from "../../lib/firebase.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";
import { toast } from "../../components/Toast.js";

let unsubscribe = null;

export async function adminRoles() {
  setTimeout(() => loadAdminRoles(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="font-bold text-lg">🎭 Admin • Kelola Role</div>
        <div class="text-sm opacity-70 mt-1">Atur role tambahan untuk anggota</div>
      </div>

      <!-- Available Roles Info -->
      <div class="rounded-xl border border-border bg-card p-4">
        <div class="font-semibold mb-2">Role yang Tersedia:</div>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">Ketua</span>
          <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Wakil Ketua</span>
          <span class="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Sekretaris</span>
          <span class="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">Bendahara</span>
          <span class="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300">Koordinator Sie</span>
        </div>
        <div class="text-xs opacity-70 mt-2">
          ℹ️ Super Admin tidak dapat diubah melalui UI ini (dikelola server)
        </div>
      </div>

      <!-- Members with Roles -->
      <div id="membersList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat anggota...</div>
      </div>

      <!-- Edit Role Modal -->
      <div id="editRoleModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-card rounded-2xl border border-border p-6 max-w-md w-full">
          <div class="font-bold text-lg mb-4">Edit Role</div>
          <div id="editRoleContent"></div>
          <div class="flex gap-2 mt-4">
            <button id="btnSaveRoles" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold">Simpan</button>
            <button id="btnCancelEdit" class="px-4 py-2 rounded-xl border border-border">Batal</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function loadAdminRoles() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  let canManage = false;
  let isSuperAdmin = false;

  // Check permissions
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (!profileDoc.exists()) {
      document.getElementById('membersList').innerHTML = '<div class="text-center py-8 text-red-600">Tidak ada akses</div>';
      return;
    }

    const profile = profileDoc.data();
    isSuperAdmin = hasAnyRole(profile, ['super_admin']);
    canManage = hasAnyRole(profile, ['super_admin', 'ketua', 'wakil_ketua']);
    
    if (!canManage) {
      document.getElementById('membersList').innerHTML = '<div class="text-center py-8 text-red-600">Hanya admin yang dapat mengakses halaman ini</div>';
      return;
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
    return;
  }

  // Load approved members
  const membersQuery = query(
    collection(db, 'profiles'),
    where('approvalStatus', '==', 'approved')
  );

  const membersList = document.getElementById('membersList');
  
  unsubscribe = onSnapshot(membersQuery, (snapshot) => {
    if (snapshot.empty) {
      membersList.innerHTML = '<div class="text-center py-8 opacity-70">Tidak ada anggota</div>';
      return;
    }

    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    membersList.innerHTML = members.map(member => {
      const roles = [...(member.roles || []), ...(member.extraRoles || [])];
      const extraRoles = member.extraRoles || [];
      const hasRoles = roles.filter(r => r !== 'anggota').length > 0;
      const isMemberSuperAdmin = hasAnyRole(member, ['super_admin']);
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  ${(member.fullName?.[0] || 'A').toUpperCase()}
                </div>
                <div>
                  <div class="font-semibold">${escapeHtml(member.fullName || 'Nama Tidak Tersedia')}</div>
                  ${member.sie ? `<div class="text-xs opacity-70">Sie ${escapeHtml(member.sie)}</div>` : ''}
                </div>
              </div>
              
              ${hasRoles ? `
                <div class="flex flex-wrap gap-1 mt-3">
                  ${roles.map(role => {
                    const colors = {
                      super_admin: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
                      ketua: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
                      wakil_ketua: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
                      sekretaris: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
                      bendahara: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
                      koordinator_sie: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
                      anggota: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    };
                    return `
                      <span class="px-2 py-1 text-xs rounded-full ${colors[role] || 'bg-primary/20 text-primary'}">
                        ${getRoleLabel(role)}
                      </span>
                    `;
                  }).join('')}
                </div>
              ` : '<div class="text-sm opacity-70 mt-2">Tidak ada role tambahan</div>'}
            </div>
            
            ${canManage && (!isMemberSuperAdmin || isSuperAdmin) && member.id !== auth.currentUser.uid ? `
              <button onclick="window.editMemberRoles('${member.id}', '${escapeHtml(member.fullName || 'Member')}', ${JSON.stringify(extraRoles).replace(/"/g, '&quot;')})" class="px-3 py-1 rounded-lg text-xs border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                ✏️ Edit
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading members:', error);
    membersList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat anggota</div>';
  });
}

// Global function to edit member roles
window.editMemberRoles = function(uid, name, currentRoles) {
  const modal = document.getElementById('editRoleModal');
  const content = document.getElementById('editRoleContent');
  
  const availableRoles = [
    { value: 'ketua', label: 'Ketua' },
    { value: 'wakil_ketua', label: 'Wakil Ketua' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'koordinator_sie', label: 'Koordinator Sie' }
  ];
  
  content.innerHTML = `
    <div class="mb-3">
      <div class="font-semibold">${name}</div>
      <div class="text-sm opacity-70">Pilih role tambahan:</div>
    </div>
    <div class="space-y-2">
      ${availableRoles.map(role => `
        <label class="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
          <input type="checkbox" value="${role.value}" ${currentRoles.includes(role.value) ? 'checked' : ''} class="role-checkbox">
          <span class="text-sm">${role.label}</span>
        </label>
      `).join('')}
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  document.getElementById('btnCancelEdit').onclick = () => {
    modal.classList.add('hidden');
  };
  
  document.getElementById('btnSaveRoles').onclick = async () => {
    const checkboxes = document.querySelectorAll('.role-checkbox:checked');
    const selectedRoles = Array.from(checkboxes).map(cb => cb.value);
    
    try {
      const adminSetExtraRoles = httpsCallable(functions, 'adminSetExtraRoles');
      await adminSetExtraRoles({ uid, extraRoles: selectedRoles });
      toast('Role berhasil diperbarui!');
      modal.classList.add('hidden');
    } catch (error) {
      console.error('Error updating roles:', error);
      toast('Gagal memperbarui role: ' + (error.message || 'Unknown error'));
    }
  };
};

function hasAnyRole(profile, roles) {
  const userRoles = [...(profile.roles || []), ...(profile.extraRoles || [])];
  return roles.some(role => userRoles.includes(role));
}

function getRoleLabel(role) {
  const labels = {
    'super_admin': 'Super Admin',
    'ketua': 'Ketua',
    'wakil_ketua': 'Wakil Ketua',
    'sekretaris': 'Sekretaris',
    'bendahara': 'Bendahara',
    'koordinator_sie': 'Koordinator Sie',
    'anggota': 'Anggota'
  };
  return labels[role] || role;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}