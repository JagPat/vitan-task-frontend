# Vitan Task Management App - Project Context & Deployment Workflow

## 🏗️ **Project Structure**

### **Repository Information**
- **Frontend GitHub Repo**: https://github.com/JagPat/vitan-task-frontend
- **Backend GitHub Repo**: https://github.com/JagPat/Vitan-Task-Backend
- **Frontend Deployment**: https://vitan-task-frontend.up.railway.app
- **Backend Deployment**: https://vitan-task-production.up.railway.app

### **Technology Stack**
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + PostgreSQL
- **Deployment**: Railway (Auto-deploy from GitHub)
- **WhatsApp Integration**: Meta Business API (configured)

---

## 🛠️ **Development Workflow**

### **Local Development Process**
1. **All development is done locally** with code cloned from GitHub repositories
2. **Test locally first** before pushing to GitHub
3. **Railway auto-deploys** the latest pushed code for both frontend and backend
4. **After each deployment**, thorough testing is required

### **Deployment & Testing Protocol**

#### **Step 1: Local Development**
```bash
# Frontend (Port 5173)
cd vitan-task-frontend
npm run dev
# Test at http://localhost:5173

# Backend (Port 3000)
cd vitan-task-backend
npm run dev
# Test at http://localhost:3000
```

#### **Step 2: Push to GitHub**
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

#### **Step 3: Railway Auto-Deploy**
- Railway automatically builds and deploys from GitHub
- Monitor deployment status in Railway dashboard
- Wait for deployment to complete before testing

#### **Step 4: Post-Deployment Testing**
1. **Test Frontend**: https://vitan-task-frontend.up.railway.app
2. **Test Backend**: https://vitan-task-production.up.railway.app
3. **Test Integration**: Frontend → Backend communication
4. **Test WhatsApp**: Message sending and webhook processing

---

## 📋 **Deployment/Test Log Template**

### **Version: [Date] - [Description]**

#### **✅ What's Working**
- [ ] Authentication (Login/Logout)
- [ ] Task Management (Create/Edit/Delete)
- [ ] Project Management (Create/Edit/Delete)
- [ ] Team Management (Invite/Edit/Delete)
- [ ] WhatsApp Integration (Message sending)
- [ ] Analytics Dashboard
- [ ] API Endpoints (All responding correctly)

#### **❌ What's Not Working**
- [ ] [Specific issue with details]
- [ ] [API endpoint failing]
- [ ] [UI component broken]

#### **🔄 Regressions (Previously Working, Now Broken)**
- [ ] [Feature that worked before but doesn't now]
- [ ] [Performance degradation]

#### **📝 Changes Made in This Version**
- [ ] [List of changes made]
- [ ] [New features added]
- [ ] [Bug fixes implemented]

#### **🎯 Next Steps**
- [ ] [Priority fixes needed]
- [ ] [Features to implement next]
- [ ] [Testing requirements]

---

## 🧪 **Testing Strategy**

### **Local Testing (Before Push)**
1. **Frontend Build Test**
   ```bash
   npm run build
   npm run lint
   ```

2. **Backend API Test**
   ```bash
   curl https://vitan-task-production.up.railway.app/health
   ```

3. **Integration Test**
   - Test frontend → backend communication
   - Test all CRUD operations
   - Test error handling

### **Production Testing (After Deploy)**
1. **Core Functionality**
   - [ ] User authentication
   - [ ] Task creation and management
   - [ ] Project creation and management
   - [ ] Team member management
   - [ ] WhatsApp message sending

2. **API Endpoints**
   - [ ] `/health` - Health check
   - [ ] `/api/tasks` - Task management
   - [ ] `/api/projects` - Project management
   - [ ] `/api/users` - User management
   - [ ] `/webhook` - WhatsApp webhook

3. **Performance**
   - [ ] Page load times < 3 seconds
   - [ ] API response times < 2 seconds
   - [ ] No console errors
   - [ ] No network errors (4xx/5xx)

---

## 🔧 **Troubleshooting Guide**

### **Common Issues**

#### **Frontend Issues**
- **Build Errors**: Check for syntax errors, missing imports
- **Runtime Errors**: Check browser console for JavaScript errors
- **API Errors**: Check Network tab for failed requests

#### **Backend Issues**
- **Database Connection**: Check PostgreSQL connection
- **API Endpoints**: Test each endpoint individually
- **WhatsApp Integration**: Verify API keys and webhook configuration

#### **Deployment Issues**
- **Railway Build Failures**: Check build logs for errors
- **Environment Variables**: Ensure all required env vars are set
- **Port Configuration**: Verify Railway port settings

### **Debugging Commands**
```bash
# Test backend health
curl https://vitan-task-production.up.railway.app/health

# Test frontend deployment
curl https://vitan-task-frontend.up.railway.app

# Check Railway logs
railway logs
```

---

## 📊 **Current Status**

### **Backend Status** ✅
- **URL**: https://vitan-task-production.up.railway.app
- **Health**: ✅ Responding correctly
- **Endpoints**: ✅ All core endpoints working
- **Database**: ✅ PostgreSQL connected
- **WhatsApp**: ✅ Integration configured

### **Frontend Status** ⚠️
- **URL**: https://vitan-task-frontend.up.railway.app
- **Build**: ⚠️ Syntax errors need fixing
- **Deployment**: ⚠️ Needs clean build
- **Integration**: ⚠️ Pending backend connection test

---

## 🎯 **Project Goals**

### **Primary Objectives**
1. **Minimal, Production-Ready Internal Tool**
2. **Frictionless Task Flows**
3. **No Placeholder or Dummy Data**
4. **WhatsApp Integration for Notifications**

### **Success Criteria**
- [ ] All buttons and functions work correctly
- [ ] Proper backend representation for all frontend actions
- [ ] WhatsApp notifications delivered successfully
- [ ] No console errors or network failures
- [ ] Fast, responsive user experience

---

## 📝 **Important Notes**

### **Assumptions**
- ✅ WhatsApp API keys and setup details are already configured
- ✅ Database schema is properly set up
- ✅ Railway deployment is configured for auto-deploy

### **Development Rules**
1. **Always test locally before pushing**
2. **Maintain deployment/test log for every version**
3. **Refer to previous logs to avoid regressions**
4. **No dummy/placeholder data in production**
5. **All features must have proper backend integration**

### **Quality Standards**
- **Code Quality**: Clean, maintainable code
- **Error Handling**: Graceful error states
- **Performance**: Fast load times and responses
- **User Experience**: Intuitive, responsive interface
- **Integration**: Seamless frontend-backend communication

---

*This document serves as the single source of truth for the Vitan Task Management App development and deployment process.* 