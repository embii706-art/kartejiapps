/**
 * Social Sharing Feature
 * Enables sharing content across social media platforms
 */

export class SocialShare {
  constructor() {
    this.canShare = 'share' in navigator;
  }

  // Share via Web Share API (native)
  async nativeShare(data) {
    if (this.canShare) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url || window.location.href
        });
        return true;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
        return false;
      }
    }
    return false;
  }

  // Share to specific platform
  shareTo(platform, data) {
    const url = encodeURIComponent(data.url || window.location.href);
    const title = encodeURIComponent(data.title);
    const text = encodeURIComponent(data.text || '');
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }

  // Copy link to clipboard
  async copyLink(url) {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }

  // Render share modal
  renderShareModal(data) {
    const existingModal = document.getElementById('shareModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.className = 'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="shareBackdrop"></div>
      <div class="relative glass-strong w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden slide-in-right">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">Bagikan</h3>
            <button id="closeShare" class="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">
              <span class="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>
          
          <div class="mb-4">
            <div class="text-sm font-semibold mb-1">${data.title}</div>
            <div class="text-xs text-slate-500">${data.text || ''}</div>
          </div>
          
          ${this.canShare ? `
            <button id="nativeShare" class="w-full mb-3 py-3 px-4 rounded-xl bg-[rgb(var(--primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition card-3d-lift">
              <span class="material-symbols-rounded">share</span>
              <span>Bagikan...</span>
            </button>
          ` : ''}
          
          <div class="grid grid-cols-4 gap-3 mb-4">
            <button data-platform="whatsapp" class="share-btn flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition card-3d">
              <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <span class="text-xs">WhatsApp</span>
            </button>
            
            <button data-platform="facebook" class="share-btn flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition card-3d">
              <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span class="text-xs">Facebook</span>
            </button>
            
            <button data-platform="twitter" class="share-btn flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition card-3d">
              <div class="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
              <span class="text-xs">Twitter</span>
            </button>
            
            <button data-platform="email" class="share-btn flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition card-3d">
              <div class="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white">
                <span class="material-symbols-rounded">email</span>
              </div>
              <span class="text-xs">Email</span>
            </button>
          </div>
          
          <button id="copyLink" class="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <span class="material-symbols-rounded text-[20px]">link</span>
            <span>Salin Link</span>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#shareBackdrop')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#closeShare')?.addEventListener('click', () => modal.remove());
    
    if (this.canShare) {
      modal.querySelector('#nativeShare')?.addEventListener('click', async () => {
        const success = await this.nativeShare(data);
        if (success) modal.remove();
      });
    }
    
    modal.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        this.shareTo(platform, data);
      });
    });
    
    modal.querySelector('#copyLink')?.addEventListener('click', async () => {
      const success = await this.copyLink(data.url);
      if (success) {
        const btn = modal.querySelector('#copyLink');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-rounded text-[20px]">check</span><span>Tersalin!</span>';
        btn.classList.add('bg-green-100', 'dark:bg-green-900', 'border-green-500');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('bg-green-100', 'dark:bg-green-900', 'border-green-500');
        }, 2000);
      }
    });
  }

  // Add share buttons to content
  addShareButton(element, data) {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition';
    shareBtn.innerHTML = '<span class="material-symbols-rounded text-[18px]">share</span><span>Bagikan</span>';
    shareBtn.onclick = () => this.renderShareModal(data);
    element.appendChild(shareBtn);
  }
}

// Global instance
export const socialShare = new SocialShare();
