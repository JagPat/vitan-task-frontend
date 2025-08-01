# 🚀 WhatsTask Railway Deployment Setup Guide

## 📋 **Deployment Status Check**

### **Backend Deployment (vitan-task-backend)**
- ✅ **Repository**: https://github.com/JagPat/Vitan-Task-Backend
- ✅ **Railway Project**: vitan-task-backend
- ⚠️ **Status**: Needs environment variables configuration

### **Frontend Deployment (vitan-task-frontend)**
- ✅ **Repository**: https://github.com/JagPat/vitan-task-frontend
- ✅ **Railway Project**: vitan-task-frontend
- ⚠️ **Status**: Needs environment variables configuration

## 🔧 **Required Environment Variables**

### **Backend Environment Variables (Railway)**
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# WhatsApp/Meta API Configuration
META_ACCESS_TOKEN=your_meta_access_token_here
META_PHONE_NUMBER_ID=your_phone_number_id_here
META_PHONE_NUMBER=your_phone_number_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here

# Application Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Railway Configuration
RAILWAY_STATIC_URL=https://vitan-task-frontend.up.railway.app
```

### **Frontend Environment Variables (Railway)**
```bash
# API Configuration
VITE_API_BASE_URL=https://vitan-task-backend.up.railway.app

# Application Configuration
NODE_ENV=production
PORT=3000
```

## 🚀 **Deployment Steps**

### **Step 1: Backend Deployment**
1. **Connect Repository**: Link https://github.com/JagPat/Vitan-Task-Backend to Railway
2. **Set Environment Variables**: Add all backend environment variables above
3. **Deploy**: Railway will automatically deploy using nixpacks.toml
4. **Verify**: Check that the backend is running at `https://vitan-task-backend.up.railway.app`

### **Step 2: Frontend Deployment**
1. **Connect Repository**: Link https://github.com/JagPat/vitan-task-frontend to Railway
2. **Set Environment Variables**: Add all frontend environment variables above
3. **Deploy**: Railway will automatically deploy using railway.json
4. **Verify**: Check that the frontend is running at `https://vitan-task-frontend.up.railway.app`

### **Step 3: Database Setup**
1. **Create PostgreSQL Database**: Use Railway's PostgreSQL service
2. **Get Connection String**: Copy the DATABASE_URL from Railway
3. **Update Backend Variables**: Set DATABASE_URL in backend environment variables
4. **Run Migrations**: Backend will automatically run migrations on startup

### **Step 4: WhatsApp API Setup**
1. **Meta Business API**: Ensure credentials are configured
2. **Phone Number**: Verify WhatsApp Business phone number is active
3. **Webhook URL**: Set webhook URL to `https://vitan-task-backend.up.railway.app/webhook`
4. **Test Messages**: Send test messages to verify integration

## 🔍 **Verification Checklist**

### **Backend Health Check**
```bash
# Test backend health
curl https://vitan-task-backend.up.railway.app/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "metaApi": {
    "configured": true,
    "displayName": "Your Business Name"
  }
}
```

### **Frontend Health Check**
```bash
# Test frontend
curl https://vitan-task-frontend.up.railway.app

# Should return the React app
```

### **API Endpoints Test**
```bash
# Test key endpoints
curl https://vitan-task-backend.up.railway.app/api/tasks
curl https://vitan-task-backend.up.railway.app/api/users
curl https://vitan-task-backend.up.railway.app/api/analytics
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: Backend Won't Start**
**Symptoms**: Railway shows deployment failed
**Solution**: 
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check logs for migration errors

### **Issue 2: Frontend Can't Connect to Backend**
**Symptoms**: Frontend shows API errors
**Solution**:
- Verify VITE_API_BASE_URL is set correctly
- Check backend is running and accessible
- Test API endpoints directly

### **Issue 3: Database Connection Failed**
**Symptoms**: Backend logs show database errors
**Solution**:
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Ensure database exists and is accessible

### **Issue 4: WhatsApp API Not Working**
**Symptoms**: Messages not sending
**Solution**:
- Verify META_ACCESS_TOKEN is valid
- Check META_PHONE_NUMBER_ID is correct
- Test credentials with Meta API directly

## 📊 **Monitoring & Logs**

### **Railway Logs**
- **Backend Logs**: Check Railway dashboard for backend service logs
- **Frontend Logs**: Check Railway dashboard for frontend service logs
- **Database Logs**: Check PostgreSQL service logs

### **Application Logs**
- **Backend**: Logs are written to console and files
- **Frontend**: Check browser console for errors
- **API Calls**: Monitor network requests in browser dev tools

## 🎯 **Production Readiness Checklist**

### **✅ Technical Requirements**
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database connected and migrated
- [ ] WhatsApp API configured and tested
- [ ] All environment variables set
- [ ] SSL certificates working
- [ ] Health checks passing

### **✅ Functional Requirements**
- [ ] User registration via WhatsApp works
- [ ] Task creation and assignment works
- [ ] WhatsApp notifications are sent
- [ ] File uploads work
- [ ] Activity logging works
- [ ] Analytics dashboard loads
- [ ] Team management functions

### **✅ Performance Requirements**
- [ ] Page load times under 3 seconds
- [ ] API response times under 500ms
- [ ] File uploads under 10MB
- [ ] Concurrent users supported
- [ ] Error handling graceful

## 🚀 **Go-Live Steps**

1. **Final Testing**: Test complete user flow end-to-end
2. **User Training**: Train team on WhatsApp interface
3. **Monitor**: Watch logs and performance metrics
4. **Scale**: Monitor usage and scale as needed

---

## 📞 **Support**

If deployment issues persist:
1. Check Railway documentation
2. Review application logs
3. Test locally first
4. Verify all environment variables

**WhatsTask is ready for production deployment!** 🎉 