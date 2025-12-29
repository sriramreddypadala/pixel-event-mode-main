# Deployment Guide

## 🚀 Building for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Production Bundle
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 3. Preview Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = Your backend API URL
     - `VITE_MACHINE_ID` = Your machine ID

---

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add same variables as above

---

### Option 3: Static Hosting

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to:**
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - Any static hosting service

---

### Option 4: Self-Hosted (Node.js)

1. **Install serve:**
   ```bash
   npm install -g serve
   ```

2. **Serve the build:**
   ```bash
   serve -s dist -p 3000
   ```

3. **Use PM2 for production:**
   ```bash
   npm install -g pm2
   pm2 start "serve -s dist -p 3000" --name photobooth
   pm2 save
   pm2 startup
   ```

---

## 🔧 Environment Configuration

### Development (`.env.development`)
```env
VITE_API_URL=http://localhost:3000
VITE_MACHINE_ID=dev-machine-001
```

### Production (`.env.production`)
```env
VITE_API_URL=https://api.yourbackend.com
VITE_MACHINE_ID=prod-machine-001
```

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested and working
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Backend API endpoints ready
- [ ] Camera permissions tested
- [ ] Print counter working
- [ ] All navigation paths correct
- [ ] 300 DPI rendering verified

---

## 🔒 Security Considerations

1. **HTTPS Only:**
   - Camera requires HTTPS in production
   - Use SSL certificates

2. **API Security:**
   - Use API keys or JWT tokens
   - Validate machine ID on backend

3. **CORS Configuration:**
   - Configure backend to allow frontend domain

---

## 📊 Monitoring

### Recommended Tools
- **Sentry** - Error tracking
- **Google Analytics** - Usage analytics
- **LogRocket** - Session replay

### Setup Example (Sentry)
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

---

## 🎯 Performance Optimization

### Already Implemented
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Minification
- ✅ Tree shaking

### Additional Optimizations
- Use CDN for static assets
- Enable gzip compression
- Cache static files
- Optimize video file size

---

## 🔄 Updates & Maintenance

### Deploying Updates
```bash
# Build new version
npm run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod --dir=dist
```

### Rolling Back
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## 📱 Device Testing

Test on:
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Tablet devices
- [ ] Touch screen kiosks
- [ ] Different screen sizes
- [ ] Camera functionality

---

## 🎉 Go Live Checklist

- [ ] Production build created
- [ ] Environment variables set
- [ ] Backend API connected
- [ ] SSL certificate installed
- [ ] Camera permissions working
- [ ] Print counter syncing
- [ ] Error monitoring setup
- [ ] Backup plan ready
- [ ] Support contact configured

---

## 📞 Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test API endpoints
4. Check browser console
5. Review error monitoring
