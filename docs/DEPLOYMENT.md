# 🚀 KARTEJI V2.5 - Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd /workspaces/kartejiapps
vercel

# For production deployment
vercel --prod
```

### Option 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "KARTEJI V2.5 - Major update with premium features"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings

3. **Configure (if needed)**
   - Build Command: (leave empty)
   - Output Directory: `.`
   - Install Command: (leave empty)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `your-project.vercel.app`

---

## Environment Setup

### Firebase Configuration

Create environment variables in Vercel dashboard:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Cloudinary Configuration

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Vercel Configuration Details

The `vercel.json` file is already optimized with:

### ✅ Smart Caching
- Service Worker: No cache (always fresh)
- Static assets: 1 year cache with immutable flag
- Images: 1 year cache
- JavaScript/CSS: 1 year cache

### ✅ Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricted camera/microphone/geolocation

### ✅ SPA Routing
- All routes redirect to index.html
- Clean URLs enabled
- No trailing slashes

### ✅ Performance
- Region: Singapore (sin1) - Optimized for Asia
- Function memory: 1024MB
- Function timeout: 10s

---

## Post-Deployment Checklist

### 1. Verify PWA Installation
- [ ] Open deployed URL on mobile device
- [ ] Check "Add to Home Screen" option appears
- [ ] Install PWA and verify icon shows correctly
- [ ] Test offline functionality

### 2. Test All Features
- [ ] 3D Card effects work on hover
- [ ] Glassmorphism UI renders correctly
- [ ] Smart search performs fuzzy matching
- [ ] Social sharing opens share dialog
- [ ] Theme switching works (light/dark)
- [ ] All routes load correctly

### 3. Performance Check
- [ ] Run Lighthouse audit (target 90+ score)
- [ ] Verify First Contentful Paint < 1s
- [ ] Check Time to Interactive < 2s
- [ ] Test on slow 3G connection

### 4. Cross-Browser Testing
- [ ] Chrome/Edge (Desktop & Mobile)
- [ ] Firefox
- [ ] Safari (iOS)
- [ ] Samsung Internet

### 5. Service Worker
- [ ] Verify SW registers successfully
- [ ] Check cache is working
- [ ] Test offline mode
- [ ] Confirm update mechanism works

---

## Troubleshooting

### Issue: White Screen / App Not Loading

**Solution 1: Check Browser Console**
```javascript
// Open DevTools Console
// Look for error messages
// Common issues:
// - Module not found
// - CORS errors
// - Firebase configuration errors
```

**Solution 2: Clear Cache**
```javascript
// In browser DevTools:
// Application > Storage > Clear site data
// Or use Incognito/Private mode
```

**Solution 3: Verify File Paths**
```bash
# Ensure all imports use absolute paths starting with /
# Example: import './file.js' ❌
#          import '/src/file.js' ✅
```

### Issue: Service Worker Not Updating

**Solution:**
```javascript
// In browser DevTools:
// Application > Service Workers > Unregister
// Then hard refresh (Ctrl+Shift+R)

// Or programmatically:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### Issue: 3D Effects Not Working

**Solution:**
```javascript
// Ensure Card3D component is imported and initialized:
import Card3D from '/src/components/Card3D.js';
const card3d = new Card3D();
card3d.initAll('.card-3d');
```

### Issue: PWA Not Installing on iOS

**Solution:**
1. Verify manifest.json is accessible
2. Check apple-touch-icon is present
3. Ensure HTTPS is enabled (required by iOS)
4. Clear Safari cache and try again

### Issue: Vercel Deployment Fails

**Solution 1: Check Build Logs**
```bash
# View deployment logs in Vercel dashboard
# Look for:
# - File not found errors
# - Permission issues
# - Build command errors
```

**Solution 2: Verify vercel.json Syntax**
```bash
# Validate JSON syntax
cat vercel.json | jq .
```

**Solution 3: Clean Deploy**
```bash
# Remove node_modules and redeploy
rm -rf node_modules
vercel --force
```

---

## Performance Optimization

### 1. Image Optimization
```html
<!-- Use WebP format where possible -->
<img src="image.webp" alt="Description" />

<!-- Add loading="lazy" for below-fold images -->
<img src="image.jpg" loading="lazy" alt="Description" />
```

### 2. Code Splitting
```javascript
// Use dynamic imports for large modules
const module = await import('/src/large-module.js');
```

### 3. Preload Critical Assets
```html
<!-- Add to index.html <head> -->
<link rel="preload" href="/src/main.js" as="script" />
<link rel="preload" href="/src/styles.css" as="style" />
```

### 4. Enable Compression
Vercel automatically enables gzip/brotli compression for:
- HTML, CSS, JavaScript
- JSON files
- SVG images

---

## Monitoring & Analytics

### Setup Google Analytics (Optional)

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Monitor with Vercel Analytics

Enable in Vercel Dashboard:
- Project Settings > Analytics
- Enable "Vercel Analytics"
- View real-time performance metrics

---

## Rollback Strategy

### Revert to Previous Deployment

```bash
# List deployments
vercel ls

# Promote specific deployment to production
vercel promote <deployment-url>
```

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

---

## Custom Domain Setup

### 1. Add Domain in Vercel

```bash
# Via CLI
vercel domains add yourdomain.com

# Or use Vercel Dashboard:
# Project Settings > Domains > Add Domain
```

### 2. Configure DNS

Add these records to your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. Update manifest.json

```json
{
  "start_url": "https://yourdomain.com/#/home",
  // ... other settings
}
```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch → Production
- Push to other branches → Preview deployments
- Create PR → Preview deployment with unique URL

### Deployment Branches

Configure in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  }
}
```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Firebase Documentation**: https://firebase.google.com/docs
- **PWA Guidelines**: https://web.dev/progressive-web-apps/

---

## Success! 🎉

Your KARTEJI V2.5 app is now deployed with:
- ✅ Premium UI with gradients and glassmorphism
- ✅ Interactive 3D card effects
- ✅ Smart search functionality
- ✅ Social media sharing
- ✅ Enhanced PWA support
- ✅ Optimized Vercel configuration

**Next Steps:**
1. Share your deployment URL
2. Test all features on various devices
3. Monitor performance with Lighthouse
4. Collect user feedback
5. Iterate and improve

---

**Happy Deploying! 🚀**
