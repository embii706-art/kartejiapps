import { collection, query, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth, functions } from "../lib/firebase.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";
import { toast } from "../components/Toast.js";

let unsubscribe = null;

export async function adminUsers() {
  setTimeout(() => loadAdminUsers(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="font-bold text-lg">⚙️ Admin • Kelola Pengguna</div>
        <div class="text-sm opacity-70 mt-1">Setujui atau tolak pendaftaran anggota baru</div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto">
        <button data-filter="pending" class="filter-btn px-4 py-2 rounded-xl border border-border bg-yellow-100 dark:bg-yellow-900 text-sm font-semibold whitespace-nowrap">
          Pending
        </button>
        <button data-filter="approved" class="filter-btn px-4 py-2 rounded-xl border border-border text-sm font-semibold whitespace-nowrap">
          Disetujui
        </button>
        <button data-filter="rejected" class="filter-btn px-4 py-2 rounded-xl border border-border text-sm font-semibold whitespace-nowrap">
          Ditolak
        </button>
        <button data-filter="all" class="filter-btn px-4 py-2 rounded-xl border border-border text-sm font-semibold whitespace-nowrap">
          Semua
        </button>
      </div>

      <!-- Users List -->
      <div id="usersList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat pengguna...</div>
      </div>
    </section>
  `;
}

async function loadAdminUsers() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  // Check if user is admin
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (!profileDoc.exists()) {
      document.getElementById('usersList').innerHTML = '<div class="text-center py-8 text-red-600">Tidak ada akses</div>';
      return;
    }

    const profile = profileDoc.data();
    const isAdmin = hasAnyRole(profile, ['super_admin']);
    
    if (!isAdmin) {
      document.getElementById('usersList').innerHTML = '<div class="text-center py-8 text-red-600">Hanya super admin yang dapat mengakses halaman ini</div>';
      return;
    }
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return;
  }

  let currentFilter = 'pending';
  let allUsers = [];

  // Load all users
  const usersQuery = query(collection(db, 'profiles'));
  const usersList = document.getElementById('usersList');
  
  unsubscribe = onSnapshot(usersQuery, (snapshot) => {
    if (snapshot.empty) {
      usersList.innerHTML = '<div class="text-center py-8 opacity-70">Tidak ada pengguna</div>';
      return;
    }

    allUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderUsers(allUsers, currentFilter);
  }, (error) => {
    console.error('Error loading users:', error);
    usersList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat pengguna</div>';
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFilter = e.target.dataset.filter;
      
      // Update active state
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'bg-green-100', 'dark:bg-green-900', 'bg-red-100', 'dark:bg-red-900', 'bg-primary', 'text-white');
      });
      
      if (currentFilter === 'pending') {
        e.target.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
      } else if (currentFilter === 'approved') {
        e.target.classList.add('bg-green-100', 'dark:bg-green-900');
      } else if (currentFilter === 'rejected') {
        e.target.classList.add('bg-red-100', 'dark:bg-red-900');
      } else {
        e.target.classList.add('bg-primary', 'text-white');
      }
      
      renderUsers(allUsers, currentFilter);
    });
  });
}

function renderUsers(users, filter) {
  const usersList = document.getElementById('usersList');
  
  let filtered = users;
  if (filter !== 'all') {
    filtered = users.filter(u => u.approvalStatus === filter);
  }

  if (filtered.length === 0) {
    usersList.innerHTML = '<div class="text-center py-8 opacity-70">Tidak ada pengguna dengan status ini</div>';
    return;
  }

  usersList.innerHTML = filtered.map(user => {
    const roles = [...(user.roles || []), ...(user.extraRoles || [])];
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    
    return `
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            ${(user.fullName?.[0] || 'A').toUpperCase()}
          </div>
          <div class="flex-1">
            <div class="font-semibold">${escapeHtml(user.fullName || 'Nama Tidak Tersedia')}</div>
            ${user.sie ? `<div class="text-sm opacity-70">Sie ${escapeHtml(user.sie)}</div>` : ''}
            <div class="text-xs opacity-70 mt-1">UID: ${user.uid}</div>
            
            <div class="flex flex-wrap gap-1 mt-2">
              <span class="px-2 py-1 text-xs rounded-full ${statusColors[user.approvalStatus || 'pending']}">
                ${user.approvalStatus || 'pending'}
              </span>
              ${roles.map(role => `
                <span class="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                  ${getRoleLabel(role)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
        
        ${user.approvalStatus === 'pending' ? `
          <div class="flex gap-2 mt-3">
            <button onclick="window.approveUser('${user.uid}', 'approved')" class="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:opacity-90 transition text-sm">
              ✓ Setujui
            </button>
            <button onclick="window.approveUser('${user.uid}', 'rejected')" class="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:opacity-90 transition text-sm">
              ✗ Tolak
            </button>
          </div>
        ` : user.approvalStatus === 'rejected' ? `
          <div class="mt-3">
            <button onclick="window.approveUser('${user.uid}', 'approved')" class="w-full px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:opacity-90 transition text-sm">
              ✓ Setujui Ulang
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Global function for approval
window.approveUser = async function(uid, status) {
  if (!confirm(`Yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} pengguna ini?`)) {
    return;
  }

  try {
    const adminApproveUser = httpsCallable(functions, 'adminApproveUser');
    await adminApproveUser({ uid, status });
    toast(`Pengguna berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
  } catch (error) {
    console.error('Error approving user:', error);
    toast('Gagal mengubah status pengguna: ' + (error.message || 'Unknown error'));
  }
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