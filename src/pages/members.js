import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "../lib/firebase.js";

let unsubscribe = null;

export async function members() {
  setTimeout(() => loadMembers(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="font-bold text-lg">👥 Anggota</div>
        <div class="text-sm opacity-70 mt-1">Daftar anggota yang telah disetujui</div>
      </div>

      <!-- Search and Filter -->
      <div class="rounded-xl border border-border bg-card p-3">
        <input id="searchMembers" type="text" placeholder="🔍 Cari anggota..." class="w-full px-4 py-2 rounded-lg border border-border bg-[var(--bg)]">
      </div>

      <!-- Members List -->
      <div id="membersList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat anggota...</div>
      </div>
    </section>
  `;
}

async function loadMembers() {
  if (unsubscribe) unsubscribe();

  // Load approved members
  const membersQuery = query(
    collection(db, 'profiles'),
    where('approvalStatus', '==', 'approved')
  );

  const membersList = document.getElementById('membersList');
  let allMembers = [];
  
  unsubscribe = onSnapshot(membersQuery, (snapshot) => {
    if (snapshot.empty) {
      membersList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada anggota yang disetujui</div>';
      return;
    }

    allMembers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderMembers(allMembers);
    
    // Setup search
    const searchInput = document.getElementById('searchMembers');
    searchInput?.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = allMembers.filter(member => 
        (member.fullName || '').toLowerCase().includes(searchTerm) ||
        (member.sie || '').toLowerCase().includes(searchTerm)
      );
      renderMembers(filtered);
    });
  }, (error) => {
    console.error('Error loading members:', error);
    membersList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat anggota</div>';
  });
}

function renderMembers(members) {
  const membersList = document.getElementById('membersList');
  
  if (members.length === 0) {
    membersList.innerHTML = '<div class="text-center py-8 opacity-70">Tidak ada anggota ditemukan</div>';
    return;
  }

  membersList.innerHTML = members.map(member => {
    const roles = [...(member.roles || []), ...(member.extraRoles || [])];
    const displayRoles = roles.filter(r => r !== 'anggota');
    
    return `
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            ${(member.fullName?.[0] || 'A').toUpperCase()}
          </div>
          <div class="flex-1">
            <div class="font-semibold text-lg">${escapeHtml(member.fullName || 'Nama Tidak Tersedia')}</div>
            ${member.sie ? `
              <div class="text-sm opacity-70">Sie ${escapeHtml(member.sie)}</div>
            ` : ''}
            
            ${displayRoles.length > 0 ? `
              <div class="flex flex-wrap gap-1 mt-2">
                ${displayRoles.map(role => `
                  <span class="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                    ${getRoleLabel(role)}
                  </span>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div class="text-right">
            <div class="w-3 h-3 rounded-full bg-green-500" title="Online"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
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
