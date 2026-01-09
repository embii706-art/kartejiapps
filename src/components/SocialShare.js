/**
 * KARTEJI V2.5 - Social Media Sharing Utility
 * Easy sharing to multiple platforms with native share API fallback
 */

export default class SocialShare {
  constructor() {
    this.platforms = {
      facebook: {
        name: 'Facebook',
        icon: '📘',
        color: '#1877f2',
        url: (data) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
      },
      twitter: {
        name: 'Twitter/X',
        icon: '🐦',
        color: '#1da1f2',
        url: (data) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        color: '#0077b5',
        url: (data) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
      },
      whatsapp: {
        name: 'WhatsApp',
        icon: '💬',
        color: '#25d366',
        url: (data) => `https://wa.me/?text=${encodeURIComponent(data.title + ' ' + data.url)}`
      },
      telegram: {
        name: 'Telegram',
        icon: '✈️',
        color: '#0088cc',
        url: (data) => `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`
      },
      email: {
        name: 'Email',
        icon: '📧',
        color: '#ea4335',
        url: (data) => `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.description + '\n\n' + data.url)}`
      }
    };
  }

  /**
   * Check if native share API is available
   */
  canUseNativeShare() {
    return navigator.share !== undefined;
  }

  /**
   * Share using native share API
   */
  async nativeShare(data) {
    if (!this.canUseNativeShare()) {
      throw new Error('Native share not supported');
    }

    const shareData = {
      title: data.title || document.title,
      text: data.description || '',
      url: data.url || window.location.href
    };

    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'User cancelled share' };
      }
      throw error;
    }
  }

  /**
   * Share to specific platform
   */
  shareToPlatform(platform, data) {
    const platformData = this.platforms[platform];
    if (!platformData) {
      throw new Error(`Platform ${platform} not supported`);
    }

    const shareUrl = platformData.url(data);
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      shareUrl,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    return { success: true, method: 'popup', platform };
  }

  /**
   * Copy link to clipboard
   */
  async copyLink(url) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        return { success: true };
      } else {
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return { success: true };
        } catch (err) {
          document.body.removeChild(textArea);
          throw err;
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create share button UI
   */
  createShareButton(containerId, shareData, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      platforms = ['facebook', 'twitter', 'whatsapp', 'telegram'],
      showNativeShare = true,
      showCopyLink = true,
      buttonClass = 'btn-premium',
      position = 'bottom'
    } = options;

    const buttonId = `shareBtn-${Date.now()}`;
    const modalId = `shareModal-${Date.now()}`;

    container.innerHTML = `
      <button id="${buttonId}" class="${buttonClass} px-4 py-2 rounded-xl flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
        <span>Bagikan</span>
      </button>

      <!-- Share Modal -->
      <div id="${modalId}" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="glass-card rounded-2xl p-6 max-w-md w-full animate-fadeIn">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Bagikan</h3>
            <button id="closeShareModal" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          ${showNativeShare && this.canUseNativeShare() ? `
            <button id="nativeShareBtn" class="w-full mb-3 px-4 py-3 rounded-xl bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Bagikan...
            </button>
          ` : ''}

          <div class="grid grid-cols-2 gap-3">
            ${platforms.map(platform => {
              const p = this.platforms[platform];
              return `
                <button class="share-platform px-4 py-3 rounded-xl glass-card hover:glass-card-hover flex items-center gap-2 transition-all" data-platform="${platform}">
                  <span class="text-2xl">${p.icon}</span>
                  <span class="font-medium">${p.name}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${showCopyLink ? `
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button id="copyLinkBtn" class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span>Salin Link</span>
              </button>
              <div id="copySuccess" class="hidden mt-2 text-center text-sm text-green-600 dark:text-green-400">
                ✓ Link berhasil disalin!
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    const shareBtn = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('#closeShareModal');

    // Open modal
    shareBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    // Close modal
    const closeModal = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Native share
    if (showNativeShare && this.canUseNativeShare()) {
      const nativeBtn = modal.querySelector('#nativeShareBtn');
      nativeBtn.addEventListener('click', async () => {
        try {
          await this.nativeShare(shareData);
          closeModal();
        } catch (error) {
          console.error('Native share error:', error);
        }
      });
    }

    // Platform share buttons
    const platformBtns = modal.querySelectorAll('.share-platform');
    platformBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        this.shareToPlatform(platform, shareData);
        closeModal();
      });
    });

    // Copy link
    if (showCopyLink) {
      const copyBtn = modal.querySelector('#copyLinkBtn');
      const copySuccess = modal.querySelector('#copySuccess');
      
      copyBtn.addEventListener('click', async () => {
        const result = await this.copyLink(shareData.url || window.location.href);
        
        if (result.success) {
          copySuccess.classList.remove('hidden');
          setTimeout(() => {
            copySuccess.classList.add('hidden');
          }, 2000);
        }
      });
    }

    return { button: shareBtn, modal };
  }

  /**
   * Create floating share button
   */
  createFloatingShareButton(shareData, options = {}) {
    const {
      position = 'bottom-right',
      platforms = ['facebook', 'twitter', 'whatsapp']
    } = options;

    const positionClasses = {
      'bottom-right': 'bottom-20 right-4',
      'bottom-left': 'bottom-20 left-4',
      'top-right': 'top-20 right-4',
      'top-left': 'top-20 left-4'
    };

    const floatingId = `floatingShare-${Date.now()}`;
    const floatingDiv = document.createElement('div');
    floatingDiv.id = floatingId;
    floatingDiv.className = `fixed ${positionClasses[position]} z-40`;
    document.body.appendChild(floatingDiv);

    this.createShareButton(floatingId, shareData, { ...options, buttonClass: 'btn-premium shadow-lg' });

    return floatingDiv;
  }
}
