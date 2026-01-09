/**
 * KARTEJI V2.5 - Feature Usage Examples
 * Demonstration of how to use new features
 */

// ============================================
// 1. 3D CARD EFFECTS USAGE
// ============================================

import Card3D from './components/Card3D.js';

const card3d = new Card3D();

// Example 1: Basic Tilt Effect
const tiltEffect = card3d.initTiltEffect('#myCard', {
  maxTilt: 20,
  perspective: 1000,
  scale: 1.1,
  glare: true,
  maxGlare: 0.3
});

// Example 2: Flip Card Effect
const flipEffect = card3d.initFlipEffect('#flipCard', {
  trigger: 'click', // or 'hover'
  duration: 600,
  flipDirection: 'horizontal' // or 'vertical'
});

// Example 3: Initialize all cards with class
card3d.initAll('.card-3d', {
  maxTilt: 15,
  scale: 1.05
});

// Example 4: Floating Animation
const floatingCard = card3d.initFloatingEffect('#floatingCard', {
  duration: 3000,
  distance: 10
});

// ============================================
// 2. SMART SEARCH USAGE
// ============================================

import SmartSearch from './components/SmartSearch.js';

const search = new SmartSearch();

// Sample data
const searchData = [
  { title: 'Dashboard', description: 'Main overview page', category: 'Pages' },
  { title: 'Calendar', description: 'Schedule and events', category: 'Pages' },
  { title: 'Documents', description: 'File management', category: 'Pages' },
  { title: 'Finance', description: 'Budget tracking', category: 'Finance' },
  { title: 'Members', description: 'User management', category: 'Admin' }
];

// Initialize search
search.initialize(searchData);

// Create search UI
search.createSearchUI('searchContainer', (results, query) => {
  console.log('Search results:', results);
  displayResults(results);
}, {
  placeholder: 'Cari halaman...',
  showCategories: true,
  categories: ['Pages', 'Finance', 'Admin']
});

// Programmatic search
const results = search.fuzzySearch('calendr'); // Fuzzy match for 'calendar'
console.log('Fuzzy results:', results);

// Search by category
const financeResults = search.searchByCategory('budget', 'Finance');

// Get suggestions
const suggestions = search.getSuggestions('doc', 5);

// ============================================
// 3. SOCIAL SHARING USAGE
// ============================================

import SocialShare from './components/SocialShare.js';

const socialShare = new SocialShare();

// Share data
const shareData = {
  title: 'KARTEJI V2.5',
  description: 'Modern management system with premium UI',
  url: window.location.href
};

// Example 1: Create share button
socialShare.createShareButton('shareContainer', shareData, {
  platforms: ['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin'],
  showNativeShare: true,
  showCopyLink: true,
  buttonClass: 'btn-premium'
});

// Example 2: Floating share button
const floatingShare = socialShare.createFloatingShareButton(shareData, {
  position: 'bottom-right',
  platforms: ['facebook', 'twitter', 'whatsapp']
});

// Example 3: Direct platform share
socialShare.shareToPlatform('twitter', shareData);

// Example 4: Native share (if supported)
if (socialShare.canUseNativeShare()) {
  await socialShare.nativeShare(shareData);
}

// Example 5: Copy link
const copyResult = await socialShare.copyLink(shareData.url);
if (copyResult.success) {
  console.log('Link copied!');
}

// ============================================
// 4. GLASSMORPHISM UI EXAMPLES
// ============================================

// HTML Examples:

// Glass Card
const glassCard = `
  <div class="glass-card rounded-2xl p-6">
    <h3 class="font-bold text-lg mb-2">Glass Card</h3>
    <p class="text-sm opacity-80">
      This card has a frosted glass effect with backdrop blur
    </p>
  </div>
`;

// Glass Navigation
const glassNav = `
  <nav class="glass fixed bottom-0 left-0 right-0 p-4">
    <div class="flex justify-around">
      <button class="glass-card p-3 rounded-xl">Home</button>
      <button class="glass-card p-3 rounded-xl">Search</button>
      <button class="glass-card p-3 rounded-xl">Profile</button>
    </div>
  </nav>
`;

