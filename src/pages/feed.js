import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "../lib/firebase.js";
import { toast } from "../components/Toast.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

let unsubscribe = null;

export async function feed() {
  setTimeout(() => loadFeed(), 0);
  
  return `
    <section class="p-4 space-y-4">
      <!-- Create Post Card -->
      <div class="rounded-2xl border border-border bg-card p-4">
        <div class="font-bold text-lg mb-3">✍️ Buat Postingan</div>
        <textarea id="postContent" rows="3" class="w-full px-4 py-3 rounded-xl border border-border bg-[var(--bg)] resize-none" placeholder="Apa yang ingin Anda bagikan?"></textarea>
        <div class="mt-3 flex gap-2">
          <input type="file" id="postImage" accept="image/*" class="hidden">
          <button id="btnAddImage" class="px-4 py-2 rounded-xl border border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm">
            📷 Tambah Foto
          </button>
          <button id="btnPost" class="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition">
            Posting
          </button>
        </div>
        <div id="imagePreview" class="mt-3 hidden">
          <img id="previewImg" class="w-full max-h-48 object-cover rounded-xl">
          <button id="btnRemoveImage" class="mt-2 text-xs text-red-600 hover:underline">Hapus Foto</button>
        </div>
      </div>

      <!-- Posts List -->
      <div id="postsList" class="space-y-4">
        <div class="text-center py-8 opacity-70">Memuat postingan...</div>
      </div>
    </section>
  `;
}

async function loadFeed() {
  if (unsubscribe) unsubscribe();
  
  const postContent = document.getElementById('postContent');
  const btnPost = document.getElementById('btnPost');
  const btnAddImage = document.getElementById('btnAddImage');
  const postImage = document.getElementById('postImage');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  
  let selectedFile = null;

  // Image handling
  btnAddImage?.addEventListener('click', () => postImage?.click());
  
  postImage?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemoveImage?.addEventListener('click', () => {
    selectedFile = null;
    postImage.value = '';
    imagePreview.classList.add('hidden');
  });

  // Post submission
  btnPost?.addEventListener('click', async () => {
    const content = postContent?.value?.trim();
    if (!content) {
      toast('Konten postingan tidak boleh kosong');
      return;
    }

    if (!auth.currentUser) {
      toast('Anda harus login terlebih dahulu');
      return;
    }

    btnPost.disabled = true;
    btnPost.textContent = 'Memposting...';

    try {
      // Get user profile for author name
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
      const authorName = profileDoc.exists() ? profileDoc.data().fullName : 'Anonim';

      let imageUrl = null;
      if (selectedFile) {
        toast('Mengupload foto...');
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      await addDoc(collection(db, 'posts'), {
        content,
        imageUrl,
        authorUid: auth.currentUser.uid,
        authorName,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0
      });

      toast('Postingan berhasil dibuat!');
      postContent.value = '';
      selectedFile = null;
      imagePreview.classList.add('hidden');
      postImage.value = '';
    } catch (error) {
      console.error('Error creating post:', error);
      toast('Gagal membuat postingan');
    } finally {
      btnPost.disabled = false;
      btnPost.textContent = 'Posting';
    }
  });

  // Load posts with real-time updates
  const postsQuery = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc')
  );

  const postsList = document.getElementById('postsList');
  
  unsubscribe = onSnapshot(postsQuery, (snapshot) => {
    if (snapshot.empty) {
      postsList.innerHTML = '<div class="text-center py-8 opacity-70">Belum ada postingan. Buat postingan pertama!</div>';
      return;
    }

    postsList.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toLocaleString('id-ID') : 'Baru saja';
      const isOwner = auth.currentUser?.uid === data.authorUid;
      
      return `
        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              ${(data.authorName?.[0] || 'A').toUpperCase()}
            </div>
            <div class="flex-1">
              <div class="font-semibold">${escapeHtml(data.authorName || 'Anonim')}</div>
              <div class="text-xs opacity-70">${date}</div>
            </div>
          </div>
          
          <div class="mt-3 text-sm whitespace-pre-wrap">${escapeHtml(data.content || '')}</div>
          
          ${data.imageUrl ? `
            <div class="mt-3">
              <img src="${data.imageUrl}" class="w-full rounded-xl max-h-96 object-cover" alt="Post image">
            </div>
          ` : ''}
          
          <div class="mt-3 pt-3 border-t border-border flex gap-4 text-sm">
            <button class="flex items-center gap-1 opacity-70 hover:opacity-100 transition">
              👍 <span>${data.likesCount || 0}</span>
            </button>
            <button class="flex items-center gap-1 opacity-70 hover:opacity-100 transition">
              💬 <span>${data.commentsCount || 0}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }, (error) => {
    console.error('Error loading posts:', error);
    postsList.innerHTML = '<div class="text-center py-8 opacity-70 text-red-600">Gagal memuat postingan</div>';
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}