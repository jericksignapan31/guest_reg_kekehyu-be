# Testing & Deployment Guide - Kekehyu Hotel Guest Registration

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm start

# Run tests
npm test

# Build for production
npm run build

# Serve production build locally (for testing)
npm run serve
```

---

## 🧪 Testing Procedures

### 1. Development Server Testing

#### Start Dev Server
```bash
npm start
```

Open browser: `http://localhost:4200`

#### Test Features
- [ ] Page loads without errors
- [ ] Navigation works between all routes
- [ ] Forms submit successfully
- [ ] API calls work (if backend running)
- [ ] No console errors (check DevTools)

---

### 2. Component Testing

#### Run Unit Tests
```bash
npm test
```

Tests run in watch mode. Changes auto-rerun tests.

#### Run Specific Test
```bash
npm test -- --include='**/login.component.spec.ts'
```

#### Coverage Report
```bash
npm test -- --code-coverage
```

---

### 3. Build Testing

#### Build for Production
```bash
npm run build
```

Expected output:
- ✅ No TypeScript errors
- ✅ Angular compiler completes
- ✅ Bundle size within budget (800kB warning, 2MB error)
- ⚠️ Some warnings are acceptable

#### Check Build Output
```bash
ls -la dist/guest_reg_kekehyu/browser/
```

Files should include:
- `index.html`
- `main.*.js` (main bundle)
- `styles.css` (global styles)
- `service-worker.js` (PWA support)

---

### 4. Responsive Design Testing

#### Using Chrome DevTools

1. Open DevTools (`F12` or `Ctrl+Shift+I`)
2. Click Device Toolbar (`Ctrl+Shift+M`)
3. Select devices to test:

**Phones**
- iPhone 12 (390px width)
- iPhone 14 (430px width)
- Pixel 5 (393px width)
- Galaxy S8+ (360px width)

**Tablets**
- iPad (768px width)
- iPad Pro (1024px width)

**Everything Else**
- Desktop (1920px)
- Custom: 1440px, 1920px

#### Responsive Checklist
- [ ] Text readable without zoom
- [ ] Buttons/links (44px+ touch targets)
- [ ] No horizontal scroll
- [ ] Navigation adapts to screen size
- [ ] Images scale properly
- [ ] Forms stack/align correctly
- [ ] Spacing appropriate for device

---

### 5. Dark Mode Testing

#### Enable Dark Mode

**Windows 11**:
1. Settings > Personalization > Colors
2. Select "Dark" mode
3. Refresh browser

**macOS**:
1. System Preferences > General
2. Select "Dark"
3. Refresh browser

**Chrome DevTools**:
1. Press `Ctrl+Shift+P`
2. Type "color scheme"
3. Select "Preferences: Enable dark mode"
4. Refresh page

#### Dark Mode Checklist
- [ ] Colors adjusted appropriately
- [ ] Text remains readable
- [ ] No bright white backgrounds
- [ ] Icons still visible
- [ ] Consistent with light mode

---

### 6. Accessibility Testing

#### Keyboard Navigation
1. Press `Tab` key repeatedly
2. Check that:
   - [ ] Focus outline visible
   - [ ] Logical tab order
   - [ ] All buttons accessible via keyboard
   - [ ] Forms fillable with keyboard
   - [ ] Escape closes dialogs

#### Screen Reader Test (Windows)
1. Install NVDA (free): https://www.nvaccess.org/
2. Start NVDA
3. Navigate page with arrow keys
4. Verify content is announced properly

#### Color Contrast
1. Open DevTools > Accessibility panel
2. Check contrast ratio (minimum 4.5:1 for text)

---

### 7. PWA Testing

#### Service Worker Registration

1. Open DevTools (`F12`)
2. Go to **Application** tab > **Service Workers**
3. Verify:
   - [ ] Service worker is "activated and running"
   - [ ] Scope is "/"
   - Versions shown

#### Test Offline Mode

