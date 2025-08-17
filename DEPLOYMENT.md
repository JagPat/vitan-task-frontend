# WhatsTask Frontend Deployment Guide

## 🚀 **Railway Auto-Deployment**

The frontend is configured for automatic deployment from GitHub to Railway. Railway will automatically:

1. **Detect changes** pushed to the `main` branch
2. **Build the application** using the configured build commands
3. **Deploy to production** at `https://vitan-task-frontend.up.railway.app/`

## 📋 **Deployment Configuration**

### **Railway Configuration Files**

- **`railway.json`**: Main Railway configuration
- **`nixpacks.toml`**: Build and runtime configuration
- **`package.json`**: Scripts and dependencies

### **Environment Variables**

Railway will automatically set these environment variables:

```env
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
VITE_APP_NAME=WhatsTask
VITE_ENV_NAME=production
PORT=3000
```

## 🔧 **Build Process**

### **Local Build Test**

Before pushing to GitHub, test the build locally:

```bash
# Install dependencies
npm ci

# Type check
npm run type-check

# Build application
npm run build

# Test build locally
npm run preview
```

### **Build Commands**

- **`npm run build`**: TypeScript compilation + Vite build
- **`npm run start`**: Serve built application (Railway production)
- **`npm run preview`**: Preview built application locally

## 🧪 **Pre-Deployment Testing**

### **Smoke Tests**

Run backend endpoint verification:

```bash
node scripts/fe-smoke.mjs
```

**Expected Output:**
```
✅ SUCCESS - Status: 200
✅ SUCCESS - Status: 200
✅ SUCCESS - Status: 200
✅ SUCCESS - Status: 200
```

### **Type Checking**

Ensure TypeScript compilation passes:

```bash
npm run type-check
```

## 📱 **Post-Deployment Verification**

### **Automatic Verification**

After Railway deployment completes, run:

```bash
node scripts/post-deploy-verify.mjs
```

**Tests:**
- Frontend homepage accessibility
- Login page loading
- Backend API endpoints
- Module health status

### **Manual Verification**

1. **Frontend Access**
   - Visit: `https://vitan-task-frontend.up.railway.app/`
   - Should redirect to `/login` if not authenticated

2. **Authentication Flow**
   - Navigate to `/login`
   - Form should load without errors

3. **Protected Routes**
   - After login, should redirect to `/tasks`
   - Navigation should work between Tasks, WhatsApp, System

## 🌐 **Production URLs**

- **Frontend**: `https://vitan-task-frontend.up.railway.app/`
- **Backend**: `https://vitan-task-production.up.railway.app/`
- **API Base**: `https://vitan-task-production.up.railway.app/api`

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies: `npm ci`
   - Check Vite configuration

2. **Runtime Errors**
   - Check browser console for JavaScript errors
   - Verify environment variables are set
   - Check backend API connectivity

3. **Deployment Issues**
   - Check Railway logs in dashboard
   - Verify GitHub repository permissions
   - Check build command configuration

### **Debug Commands**

```bash
# Check build output
npm run build

# Test production build locally
npm run preview

# Verify backend connectivity
node scripts/fe-smoke.mjs

# Check deployment status
node scripts/post-deploy-verify.mjs
```

## 📊 **Monitoring**

### **Health Checks**

- **Frontend**: `https://vitan-task-frontend.up.railway.app/`
- **Backend**: `https://vitan-task-production.up.railway.app/health`
- **Modules**: `https://vitan-task-production.up.railway.app/api/modules`

### **Performance Metrics**

- **Lighthouse Score**: Target ≥90 Performance/Accessibility
- **Bundle Size**: Target <300KB gzipped
- **Load Time**: Target <3 seconds

## 🚀 **Next Steps**

After successful deployment:

1. **Test all user flows** (login, tasks, WhatsApp, system)
2. **Verify mobile responsiveness**
3. **Check accessibility compliance**
4. **Monitor error rates and performance**
5. **Plan Phase-2 features** (advanced task management, real-time updates)

## 📞 **Support**

For deployment issues:

1. Check Railway dashboard logs
2. Verify GitHub Actions CI status
3. Run verification scripts locally
4. Check backend API status
5. Review browser console errors
