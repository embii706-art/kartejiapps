# KARTEJI - Modern Organization Management App

A modern Progressive Web App (PWA) for organization management with engaging features and glassmorphism UI.

## 🚀 Features

### Core Features
- ✅ User authentication with admin approval
- ✅ Activity management and attendance tracking
- ✅ Financial/treasury management
- ✅ Feed/announcements
- ✅ Calendar with national holidays
- ✅ Automatic prayer times
- ✅ Role-based access control
- ✅ PWA installable (iOS & Android)

### New Enhanced Features
- ✨ **Interactive 3D Card Effects** - Smooth card transformations with depth
- 🎨 **Glassmorphism UI** - Modern frosted glass design throughout
- 🔍 **Smart Search System** - Fuzzy search across all content
- 📱 **Social Media Sharing** - Share activities and announcements
- 📲 **Enhanced PWA** - Better offline support and install prompts

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (ES Modules)
- **Backend**: Firebase v9 (Auth, Firestore, Functions)
- **Media**: Cloudinary
- **PWA**: Service Worker with smart caching
- **Deployment**: Vercel

## 📁 Project Structure

```
/
├── public/              # Static assets
│   ├── index.html      # Entry point
│   ├── manifest.json   # PWA manifest
│   ├── sw.js          # Service worker
│   └── assets/        # Images & icons
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── utils/        # Utility functions
│   ├── styles/       # CSS files
│   ├── features/     # New feature modules
│   ├── main.js       # App bootstrap
│   └── router.js     # Hash router
├── functions/        # Firebase Cloud Functions
├── firestore.rules   # Security rules
└── vercel.json       # Deployment config
```

## 🚀 Deployment to Vercel

### Quick Deploy
1. Connect your GitHub repository to Vercel
2. Vercel auto-detects configuration from `vercel.json`
3. Deploy!

### Manual Configuration
- **Build Command**: None (static site)
- **Output Directory**: `public`
- **Framework Preset**: Other

## 🔧 Firebase Setup

### 1. Deploy Firebase Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 2. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## 🎨 Theme System

The app features a sophisticated theme system:
- **Light/Dark/System** modes
- **Seasonal decorations** (Ramadan, Independence Day, etc.)
- **Glassmorphism** design with frosted glass effects
- **3D card animations** with depth and shadows

## 🔍 Smart Search

The smart search feature includes:
- **Fuzzy matching** - Find results even with typos
- **Multi-field search** - Search across titles, descriptions, dates
- **Real-time results** - Instant search as you type
- **Keyboard shortcuts** - Press `/` to focus search

## 📱 PWA Features

Enhanced Progressive Web App capabilities:
- **Install prompts** - Smart prompts for iOS and Android
- **Offline support** - Works without internet connection
- **Push notifications** - Stay updated (if enabled)
- **App-like experience** - Full-screen, smooth animations

## 🤝 Social Sharing

Share content across platforms:
- **Native sharing** - Uses Web Share API when available
- **Social platforms** - Facebook, Twitter, WhatsApp, Email
- **Copy link** - Quick link copying functionality
- **Custom messages** - Formatted for each platform

## 🛡️ Security

- **Comprehensive Firestore rules** with role-based access
- **Rate limiting** on Cloud Functions
- **Input sanitization** to prevent XSS
- **Secure authentication** with Firebase Auth
- **CodeQL scanned** - Zero security alerts
- **Dependency checked** - No known vulnerabilities

## 📱 Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Stuck on Splash Screen
1. Clear browser cache
2. Unregister Service Worker (DevTools > Application > Service Workers)
3. Reload the page

### PWA Not Installing
1. Ensure site uses HTTPS
2. Check manifest.json is accessible
3. Verify all icons are available
4. Check Service Worker registered correctly

## 📄 License

Private - All rights reserved

## 🎯 Version

**v2.0.0** - Complete overhaul with modern architecture and features
