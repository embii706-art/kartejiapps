# KARTEJI v2.5.0 - Modern Organization Management

A modern single-page application with premium UI, built with vanilla JavaScript and cutting-edge web technologies.

## 🚀 What's New in v2.5.0

### Major Overhaul
- ✨ **Professional Modular Structure** - Reorganized into `/src`, `/public` with clear separation
- 🎨 **Premium Dark Mode** - Enhanced with sophisticated gradients and color palette
- 💎 **Glassmorphism UI** - Modern blur and translucency effects throughout
- 🎭 **3D Card Effects** - Interactive tilt/rotate animations with pointer movement
- 🔍 **Smart Search** - Fuzzy matching with keyboard navigation and highlighting
- 📱 **Social Sharing** - Web Share API integration with fallback
- 📦 **Enhanced PWA** - Improved service worker, install prompts, and offline support

### Technology Stack
- **Frontend**: HTML + Tailwind CSS (CDN) + Vanilla JS (ESM)
- **Backend**: Firebase v9 (Firestore + Auth)
- **Media**: Cloudinary integration
- **Build**: Vite for optimized production builds
- **Deployment**: Vercel-optimized with zero config

## 🎨 Features

### Core Functionality
- SPA routing with hash-based navigation
- Bottom navigation with glassmorphism effect
- Dynamic theme system (light/dark/system)
- Offline detection and connection status
- Firebase authentication and data management

### v2.5.0 Enhancements
1. **Interactive 3D Cards** - Smooth tilt effects on pointer movement (respects reduced-motion)
2. **Glassmorphism** - Applied to navigation, cards, and modals with backdrop blur
3. **Smart Search** - Fuzzy matching across content with keyboard shortcuts
4. **Social Sharing** - Share pages and content via Web Share API
5. **PWA Ready** - Install prompts, service worker, offline caching

## 🛠️ Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)
The project is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

Build settings are pre-configured in `vercel.json`.

### Firebase Hosting
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## 📁 Project Structure

```
kartejiapps/
├── public/               # Static assets
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── assets/         # Bundled assets
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Core libraries
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── functions/          # Firebase Cloud Functions
├── index.html         # Entry point
├── package.json       # Dependencies
├── vite.config.js     # Build configuration
└── vercel.json        # Deployment config
```

## 🎯 Key Features Detail

### Glassmorphism Effect
Apply the `.glass` class to any element for instant glassmorphism:
```html
<div class="glass rounded-xl p-4">Content</div>
```

### 3D Card Effects
Add `.card-3d` class for interactive tilt effects:
```html
<div class="card-3d rounded-xl p-4">Hover me!</div>
```

### Smart Search
```javascript
import { searchData, highlightMatches } from '/src/utils/search.js';

const results = searchData(query, data, ['name', 'title']);
const highlighted = highlightMatches(text, query);
```

### Social Sharing
```javascript
import { shareContent } from '/src/utils/share.js';

await shareContent({
  title: 'My Page',
  text: 'Check this out!',
  url: window.location.href
});
```

## 🔒 Security Features
- XSS Protection headers
- Content Security Policy
- Secure service worker implementation
- Firebase security rules

## 📱 PWA Features
- Installable on all platforms
- Offline functionality
- Background sync ready
- Push notification ready (hooks included)

## 🌐 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License
Private project - All rights reserved

## 👥 Contributing
This is a private organization project. Contact the maintainers for contribution guidelines.

---

**Version**: 2.5.0  
**Last Updated**: January 2026  
**Maintained by**: KARTEJI Development Team

