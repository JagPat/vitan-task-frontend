# Environment Variables Setup for Railway Deployment

## 🚨 **Critical Environment Variables Required**

### **1. Backend API URL**
```
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
```
**Purpose**: Tells the frontend where to find the backend API
**Required**: ✅ Yes - Without this, API calls will fail

### **2. Node Environment**
```
NODE_ENV=production
```
**Purpose**: Ensures production optimizations
**Required**: ✅ Yes - For proper build and runtime behavior

### **3. Port Configuration**
```
PORT=3000
```
**Purpose**: Railway automatically sets this, but we use `` in our config
**Required**: ✅ Yes - Railway manages this automatically

## 🔧 **How to Set Environment Variables in Railway**

### **Option 1: Railway Dashboard**
1. Go to your Railway project dashboard
2. Click on your service (frontend)
3. Go to **Variables** tab
4. Add each variable:
   - `VITE_API_BASE_URL` = `https://vitan-task-production.up.railway.app`
   - `NODE_ENV` = `production`

### **Option 2: Railway CLI**
```bash
railway variables set VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
railway variables set NODE_ENV=production
```

### **Option 3: .env file (for local development)**
Create `.env.local` in your project root:
```env
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
NODE_ENV=production
```

## 🔍 **Verification Steps**

### **1. Check Environment Variables**
```bash
# In Railway dashboard, verify these are set:
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
NODE_ENV=production
```

### **2. Test API Connection**
After deployment, check browser console for:
- ✅ API calls to backend
- ❌ CORS errors
- ❌ 404 errors on API endpoints

### **3. Verify Port Usage**
Railway logs should show:
```
INFO  Accepting connections at http://localhost:$PORT
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: API Calls Failing**
**Cause**: Missing `VITE_API_BASE_URL`
**Solution**: Set the environment variable in Railway dashboard

### **Issue 2: Port Already in Use**
**Cause**: Hardcoded port instead of ``
**Solution**: ✅ Fixed - Now using `` environment variable

### **Issue 3: Build Failures**
**Cause**: Missing `NODE_ENV=production`
**Solution**: Set environment variable in Railway

## 📋 **Complete Railway Configuration**

### **railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx serve dist -p $PORT",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "healthcheckInterval": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "numReplicas": 1
  }
}
```

### **Required Environment Variables**
```env
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
NODE_ENV=production
```

## 🎯 **Next Steps**

1. **Set Environment Variables** in Railway dashboard
2. **Redeploy** the application
3. **Test** the live application
4. **Verify** API connectivity

## 📞 **Troubleshooting**

If you encounter issues:
1. Check Railway logs for errors
2. Verify environment variables are set
3. Test API connectivity manually
4. Check browser console for frontend errors
