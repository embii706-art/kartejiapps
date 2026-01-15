import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";
import { toast } from "../components/Toast.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

let unsubscribe = null;

export async function finance() {
  setTimeout(() => loadFinance(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Header -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-lg">💰 Kas</div>
            <div class="text-sm opacity-70 mt-1">Transaksi keuangan organisasi</div>
          </div>
          <button id="btnAddTransaction" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition hidden">
            + Tambah
          </button>
        </div>
      </div>

      <!-- Balance Summary -->
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl border border-border bg-card p-3">
          <div class="text-xs opacity-70">Pemasukan</div>
          <div id="totalIncome" class="text-lg font-bold text-green-600">Rp 0</div>
        </div>
        <div class="rounded-xl border border-border bg-card p-3">
          <div class="text-xs opacity-70">Pengeluaran</div>
          <div id="totalExpense" class="text-lg font-bold text-red-600">Rp 0</div>
        </div>
        <div class="rounded-xl border border-border bg-card p-3">
          <div class="text-xs opacity-70">Saldo</div>
          <div id="balance" class="text-lg font-bold text-primary">Rp 0</div>
        </div>
      </div>

      <!-- Add Transaction Form (Hidden by default) -->
      <div id="transactionForm" class="rounded-2xl border border-border bg-card p-4 hidden">
        <div class="font-semibold mb-3">Tambah Transaksi</div>
        <div class="space-y-3">
          <select id="txType" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <input id="txAmount" type="number" placeholder="Jumlah (Rp)" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <input id="txDescription" type="text" placeholder="Keterangan" class="w-full px-4 py-2 rounded-xl border border-border bg-[var(--bg)]">
          <div>
            <input type="file" id="txReceipt" accept="image/*" class="hidden">
            <button id="btnAddReceipt" class="w-full px-4 py-2 rounded-xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">
              📷 Upload Bukti (Opsional)
            </button>
            <div id="receiptPreview" class="mt-2 hidden">
              <img id="receiptImg" class="w-full max-h-32 object-cover rounded-xl">
              <button id="btnRemoveReceipt" class="mt-1 text-xs text-red-600 hover:underline">Hapus</button>
            </div>
          </div>
          <div class="flex gap-2">
            <button id="btnSaveTransaction" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold">Simpan</button>
            <button id="btnCancelTransaction" class="px-4 py-2 rounded-xl border border-border">Batal</button>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div id="transactionsList" class="space-y-3">
        <div class="text-center py-8 opacity-70">Memuat transaksi...</div>
      </div>
    </section>
  `;
}

async function loadFinance() {
  if (unsubscribe) unsubscribe();
  
  if (!auth.currentUser) return;

  let selectedFile = null;

  // Check permissions
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      const canManage = hasAnyRole(profile, ['super_admin', 'ketua', 'bendahara']);
      
      if (canManage) {
        const btnAdd = document.getElementById('btnAddTransaction');
        const txForm = document.getElementById('transactionForm');
        
        btnAdd?.classList.remove('hidden');
        
        btnAdd?.addEventListener('click', () => {
          txForm?.classList.remove('hidden');
        });

        document.getElementById('btnCancelTransaction')?.addEventListener('click', () => {
          txForm?.classList.add('hidden');
          clearTransactionForm();
          selectedFile = null;
        });

        // Receipt upload
        const btnAddReceipt = document.getElementById('btnAddReceipt');
        const txReceipt = document.getElementById('txReceipt');
        const receiptPreview = document.getElementById('receiptPreview');
        const receiptImg = document.getElementById('receiptImg');
        const btnRemoveReceipt = document.getElementById('btnRemoveReceipt');

        btnAddReceipt?.addEventListener('click', () => txReceipt?.click());
        
        txReceipt?.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
              receiptImg.src = ev.target.result;
              receiptPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
          }
        });

        btnRemoveReceipt?.addEventListener('click', () => {
          selectedFile = null;
          txReceipt.value = '';
          receiptPreview.classList.add('hidden');
        });

        // Save transaction
        document.getElementById('btnSaveTransaction')?.addEventListener('click', async () => {
          await saveTransaction(profile, selectedFile);
          selectedFile = null;
        });
      }
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }

  // Load transactions
  const transactionsQuery = query(
    collection(db, 'finance_transactions'),
    orderBy('createdAt', 'desc')
  );

  const transactionsList = document.getElementById('transactionsList');
  
  unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
    if (snapshot.empty) {
      transactionsList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada transaksi</div>';
      updateSummary([], 0, 0, 0);
      return;
    }

    let totalIncome = 0;
    let totalExpense = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.type === 'income') {
        totalIncome += data.amount || 0;
      } else if (data.type === 'expense') {
        totalExpense += data.amount || 0;
      }
    });

    const balance = totalIncome - totalExpense;
    updateSummary(snapshot.docs, totalIncome, totalExpense, balance);

    transactionsList.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru';
      const isIncome = data.type === 'income';
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${isIncome ? '📈' : '📉'}</span>
                <div>
                  <div class="font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}">
                    ${isIncome ? '+' : '-'} ${formatCurrency(data.amount || 0)}
                  </div>
                  <div class="text-sm opacity-70">${escapeHtml(data.description || '-')}</div>
                </div>
              </div>
              ${data.receiptUrl ? `
                <div class="mt-2">
                  <img src="${data.receiptUrl}" class="w-full max-h-32 object-cover rounded-lg" alt="Bukti">
                </div>
              ` : ''}
            </div>
          </div>
          <div class="mt-2 text-xs opacity-70">
            📅 ${date} • oleh ${escapeHtml(data.createdByName || 'Admin')}
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading transactions:', error);
    transactionsList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat transaksi</div>';
  });
}

async function saveTransaction(profile, receiptFile) {
  const type = document.getElementById('txType')?.value;
  const amount = parseFloat(document.getElementById('txAmount')?.value || '0');
  const description = document.getElementById('txDescription')?.value?.trim();

  if (!amount || amount <= 0) {
    toast('Jumlah harus lebih dari 0');
    return;
  }

  if (!description) {
    toast('Keterangan wajib diisi');
    return;
  }

  const btnSave = document.getElementById('btnSaveTransaction');
  btnSave.disabled = true;
  btnSave.textContent = 'Menyimpan...';

  try {
    let receiptUrl = null;
    if (receiptFile) {
      toast('Mengupload bukti...');
      receiptUrl = await uploadToCloudinary(receiptFile);
    }

    await addDoc(collection(db, 'finance_transactions'), {
      type,
      amount,
      description,
      receiptUrl,
      createdBy: auth.currentUser.uid,
      createdByName: profile.fullName || 'Admin',
      createdAt: serverTimestamp()
    });

    toast('Transaksi berhasil ditambahkan!');
    document.getElementById('transactionForm')?.classList.add('hidden');
    clearTransactionForm();
  } catch (error) {
    console.error('Error saving transaction:', error);
    toast('Gagal menyimpan transaksi');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = 'Simpan';
  }
}

function clearTransactionForm() {
  document.getElementById('txType').value = 'income';
  document.getElementById('txAmount').value = '';
  document.getElementById('txDescription').value = '';
  document.getElementById('txReceipt').value = '';
  document.getElementById('receiptPreview')?.classList.add('hidden');
}

function updateSummary(docs, totalIncome, totalExpense, balance) {
  document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
  document.getElementById('balance').textContent = formatCurrency(balance);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
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