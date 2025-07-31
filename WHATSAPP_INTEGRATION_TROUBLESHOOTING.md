# 🔧 WhatsApp Integration Troubleshooting Guide

## 🚨 **Current Issue: "Unknown command" Error**

You're getting the error: `❓ Unknown command. Type /help to see all available commands.`

This indicates that the WhatsApp webhook is receiving messages but not processing them correctly.

---

## 🔍 **Root Cause Analysis**

### ✅ **Backend Status: WORKING**
- ✅ Backend is running at `https://vitan-task-production.up.railway.app`
- ✅ Health check passes
- ✅ Test endpoint works: `menu` command processed successfully
- ✅ Command handlers are properly defined

### ❌ **WhatsApp Webhook: NEEDS CONFIGURATION**
The issue is likely with the Meta WhatsApp Business API configuration.

---

## 🛠️ **Solution Steps**

### **Step 1: Check Environment Variables**

Verify these environment variables are set in your Railway backend:

```env
# Required for WhatsApp integration
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
META_ACCESS_TOKEN=your_meta_access_token_here
META_PHONE_NUMBER_ID=your_phone_number_id_here
META_PHONE_NUMBER=your_phone_number_here
```

**How to check:**
1. Go to Railway dashboard
2. Select your backend project
3. Go to "Variables" tab
4. Verify all WhatsApp variables are set

### **Step 2: Configure Meta WhatsApp Business API**

1. **Go to Meta Developer Console**
   - Visit: https://developers.facebook.com/
   - Navigate to your WhatsApp Business app

2. **Set Webhook URL**
   - URL: `https://vitan-task-production.up.railway.app/webhook`
   - Verify Token: Use the same value as `WHATSAPP_VERIFY_TOKEN`

3. **Subscribe to Events**
   - `messages`
   - `message_deliveries`
   - `message_reads`

### **Step 3: Test Webhook Configuration**

**Test the webhook verification:**
```bash
curl "https://vitan-task-production.up.railway.app/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

**Expected response:** `test`

### **Step 4: Test Message Processing**

**Test with a real phone number:**
```bash
curl -X POST https://vitan-task-production.up.railway.app/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "menu", "phoneNumber": "YOUR_PHONE_NUMBER"}'
```

---

## 📋 **Available Commands**

Once configured, these commands will work:

### **Quick Start Commands:**
- `menu` - Interactive menu with buttons
- `start` - Same as menu
- `/help` - Show all available commands

### **Task Management:**
- `/create [title] [description] [due_date] [priority]` - Create new task
- `/tasks [status]` - List your tasks
- `/status [task_id] [new_status]` - Update task status
- `/complete [task_id]` - Mark task as completed
- `/comment [task_id] [comment]` - Add comment to task

### **Project Management:**
- `/project list` - List all projects
- `/project create [name] [category]` - Create new project
- `/project tasks [project_id]` - List tasks in project
- `/project add-task [project_id] [title]` - Add task to project

### **User Management:**
- `/register [name] [email] [role]` - Register new user
- `/profile` - View your profile
- `/team` - View team members

---

## 🔧 **Troubleshooting Commands**

### **Check Backend Status:**
```bash
curl https://vitan-task-production.up.railway.app/health
```

### **Test Webhook Processing:**
```bash
curl -X POST https://vitan-task-production.up.railway.app/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "menu", "phoneNumber": "1234567890"}'
```

### **Check Railway Logs:**
1. Go to Railway dashboard
2. Select backend project
3. Go to "Deployments" tab
4. Click on latest deployment
5. Check logs for webhook errors

---

## 🎯 **Expected Behavior**

### **When Working Correctly:**
1. Send `menu` to WhatsApp → Receive interactive buttons
2. Send `/help` → Receive command list
3. Send `/tasks` → Receive your task list
4. Send `/create Task Title` → Task created successfully

### **Current Issue:**
- Send any command → Receive "Unknown command" error
- This means webhook is receiving messages but not processing them

---

## 📞 **Support Resources**

### **Meta WhatsApp Business API:**
- [Meta Developer Docs](https://developers.facebook.com/docs/whatsapp)
- [Webhook Setup Guide](https://developers.facebook.com/docs/whatsapp/webhook)

### **Railway Configuration:**
- [Railway Environment Variables](https://docs.railway.app/deploy/environment-variables)
- [Railway Logs](https://docs.railway.app/deploy/logs)

### **Project Documentation:**
- Backend API: `https://vitan-task-production.up.railway.app`
- Frontend: `https://vitan-task-frontend.up.railway.app`
- GitHub: `https://github.com/JagPat/Vitan-Task-Backend`

---

## 🚀 **Quick Fix Steps**

1. **Check Railway Environment Variables** (5 minutes)
2. **Configure Meta Webhook URL** (10 minutes)
3. **Test with real phone number** (5 minutes)
4. **Verify all commands work** (10 minutes)

**Total Time:** ~30 minutes

---

*Status: Backend working, WhatsApp configuration needed*
*Last Updated: December 2024* 