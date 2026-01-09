/**
 * KARTEJI V2.5 - Smart Search Component
 * Advanced search with fuzzy matching and category filtering
 */

export default class SmartSearch {
  constructor() {
    this.searchData = [];
    this.searchIndex = new Map();
  }

  /**
   * Initialize search with data
   * @param {Array} data - Array of searchable items
   */
  initialize(data) {
    this.searchData = data;
    this.buildIndex();
  }

  /**
   * Build search index for faster lookups
   */
  buildIndex() {
    this.searchIndex.clear();
    this.searchData.forEach((item, idx) => {
      const searchText = this.getSearchableText(item).toLowerCase();
      const words = searchText.split(/\s+/);
      
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, []);
        }
        this.searchIndex.get(word).push(idx);
      });
    });
  }

  /**
   * Get searchable text from item
   */
  getSearchableText(item) {
    if (typeof item === 'string') return item;
    if (item.title) return `${item.title} ${item.description || ''} ${item.category || ''}`;
    return JSON.stringify(item);
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Fuzzy search with scoring
   */
  fuzzySearch(query, threshold = 0.6) {
    if (!query || query.length < 2) return [];
    
    query = query.toLowerCase().trim();
    const results = [];
    
    this.searchData.forEach((item, idx) => {
      const searchText = this.getSearchableText(item).toLowerCase();
      let score = 0;
      
      // Exact match gets highest score
      if (searchText.includes(query)) {
        score = 1.0;
      } else {
        // Fuzzy matching
        const words = searchText.split(/\s+/);
        const queryWords = query.split(/\s+/);
        
        queryWords.forEach(queryWord => {
          words.forEach(word => {
            const distance = this.levenshteinDistance(queryWord, word);
            const maxLen = Math.max(queryWord.length, word.length);
            const similarity = 1 - (distance / maxLen);
            
            if (similarity > score) {
              score = similarity;
            }
          });
        });
      }
      
      if (score >= threshold) {
        results.push({ item, score, index: idx });
      }
    });
    
    // Sort by score descending
    return results.sort((a, b) => b.score - a.score).map(r => r.item);
  }

  /**
   * Search with category filter
   */
  searchByCategory(query, category) {
    const results = this.fuzzySearch(query);
    
    if (!category) return results;
    
    return results.filter(item => {
      return item.category === category || item.type === category;
    });
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) return [];
    
    const results = this.fuzzySearch(query, 0.5);
    return results.slice(0, limit);
  }

  /**
   * Highlight matching text
   */
  highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
  }

  /**
   * Create search UI component
   */
  createSearchUI(containerId, onSearch, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      placeholder = 'Cari...',
      showCategories = true,
      categories = []
    } = options;

    container.innerHTML = `
      <div class="smart-search glass-card rounded-2xl p-4 mb-4">
        <div class="flex gap-2 items-center">
          <div class="flex-1 relative">
            <input 
              type="text" 
              id="searchInput"
              class="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="${placeholder}"
            />
            <div class="absolute right-3 top-3 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <button id="clearSearch" class="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        ${showCategories && categories.length > 0 ? `
          <div class="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button class="category-filter active px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-gradient-primary text-white" data-category="">
              Semua
            </button>
            ${categories.map(cat => `
              <button class="category-filter px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all" data-category="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>
        ` : ''}
        
        <div id="searchSuggestions" class="mt-3 space-y-2 hidden"></div>
      </div>
      
      <div id="searchResults"></div>
    `;

    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    let selectedCategory = '';

    // Search input handler
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      
      if (query.length >= 2) {
        const suggestions = this.getSuggestions(query, 5);
        
        if (suggestions.length > 0) {
          suggestionsDiv.innerHTML = suggestions.map(item => {
            const title = item.title || item.name || String(item);
            return `
              <div class="suggestion-item p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all">
                ${this.highlightMatch(title, query)}
              </div>
            `;
          }).join('');
          suggestionsDiv.classList.remove('hidden');
        } else {
          suggestionsDiv.classList.add('hidden');
        }
      } else {
        suggestionsDiv.classList.add('hidden');
      }
      
      // Perform search
      const results = selectedCategory 
        ? this.searchByCategory(query, selectedCategory)
        : this.fuzzySearch(query);
      
      onSearch(results, query);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      suggestionsDiv.classList.add('hidden');
      onSearch(this.searchData, '');
    });

    // Category filters
    if (showCategories) {
      const categoryBtns = container.querySelectorAll('.category-filter');
      categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          categoryBtns.forEach(b => {
            b.classList.remove('active', 'bg-gradient-primary', 'text-white');
            b.classList.add('bg-slate-200', 'dark:bg-slate-700');
          });
          
          btn.classList.add('active', 'bg-gradient-primary', 'text-white');
          btn.classList.remove('bg-slate-200', 'dark:bg-slate-700');
          
          selectedCategory = btn.dataset.category;
          const query = searchInput.value;
          
          const results = selectedCategory 
            ? this.searchByCategory(query, selectedCategory)
            : this.fuzzySearch(query);
          
          onSearch(results, query);
        });
      });
    }

    // Click on suggestion
    suggestionsDiv.addEventListener('click', (e) => {
      const suggestionItem = e.target.closest('.suggestion-item');
      if (suggestionItem) {
        const text = suggestionItem.textContent.trim();
        searchInput.value = text;
        suggestionsDiv.classList.add('hidden');
        
        const results = selectedCategory 
          ? this.searchByCategory(text, selectedCategory)
          : this.fuzzySearch(text);
        
        onSearch(results, text);
      }
    });
  }
}
