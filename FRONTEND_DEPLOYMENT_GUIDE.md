# 🚀 Frontend Deployment Guide - Railway

## 📋 Overview

This guide will help you deploy the WhatsTask frontend to Railway, creating a unified platform with both frontend and backend on the same service.

## 🎯 Current Status

- **Backend**: ✅ Deployed at `https://vitan-task-production.up.railway.app`
- **Frontend**: 🔄 Ready for Railway deployment
- **Database**: PostgreSQL (Railway managed)

## 📦 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Ensure your frontend code is in the repository
3. **Railway CLI** (Optional): `npm install -g @railway/cli`

## 🔧 Step-by-Step Deployment

### Step 1: Create Railway Project

1. **Login to Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your frontend repository: `JagPat/vitan-task-frontend`

### Step 2: Configure Environment Variables

In your Railway project dashboard, add these environment variables:

```env
# Required Environment Variables
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
NODE_ENV=production
PORT=3000
```

**How to add:**
1. Go to your Railway project
2. Click on "Variables" tab
3. Add each variable:
   - `VITE_API_BASE_URL` = `https://vitan-task-production.up.railway.app`
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (Railway will override this automatically)

### Step 3: Configure Build Settings

Railway will automatically detect your Vite project, but you can customize the build settings:

1. **Build Command**: `npm run build`
2. **Start Command**: `npx serve dist -p $PORT`
3. **Install Command**: `npm ci`

### Step 4: Deploy

1. **Automatic Deployment**
   - Railway will automatically deploy when you push to your main branch
   - Monitor the deployment in the Railway dashboard

2. **Manual Deployment** (if needed)
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Link your project
   railway link
   
   # Deploy
   railway up
   ```

## 🔍 Verification Steps

### 1. Check Deployment Status
- Go to your Railway project dashboard
- Check the "Deployments" tab
- Ensure the deployment is successful (green status)

### 2. Test the Application
- Visit your Railway frontend URL
- Test the following functionality:
  - ✅ Dashboard loads
  - ✅ API calls to backend
  - ✅ Task creation
  - ✅ User management
  - ✅ Analytics

### 3. Check Environment Variables
```bash
# In Railway dashboard, verify:
VITE_API_BASE_URL=https://vitan-task-production.up.railway.app
NODE_ENV=production
```

### 4. Test API Connectivity
Open browser console and check for:
- ✅ API calls to backend
- ❌ CORS errors
- ❌ 404 errors on API endpoints

## 🛠️ Configuration Files

### railway.json (Already configured)
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
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### nixpacks.toml (Already configured)
```toml
[phases.setup]
nixPkgs = ['nodejs_22', 'npm-9_x']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build', 'npm prune --production']

[start]
cmd = 'npm start'
```

### package.json (Already configured)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "npx serve dist -p $PORT"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Build Failures
**Symptoms**: Build fails in Railway
**Solutions**:
1. Check `package.json` for correct scripts
2. Verify all dependencies are in `dependencies` (not `devDependencies`)
3. Check for TypeScript errors

#### Issue 2: API Connection Errors
**Symptoms**: Frontend can't connect to backend
**Solutions**:
1. Verify `VITE_API_BASE_URL` is set correctly
2. Check backend is running at the specified URL
3. Test API endpoints manually

#### Issue 3: Port Issues
**Symptoms**: Application won't start
**Solutions**:
1. Ensure `PORT` environment variable is set
2. Check `npx serve dist -p $PORT` command
3. Verify Railway port configuration

#### Issue 4: Environment Variables Not Loading
**Symptoms**: App can't find environment variables
**Solutions**:
1. Restart the deployment after adding variables
2. Check variable names (must start with `VITE_` for Vite)
3. Verify no typos in variable names

### Debug Commands

```bash
# Check Railway logs
railway logs

# Check environment variables
railway variables

# Restart deployment
railway up