1. DevTools > **Network** tab
2. Check **Offline** checkbox
3. Refresh page
4. Verify:
   - [ ] Static assets load (CSS, JS)
   - [ ] HTML loads
   - [ ] Layout appears
   - [ ] API calls show "failed" (expected)

#### View Cached Files

1. DevTools > **Application** > **Cache Storage**
2. Expand "kekehyu-guest-reg-v*"
3. Should see cached:
   - `index.html`
   - CSS files
   - JavaScript bundles
   - Images
   - Fonts

#### Test Installation (Android)

1. Open Chrome on Android phones
2. Address bar should show "Install" button
3. Tap to install
4. App appears on home screen
5. Launch from home screen
6. Should open in full-screen mode

#### Test Installation (iOS)

1. Open Safari on iPhone/iPad
2. Tap Share button
3. Scroll and select "Add to Home Screen"
4. Name app, select icon
5. Tap "Add"
6. App appears on home screen

---

### 8. Backend Integration Testing

#### Check API Connection

1. Ensure backend is running
2. Open DevTools > **Network** tab
3. Perform login attempt
4. Check request/response:
   - [ ] Request URL correct
   - [ ] Status 200 (success) or expected error
   - [ ] Response contains expected data
   - [ ] Headers include correct Content-Type

#### Test Auth Flow

1. Register new account → check backend
2. Login with credentials → verify token received
3. Refresh page → check token persists
4. Logout → verify token cleared
5. Try accessing protected route → verify redirected to login

#### Test Reservation Creation

1. Complete 4-step registration form
2. Submit → check API call in Network tab
3. Verify backend receives complete data
4. Check confirmation message appears
5. Verify data persists in backend

---

### 9. Performance Testing

#### Use Lighthouse

1. DevTools > **Lighthouse** tab
2. Click "Analyze page load"
3. Review scores:
   - **Performance** (target: 90+)
   - **Accessibility** (target: 90+)
   - **Best Practices** (target: 90+)
   - **SEO** (target: 90+)

#### Check Core Web Vitals

1. DevTools > **Performance** tab
2. Record page load
3. Look for:
   - **LCP** (Largest Contentful Paint) < 2.5s ✅
   - **FID** (First Input Delay) < 100ms ✅
   - **CLS** (Cumulative Layout Shift) < 0.1 ✅

#### Bundle Size Analysis

