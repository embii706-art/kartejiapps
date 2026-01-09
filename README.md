# KARTEJI - Aplikasi Manajemen Organisasi

Aplikasi web Progressive Web App (PWA) untuk manajemen organisasi dengan fitur lengkap.

## Teknologi
- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript (ES Modules)
- Firebase v9 (Auth, Firestore, Functions)
- Cloudinary (Upload Media)
- PWA dengan Service Worker

## Deployment ke Vercel

### Quick Deploy
1. Hubungkan repository GitHub ke Vercel
2. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`
3. Deploy akan menggunakan folder `KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL` sebagai output

### Manual Configuration (jika diperlukan)
- **Build Command**: None (static site)
- **Output Directory**: `KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL`
- **Install Command**: None
- **Framework Preset**: Other

## Firebase Setup

### 1. Deploy Firebase Functions
```bash
cd KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL/functions
npm install
cd ..
firebase deploy --only functions
```

### 2. Deploy Firestore Rules
```bash
cd KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL
firebase deploy --only firestore:rules
```

## Fitur Utama
- ✅ Autentikasi pengguna dengan persetujuan admin
- ✅ Manajemen kegiatan dan absensi
- ✅ Sistem keuangan/kas
- ✅ Feed/pengumuman
- ✅ Kalender dengan hari libur nasional
- ✅ Jadwal sholat otomatis
- ✅ Tema terang/gelap/sistem
- ✅ Notifikasi offline/online
- ✅ PWA installable (iOS & Android)
- ✅ Role-based access control
- ✅ Seasonal theme decorations

## Struktur Proyek
```
KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL/
├── index.html              # Entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── vercel.json            # Vercel config
├── firestore.rules        # Security rules
├── src/
│   ├── main.js            # App bootstrap
│   ├── router.js          # Hash router
│   ├── render.js          # Page renderer
│   ├── lib/               # Utilities
│   ├── components/        # UI components
│   └── pages/             # Page modules
├── functions/             # Firebase Cloud Functions
└── assets/                # Static assets
```

## Troubleshooting

### Stuck di Splash Screen
1. Clear browser cache (Safari iOS: Settings > Safari > Clear History)
2. Uninstall PWA dan install ulang
3. Unregister Service Worker di DevTools
4. Pastikan semua file ada di deployment

### PWA tidak bisa di-install
1. Pastikan site menggunakan HTTPS
2. Cek manifest.json sudah accessible
3. Pastikan semua icon tersedia
4. Cek Service Worker registered dengan benar

## Development

### Local Development
1. Gunakan local web server (contoh: `python -m http.server 8000`)
2. Buka `http://localhost:8000/KARTEJI_SPA_v1.8.6_FINAL_VERCEL_SAFEMODE_FULL/`
3. Pastikan Firebase config sudah benar di `src/lib/firebase.js`

### Update Service Worker
Setiap kali ada perubahan file, update version number di `sw.js`:
```javascript
const CACHE = 'karteji-v1.8.7'; // increment version
```

## License
Private - All rights reserved