# Check build logs
railway logs --build
```

## 📊 Monitoring & Maintenance

### Railway Dashboard Features
1. **Deployments**: Monitor deployment status
2. **Logs**: View application logs
3. **Variables**: Manage environment variables
4. **Metrics**: Monitor performance
5. **Settings**: Configure custom domains

### Health Checks
Railway will automatically check:
- ✅ Application responds on `/`
- ✅ Port is accessible
- ✅ No critical errors in logs

### Performance Monitoring
- **Response Time**: Monitor API response times
- **Error Rate**: Track 4xx and 5xx errors
- **Resource Usage**: Monitor CPU and memory usage

## 🌐 Custom Domain (Optional)

### Setting Up Custom Domain
1. **Add Domain in Railway**
   - Go to project settings
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate**
   - Railway provides automatic SSL
   - No additional configuration needed

3. **DNS Configuration**
   ```
   Type: CNAME
   Name: your-domain.com
   Value: your-railway-app.railway.app
   ```

## 💰 Cost Considerations

### Railway Pricing
- **Free Tier**: $5 credit/month
- **Paid Plans**: Pay-as-you-use
- **Estimated Cost**: $5-10/month for frontend

### Cost Optimization
1. **Use Free Tier**: Start with free credits
2. **Monitor Usage**: Check Railway dashboard
3. **Optimize Builds**: Reduce build time
4. **Cache Dependencies**: Use npm ci

## 🔄 Continuous Deployment

### Automatic Deployments
Railway will automatically deploy when you:
- Push to main branch
- Create a new tag
- Manually trigger deployment

### Deployment Strategy
1. **Development**: Use feature branches
2. **Testing**: Test on Railway staging
3. **Production**: Deploy from main branch

## 📋 Post-Deployment Checklist

### ✅ Technical Verification
- [ ] Application loads without errors
- [ ] API calls work correctly
- [ ] Environment variables are loaded
- [ ] Build process completes successfully
- [ ] Health checks pass

### ✅ Functional Testing
- [ ] Dashboard displays correctly
- [ ] Task creation works
- [ ] User management functions
- [ ] Analytics load properly
- [ ] WhatsApp integration works

### ✅ Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 200ms
- [ ] No memory leaks
- [ ] Responsive design works

### ✅ Security Verification
- [ ] HTTPS is enabled
- [ ] No sensitive data in logs
- [ ] Environment variables are secure
- [ ] CORS is configured correctly

## 🎯 Next Steps After Deployment

### 1. Update Documentation
- Update README with new URLs
- Document deployment process
- Create troubleshooting guide

### 2. Set Up Monitoring
- Configure error tracking
- Set up performance monitoring
- Create alerting rules

### 3. Team Access
- Add team members to Railway project
- Set up role-based access
- Configure deployment permissions

### 4. Production Testing
- Test all user flows
- Verify WhatsApp integration
- Check mobile responsiveness

## 📞 Support Resources

### Railway Documentation
- [Railway Docs](https://docs.railway.app/)
- [Deployment Guide](https://docs.railway.app/deploy/deployments)
- [Environment Variables](https://docs.railway.app/deploy/environment-variables)

### Project Resources
- **Backend API**: `https://vitan-task-production.up.railway.app`
- **GitHub Repository**: `https://github.com/JagPat/vitan-task-frontend`
- **Railway Dashboard**: [railway.app](https://railway.app)

### Troubleshooting
- **Railway Support**: Available in dashboard
- **Community**: Railway Discord
- **Documentation**: This guide and README files

---

## 🎉 Success Criteria

Your deployment is successful when:

1. **✅ Application Deploys**: No build errors
2. **✅ Environment Variables**: All variables loaded
3. **✅ API Connectivity**: Backend communication works
4. **✅ User Interface**: All pages load correctly
5. **✅ Functionality**: All features work as expected
6. **✅ Performance**: Fast loading times
7. **✅ Security**: HTTPS and secure configuration

## 📝 Notes

- **Railway automatically handles SSL certificates**
- **Environment variables are encrypted**
- **Builds are cached for faster deployments**
- **Automatic rollback on failed deployments**
- **Real-time logs available in dashboard**

---

*Last Updated: December 2024*
*Version: 1.0*
*Status: Ready for Deployment* 