// Premium Button with Gradient
const premiumButton = `
  <button class="btn-premium px-6 py-3 rounded-xl font-semibold">
    Click Me
  </button>
`;

// ============================================
// 5. PREMIUM COLOR GRADIENTS
// ============================================

// Apply gradients programmatically
function applyGradient(element, gradientType) {
  const gradients = {
    primary: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  };
  
  element.style.background = gradients[gradientType];
}

// Gradient text
const gradientText = `
  <h1 class="gradient-text text-4xl font-bold">
    KARTEJI V2.5
  </h1>
`;

// ============================================
// 6. COMPLETE PAGE EXAMPLE
// ============================================

export function createPremiumPage() {
  return `
    <div class="min-h-screen p-4 page-enter">
      <!-- Premium Header -->
      <header class="glass-card rounded-2xl p-6 mb-4 card-shine">
        <h1 class="gradient-text text-3xl font-bold mb-2">Dashboard</h1>
        <p class="text-sm opacity-70">Welcome back to KARTEJI V2.5</p>
      </header>

      <!-- Search Bar -->
      <div id="searchContainer" class="mb-4"></div>

      <!-- 3D Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <!-- Card 1 with 3D Tilt -->
        <div class="card-3d glass-card rounded-2xl p-6">
          <div class="text-2xl mb-2">📊</div>
          <h3 class="font-bold text-lg mb-2">Analytics</h3>
          <p class="text-sm opacity-80">View your statistics</p>
        </div>

        <!-- Card 2 with Flip Effect -->
        <div class="card-3d-flip glass-card rounded-2xl p-6 cursor-pointer">
          <div class="card-3d-front">
            <div class="text-2xl mb-2">📅</div>
            <h3 class="font-bold text-lg mb-2">Calendar</h3>
            <p class="text-sm opacity-80">Manage events</p>
          </div>
          <div class="card-3d-back flex items-center justify-center">
            <p class="text-center">Click to flip back</p>
          </div>
        </div>

        <!-- Card 3 with Gradient -->
        <div class="card-3d glass-card rounded-2xl p-6 gradient-1 text-white">
          <div class="text-2xl mb-2">💰</div>
          <h3 class="font-bold text-lg mb-2">Finance</h3>
          <p class="text-sm opacity-90">Track budget</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="glass-card rounded-xl p-4 text-center">
          <div class="text-3xl font-bold gradient-text">150</div>
          <div class="text-sm opacity-70 mt-1">Total Users</div>
        </div>
        
        <div class="glass-card rounded-xl p-4 text-center">
          <div class="text-3xl font-bold gradient-text">24</div>
          <div class="text-sm opacity-70 mt-1">Active Today</div>
        </div>
      </div>

      <!-- Share Section -->
      <div class="glass-card rounded-2xl p-6">
        <h3 class="font-bold text-lg mb-4">Share This App</h3>
        <div id="shareContainer"></div>
      </div>

      <!-- Floating Action Button -->
      <button class="fixed bottom-20 right-4 w-14 h-14 rounded-full btn-premium shadow-2xl flex items-center justify-center animate-bounce">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </div>
  `;
}

// Initialize features
export function initializeFeatures() {
  // Initialize 3D effects
  const card3d = new Card3D();
  card3d.initAll('.card-3d');
  
  // Initialize search
  const search = new SmartSearch();
  search.initialize(searchData);
  search.createSearchUI('searchContainer', displaySearchResults);
  
  // Initialize sharing
  const share = new SocialShare();
  share.createShareButton('shareContainer', shareData);
}

// ============================================
// 7. ANIMATION UTILITIES
// ============================================

// Fade in elements on scroll
export function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Stagger animation for list items
export function staggerAnimation(selector, delay = 100) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * delay}ms`;
    item.classList.add('animate-fadeIn');
  });
}

// ============================================
// 8. THEME UTILITIES
// ============================================

// Toggle dark mode with smooth transition
export function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}

// Initialize theme from localStorage
export function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

// ============================================
// EXPORT ALL UTILITIES
// ============================================

export {
  Card3D,
  SmartSearch,
  SocialShare,
  createPremiumPage,
  initializeFeatures,
  animateOnScroll,
  staggerAnimation,
  toggleDarkMode,
  initTheme
};
