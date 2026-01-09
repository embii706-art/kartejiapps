/**
 * useSearch Hook - v2.5.0
 * Custom hook for managing search state and functionality
 */

import { searchData, highlightMatches, SearchNavigator } from '../utils/search.js';

export function createSearchHook(data, keys) {
  let query = '';
  let results = data;
  let navigator = null;
  let callbacks = [];
  
  const state = {
    get query() { return query; },
    get results() { return results; },
    
    search(newQuery) {
      query = newQuery;
      results = query ? searchData(query, data, keys) : data;
      this.notify();
      return results;
    },
    
    clear() {
      query = '';
      results = data;
      if (navigator) navigator.reset();
      this.notify();
    },
    
    highlight(text) {
      return highlightMatches(text, query);
    },
    
    initNavigator(container, itemSelector) {
      if (navigator) return navigator;
      navigator = new SearchNavigator(container, itemSelector);
      return navigator;
    },
    
    onChange(callback) {
      callbacks.push(callback);
      return () => {
        callbacks = callbacks.filter(cb => cb !== callback);
      };
    },
    
    notify() {
      callbacks.forEach(cb => cb({ query, results }));
    }
  };
  
  return state;
}
