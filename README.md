# 🎯 KARTEJI - Aplikasi Manajemen Organisasi

Progressive Web App (PWA) modern untuk manajemen organisasi dengan real-time collaboration.

[![Firebase](https://img.shields.io/badge/Firebase-v9.23.0-orange)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Integration-blue)](https://cloudinary.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ Email/Password authentication
- ✅ Role-based access control (RBAC)
- ✅ User approval system
- ✅ Password reset functionality
- ✅ First user auto-admin

### 📱 Core Modules
- **Dashboard** - Real-time statistics and overview
- **Feed** - Social posts with photos and likes
- **Activities** - Event management and scheduling
- **Finance** - Transaction tracking with receipts
- **Members** - User directory with roles
- **Admin Panel** - User and role management
- **Calendar** - Events and important dates
- **Documents** - Shared document library
- **Minutes** - Meeting notes

### 🚀 Technical Features
- ⚡ Real-time data synchronization (Firestore)
- 📸 Image upload via Cloudinary
- 🔒 Secure Firestore rules
- 📱 Progressive Web App (PWA)
- 🌙 Dark mode support
- 📊 Cloud Functions for backend logic
- 🔄 Offline support
- 🎨 Modern UI with Tailwind CSS

## 🏗️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules), Tailwind CSS (CDN)
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting)
- **Storage**: Cloudinary (Image hosting & optimization)
- **Architecture**: SPA with Hash Router
- **Deployment**: Firebase Hosting / Vercel

## 🚀 Quick Start

### Prerequisites
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Installation

1. **Clone repository**
```bash
git clone https://github.com/embii706-art/kartejiapps.git
cd kartejiapps
```

2. **Install dependencies**
```bash
cd functions
npm install
cd ..
```

3. **Configure Firebase & Cloudinary**
   - Firebase config sudah ada di `src/lib/firebase.js`
   - Cloudinary config sudah ada di `src/lib/cloudinary.js`
   - Jika perlu, sesuaikan dengan project Anda

4. **Setup Cloudinary Upload Preset**
   - Login ke [Cloudinary Dashboard](https://cloudinary.com/console)
   - Settings → Upload → Upload Presets
   - Buat preset baru: **`Karteji`**
   - Signing Mode: **Unsigned**
   - Save

5. **Deploy to Firebase**
```bash
# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting
```

6. **First Time Setup**
   - Buka aplikasi di browser
   - Register user pertama (otomatis jadi Super Admin)
   - Mulai gunakan aplikasi!

## 📖 Documentation

- **[Quick Start](docs/QUICKSTART.md)** - Panduan cepat memulai
- **[Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)** - Panduan implementasi detail
- **[Deployment](docs/DEPLOYMENT.md)** - Panduan deployment produksi
- **[Summary](docs/SUMMARY.md)** - Ringkasan fitur
- **[Troubleshooting](docs/TROUBLESHOOTING_VERCEL.md)** - Solusi masalah umum
- **[Version History](docs/VERSION_HISTORY.md)** - Riwayat versi

## 🎯 User Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full system access, manage all |
| `ketua` | Admin access, approve users, manage roles |
| `wakil_ketua` | Admin access, manage activities |
| `sekretaris` | Manage documents, minutes, activities |
| `bendahara` | Manage finance transactions |
| `koordinator_sie` | Manage activities, coordinate teams |
| `anggota` | Basic member access, create posts |

## 🔒 Security

- ✅ Firestore Security Rules implemented
- ✅ Role-based access control (RBAC)
- ✅ Client-side and server-side validation
- ✅ Cloud Functions for sensitive operations
- ✅ Rate limiting on API calls
- ✅ Secure image upload (Cloudinary)
- ✅ Profile updates via Cloud Functions only

## 📊 Database Structure

```
Firestore Collections:
├── profiles              # User profiles, roles, approval status
├── posts                # Social feed posts with images
├── activities           # Events and activities
├── finance_transactions # Financial records with receipts
├── announcements        # Organization announcements
├── documents            # Shared documents
├── minutes              # Meeting minutes
├── presence             # Online/offline status
└── calendar_events      # Calendar events
```

## 🛠️ Development

### Local Development
```bash
# Serve locally
firebase serve

# Or use emulators (recommended)
firebase emulators:start
```

### Project Structure
```
kartejiapps/
├── src/
│   ├── pages/              # Page components
│   │   ├── auth/          # Auth pages (login, register)
│   │   └── admin/         # Admin pages
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and helpers
│   │   ├── firebase.js    # Firebase config
│   │   ├── cloudinary.js  # Cloudinary config
│   │   ├── profile.js     # Profile helpers
│   │   └── gates.js       # Auth gates
│   ├── main.js            # App entry point
│   └── router.js          # Router config
├── functions/             # Cloud Functions
│   └── index.js          # Functions implementation
├── docs/                  # Documentation
├── assets/               # Static assets
├── firestore.rules       # Firestore security rules
├── manifest.json         # PWA manifest
├── sw.js                # Service Worker
└── index.html           # Main HTML file
```

## 🔧 Configuration

### Firebase Configuration
File: `src/lib/firebase.js`
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Cloudinary Configuration
File: `src/lib/cloudinary.js`
```javascript
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "Karteji"; // Must create this preset
```

## 🧪 Testing

### Test User Flow
1. Register → Create Profile → Pending Status
2. Admin Approve (manual via Firebase Console)
3. Login → Access Dashboard
4. Create Post, Activity, Transaction
5. View Members, Admin Panel

### Checklist
- [ ] Register & Login works
- [ ] First user becomes admin
- [ ] Password reset works
- [ ] Profile creation works
- [ ] Post creation with images
- [ ] Activity management
- [ ] Finance transactions
- [ ] Role-based access control
- [ ] Real-time updates
- [ ] Offline support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **embii706-art** - [GitHub](https://github.com/embii706-art)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Cloudinary for image optimization
- Tailwind CSS for beautiful UI
- Community contributors

## 📞 Support

For support, questions, or feedback:
- 📝 [Create an Issue](https://github.com/embii706-art/kartejiapps/issues)
- 📖 Check [Documentation](docs/)
- 🐛 Review [Troubleshooting](docs/TROUBLESHOOTING_VERCEL.md)

## 🎊 Current Version

**v1.8.0** - Production Ready

See [Version History](docs/VERSION_HISTORY.md) for changelog.

---

**Made with ❤️ for better organization management**

🚀 **Ready to use in production!**
