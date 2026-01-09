/**
 * Smart Search Utility - v2.5.0
 * Provides fuzzy search with highlighting and keyboard navigation
 */

/**
 * Simple fuzzy matching implementation
 */
function fuzzyMatch(pattern, str) {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  const matches = [];
  
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      matches.push(strIdx);
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === pattern.length ? matches : null;
}

/**
 * Calculate match score
 */
function calculateScore(matches, str) {
  if (!matches || matches.length === 0) return 0;
  
  let score = 100;
  let consecutiveBonus = 0;
  
  for (let i = 0; i < matches.length - 1; i++) {
    if (matches[i + 1] - matches[i] === 1) {
      consecutiveBonus += 5;
    }
  }
  
  // Bonus for match at start
  if (matches[0] === 0) score += 10;
  
  return score + consecutiveBonus - (str.length - matches.length);
}

/**
 * Highlight matched characters in text
 */
export function highlightMatches(text, query) {
  if (!query) return text;
  
  const matches = fuzzyMatch(query, text);
  if (!matches) return text;
  
  let result = '';
  let lastIdx = 0;
  
  matches.forEach(idx => {
    result += text.slice(lastIdx, idx);
    result += `<span class="search-highlight">${text[idx]}</span>`;
    lastIdx = idx + 1;
  });
  
  result += text.slice(lastIdx);
  return result;
}

/**
 * Search through a dataset with fuzzy matching
 */
export function searchData(query, data, keys = ['name', 'title']) {
  if (!query || !data) return data;
  
  const results = [];
  
  data.forEach(item => {
    let bestScore = 0;
    let matchedKey = null;
    
    keys.forEach(key => {
      const value = item[key];
      if (!value) return;
      
      const matches = fuzzyMatch(query, String(value));
      if (matches) {
        const score = calculateScore(matches, String(value));
        if (score > bestScore) {
          bestScore = score;
          matchedKey = key;
        }
      }
    });
    
    if (bestScore > 0) {
      results.push({
        ...item,
        _searchScore: bestScore,
        _matchedKey: matchedKey
      });
    }
  });
  
  return results.sort((a, b) => b._searchScore - a._searchScore);
}

/**
 * Keyboard navigation handler for search results
 */
export class SearchNavigator {
  constructor(container, itemSelector = '.search-result-item') {
    this.container = container;
    this.itemSelector = itemSelector;
    this.currentIndex = -1;
    this.init();
  }
  
  init() {
    this.container.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  handleKeydown(e) {
    const items = Array.from(this.container.querySelectorAll(this.itemSelector));
    if (items.length === 0) return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentIndex = Math.min(this.currentIndex + 1, items.length - 1);
        this.updateSelection(items);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.updateSelection(items);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.currentIndex >= 0 && items[this.currentIndex]) {
          items[this.currentIndex].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.currentIndex = -1;
        this.updateSelection(items);
        break;
    }
  }
  
  updateSelection(items) {
    items.forEach((item, idx) => {
      if (idx === this.currentIndex) {
        item.classList.add('bg-blue-100', 'dark:bg-slate-700');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('bg-blue-100', 'dark:bg-slate-700');
      }
    });
  }
  
  reset() {
    this.currentIndex = -1;
  }
}
