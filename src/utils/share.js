/**
 * Social Sharing Utility - v2.5.0
 * Provides Web Share API with fallback to copy link
 */

/**
 * Share content using Web Share API or fallback to copy
 */
export async function shareContent({ title, text, url }) {
  const shareData = {
    title: title || document.title,
    text: text || '',
    url: url || window.location.href
  };
  
  // Check if Web Share API is supported
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      // User cancelled or error occurred
      if (err.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      console.error('Share error:', err);
      // Fall through to copy fallback
    }
  }
  
  // Fallback: Copy link to clipboard
  try {
    await navigator.clipboard.writeText(shareData.url);
    return { success: true, method: 'clipboard' };
  } catch (err) {
    console.error('Clipboard error:', err);
    return { success: false, error: err };
  }
}

/**
 * Create a share button element
 */
export function createShareButton({ title, text, url, className = '', icon = '🔗' }) {
  const button = document.createElement('button');
  button.className = className || 'px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition';
  button.innerHTML = `${icon} Share`;
  button.setAttribute('aria-label', 'Share this content');
  
  button.addEventListener('click', async () => {
    const result = await shareContent({ title, text, url });
    
    if (result.success) {
      // Show success toast
      showToast(result.method === 'native' ? 'Shared!' : 'Link copied to clipboard!');
    } else if (!result.cancelled) {
      // Show error toast
      showToast('Failed to share. Please try again.');
    }
  });
  
  return button;
}

/**
 * Simple toast notification
 */
function showToast(message) {
  // Check if toast utility is available
  if (window.toast) {
    window.toast(message);
    return;
  }
  
  // Fallback toast
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50';
  toast.textContent = message;
  toast.style.animation = 'fadeUp 0.3s ease-out';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/**
 * Generate Open Graph meta tags
 */
export function setOGMetaTags({ title, description, image, url }) {
  const meta = [
    { property: 'og:title', content: title || document.title },
    { property: 'og:description', content: description || '' },
    { property: 'og:image', content: image || '' },
    { property: 'og:url', content: url || window.location.href },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title || document.title },
    { name: 'twitter:description', content: description || '' },
    { name: 'twitter:image', content: image || '' }
  ];
  
  meta.forEach(({ property, name, content }) => {
    if (!content) return;
    
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let tag = document.querySelector(selector);
    
    if (!tag) {
      tag = document.createElement('meta');
      if (property) tag.setAttribute('property', property);
      if (name) tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  });
}