```bash
npm install --save-dev webpack-bundle-analyzer

# Add to angular.json build options:
# "optimization": true,
# "outputHashing": "all"

npm run build -- --stats-json

npx webpack-bundle-analyzer dist/guest_reg_kekehyu/browser/stats.json
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No critical console warnings
- [ ] Lighthouse scores > 85
- [ ] Responsive design tested on multiple devices
- [ ] Dark mode tested
- [ ] Offline mode tested
- [ ] PWA installable
- [ ] All API endpoints tested with backend
- [ ] Authentication flow working
- [ ] Database backups created (backend)

### Environment Setup

#### Development
```bash
# DEV API endpoint
API_URL=http://localhost:3000/api
ENVIRONMENT=development
```

#### Production
```bash
# PROD API endpoint (HTTPS required!)
API_URL=https://api.kekehyu.com/api
ENVIRONMENT=production
```

### Deployment Steps

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Test Build Locally**
   ```bash
   npm run serve
   # Opens: http://localhost:4200
   ```

3. **Deploy Files**
   ```
   Upload dist/guest_reg_kekehyu/browser/* to server
   ```

4. **Enable HTTPS**
   - Get SSL certificate (Let's Encrypt, etc.)
   - Configure web server (Nginx, Apache)
   - Redirect HTTP → HTTPS

5. **Configure Web Server**

   **Nginx Example**:
   ```nginx
   server {
     listen 443 ssl http2;
     server_name kekehyu.com;
     
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     
     root /var/www/guest-reg;
     index index.html;
     
     # Route all requests to index.html (SPA)
     location / {
       try_files $uri $uri/ /index.html;
     }
     
     # Service worker should not be cached
     location /service-worker.js {
       add_header Cache-Control "no-cache, no-store, must-revalidate";
     }
     
     # Cache static assets for 1 year
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   
   # Redirect HTTP to HTTPS
   server {
     listen 80;
     server_name kekehyu.com;
     return 301 https://$server_name$request_uri;
   }
   ```

   **Apache Example**:
   ```apache
   <VirtualHost *:443>
     ServerName kekehyu.com
     
     SSLEngine on
     SSLCertificateFile /path/to/cert.pem
     SSLCertificateKeyFile /path/to/key.pem
     
     DocumentRoot /var/www/guest-reg
     
     <Directory /var/www/guest-reg>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </Directory>
     
     # Service worker caching
     <Files "service-worker.js">
       Header set Cache-Control "no-cache, no-store, must-revalidate"
     </Files>
     
     # Cache static assets
     <FilesMatch "\.(js|css|png|jpg|gif|svg|woff|woff2|ttf|eot)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
     </FilesMatch>
   </VirtualHost>
   
   # Redirect HTTP to HTTPS
   <VirtualHost *:80>
     ServerName kekehyu.com
     Redirect permanent / https://kekehyu.com/
   </VirtualHost>
   ```

6. **Verify Installation**
   - [ ] Open https://kekehyu.com in browser
   - [ ] Page loads
   - [ ] No HTTPS warnings
   - [ ] Service worker registers
   - [ ] PWA installable

---

## 🔄 Continuous Deployment (Optional)

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --watch=false
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      env:
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
      run: |
        mkdir -p ~/.ssh
        echo "$DEPLOY_KEY" > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        scp -r dist/guest_reg_kekehyu/browser/* user@server:/var/www/guest-reg/
```

---

## 📊 Monitoring & Maintenance

### Monitor Service Worker Updates

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered Service Workers:', registrations);
});
```

### Clear Service Worker Cache

```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => {
    caches.delete(name).then(() => {
      console.log('Cache cleared:', name);
    });
  });
});
```

### Monitor API Errors

1. DevTools > **Network** tab
2. Filter by "XHR/Fetch"
3. Check for failed requests
4. Review status codes

### Database Backups

- Schedule daily backups (backend)
- Test restore procedures
- Keep 30-day backup history

---

## 🆘 Troubleshooting

### Service Worker Not Registering

```
Problem: Service worker fails to register
Solution:
1. Check browser console for errors
2. Verify HTTPS is enabled (production)
3. Check service-worker.js file exists
4. Try hard refresh (Ctrl+Shift+R)
5. Clear all caches
```

### API Calls Failing in Production

```
Problem: Login/API calls return 400/500 errors
Solution:
1. Check backend is running
2. Verify API URLs in environment.ts
3. Check CORS headers allow origin
4. Review server logs for errors
5. Check database is connected
```

### Poor Lighthouse Scores

```
Problem: Lighthouse Performance < 85
Solution:
1. Enable production build optimizations
2. Use lazy loading for routes
3. Optimize images (WebP, smaller sizes)
4. Enable gzip compression on server
5. Use CDN for static assets
```

### App Crashes When Offline

```
Problem: App errors when offline
Solution:
1. This is expected - API calls will fail
2. Ensure service worker shows graceful error
3. Implement offline-capable features
4. Add "offline mode" UI message
5. Queue failed requests for retry
```

---

## 📚 Reference Links

- [Angular Deployment Guide](https://angular.dev/guide/build-deploy)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Apache Rewrite Rules](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [SSL Certificate Setup](https://letsencrypt.org/getting-started/)
- [Web Vitals](https://web.dev/vitals/)

---

## 📞 Support Contacts

**If you encounter issues:**

1. Check browser console (`F12` → Console tab)
2. Review network requests (`F12` → Network tab)
3. Check service worker status (`F12` → Application tab)
4. Run production build locally: `npm run serve`
5. Review server logs (backend server)
6. Check database connectivity

---

**Last Updated**: April 10, 2026
**Angular Version**: 21.2.0
**Deployment Ready**: ✅ Yes
