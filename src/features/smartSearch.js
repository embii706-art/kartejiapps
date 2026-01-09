/**
 * Smart Search Feature
 * Provides fuzzy search across activities, feed, and other content
 */

export class SmartSearch {
  constructor() {
    this.searchIndex = [];
    this.isOpen = false;
  }

  // Fuzzy match algorithm
  fuzzyMatch(pattern, str) {
    pattern = pattern.toLowerCase();
    str = str.toLowerCase();
    
    let patternIdx = 0;
    let strIdx = 0;
    let score = 0;
    
    while (patternIdx < pattern.length && strIdx < str.length) {
      if (pattern[patternIdx] === str[strIdx]) {
        score += 1;
        patternIdx++;
      }
      strIdx++;
    }
    
    return patternIdx === pattern.length ? score / str.length : 0;
  }

  // Index content for searching
  indexContent(items, type) {
    items.forEach(item => {
      this.searchIndex.push({
        id: item.id,
        type: type,
        title: item.title || item.name || '',
        description: item.description || item.content || '',
        date: item.date || item.createdAt || '',
        searchText: `${item.title || ''} ${item.description || ''} ${item.content || ''}`.toLowerCase(),
        data: item
      });
    });
  }

  // Search through indexed content
  search(query) {
    if (!query || query.length < 2) return [];
    
    const results = this.searchIndex
      .map(item => ({
        ...item,
        score: this.fuzzyMatch(query, item.searchText)
      }))
      .filter(item => item.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    return results;
  }

  // Render search UI
  renderSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'fixed inset-0 z-[9999] hidden';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="searchBackdrop"></div>
      <div class="relative min-h-screen flex items-start justify-center pt-20 px-4">
        <div class="glass-strong w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden scale-in">
          <div class="p-4 border-b border-slate-200/30 dark:border-slate-700/30">
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-slate-400">search</span>
              <input
                type="text"
                id="searchInput"
                placeholder="Cari kegiatan, pengumuman, anggota..."
                class="flex-1 bg-transparent border-none outline-none text-base"
                autocomplete="off"
              />
              <kbd class="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700">ESC</kbd>
            </div>
          </div>
          <div id="searchResults" class="max-h-96 overflow-y-auto p-2">
            <div class="text-center py-8 text-slate-400">
              <span class="material-symbols-rounded text-4xl mb-2">search</span>
              <p class="text-sm">Mulai ketik untuk mencari...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Event listeners
    const input = modal.querySelector('#searchInput');
    const backdrop = modal.querySelector('#searchBackdrop');
    const results = modal.querySelector('#searchResults');
    
    input.addEventListener('input', (e) => {
      const query = e.target.value;
      this.updateResults(query, results);
    });
    
    backdrop.addEventListener('click', () => this.close());
    
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !this.isOpen) {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  updateResults(query, resultsContainer) {
    const results = this.search(query);
    
    if (!query || query.length < 2) {
      resultsContainer.innerHTML = `
        <div class="text-center py-8 text-slate-400">
          <span class="material-symbols-rounded text-4xl mb-2">search</span>
          <p class="text-sm">Mulai ketik untuk mencari...</p>
        </div>
      `;
      return;
    }
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-8 text-slate-400">
          <span class="material-symbols-rounded text-4xl mb-2">search_off</span>
          <p class="text-sm">Tidak ada hasil untuk "${query}"</p>
        </div>
      `;
      return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
      <a href="#/${result.type}/${result.id}" 
         class="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition mb-2 card-3d-lift"
         onclick="window.smartSearch.close()">
        <div class="flex items-start gap-3">
          <span class="material-symbols-rounded text-[rgb(var(--primary))]">
            ${result.type === 'activities' ? 'event' : result.type === 'feed' ? 'campaign' : 'article'}
          </span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm truncate">${this.highlightMatch(result.title, query)}</div>
            <div class="text-xs text-slate-500 line-clamp-2 mt-1">${result.description}</div>
            <div class="text-xs text-slate-400 mt-1">
              <span class="capitalize">${result.type}</span>
              ${result.date ? ` • ${result.date}` : ''}
            </div>
          </div>
        </div>
      </a>
    `).join('');
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50">$1</mark>');
  }

  open() {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.remove('hidden');
      this.isOpen = true;
      setTimeout(() => {
        document.getElementById('searchInput')?.focus();
      }, 100);
    }
  }

  close() {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.add('hidden');
      this.isOpen = false;
      document.getElementById('searchInput').value = '';
      this.updateResults('', document.getElementById('searchResults'));
    }
  }

  init() {
    this.renderSearchModal();
    
    // Add search button to header
    const header = document.querySelector('header .flex');
    if (header) {
      const searchBtn = document.createElement('button');
      searchBtn.className = 'w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition';
      searchBtn.innerHTML = '<span class="material-symbols-rounded text-[22px]">search</span>';
      searchBtn.onclick = () => this.open();
      header.insertBefore(searchBtn, header.lastElementChild);
    }
  }
}

// Global instance
export const smartSearch = new SmartSearch();
