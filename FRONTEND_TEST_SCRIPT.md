# 🧪 Frontend Test Script
## Step-by-Step Testing Guide for WhatsTask Application

### 🚀 **Quick Start Testing**

#### **Step 1: Environment Setup**
```bash
# 1. Start the frontend application
npm run dev

# 2. Verify backend is running
curl https://vitan-task-production.up.railway.app/health

# 3. Open browser developer tools (F12)
# 4. Go to Network tab to monitor API calls
```

---

## 🔐 **Authentication Testing**

### **Test 1: Login Flow**
1. **Navigate to**: locahost: 
2. **Expected**: Login dialog appears
3. **Actions**:
   - Enter phone number: `919428120418`
   - Click "Send OTP" button
   - Check browser console for API call to `/api/auth/login`
   - Enter OTP: `123456` (test OTP)
   - Click "Verify OTP" button
   - Check browser console for API call to `/api/auth/verify-otp`
4. **Expected Result**: User logged in, redirected to dashboard

### **Test 2: Session Persistence**
1. **Actions**:
   - Refresh the page
   - Check if user remains logged in
   - Check localStorage for auth token
2. **Expected Result**: User session maintained

### **Test 3: Logout**
1. **Actions**:
   - Click user menu (top right)
   - Click "Logout" button
2. **Expected Result**: User logged out, redirected to login

---

## 📊 **Dashboard Testing**

### **Test 4: Dashboard Loading**
1. **Navigate to**: Dashboard after login
2. **Actions**:
   - Check if stats cards load
   - Check if recent activity loads
   - Check if quick actions are visible
3. **Expected Result**: All dashboard elements load without errors

### **Test 5: Quick Actions**
1. **Test "Create Task" button**:
   - Click "Create Task" button
   - Expected: Navigate to task creation page
2. **Test "Create Project" button**:
   - Click "Create Project" button
   - Expected: Open project creation dialog
3. **Test "Invite Team Member" button**:
   - Click "Invite Team Member" button
   - Expected: Open team invitation dialog

---

## 📋 **Task Management Testing**

### **Test 6: Create Task**
1. **Navigate to**: Create Task page
2. **Actions**:
   - Fill in task title: "Test Task"
   - Fill in description: "Test task description"
   - Select priority: "High"
   - Select assignee: Choose a team member
   - Set due date: Tomorrow's date
   - Click "Create Task" button
3. **Expected Result**: Task created, success message, WhatsApp notification sent

### **Test 7: Task List View**
1. **Navigate to**: My Tasks page
2. **Actions**:
   - Check if tasks load
   - Test "Start Task" button on a pending task
   - Test "Complete Task" button on an in-progress task
   - Test "Edit Task" button
   - Test "Delete Task" button
3. **Expected Result**: All task actions work correctly

### **Test 8: Task Details**
1. **Actions**:
   - Click on a task to view details
   - Test "Edit Task" button
   - Test "Reassign Task" button
   - Test "Change Status" dropdown
2. **Expected Result**: All task detail actions work

### **Test 9: Task Filters**
1. **Actions**:
   - Test status filter (Pending, In Progress, Completed)
   - Test priority filter
   - Test date sorting
2. **Expected Result**: Filters apply correctly

---

## 🏗️ **Project Management Testing**

### **Test 10: Create Project**
1. **Navigate to**: Projects page
2. **Actions**:
   - Click "Create Project" button
   - Fill in project name: "Test Project"
   - Fill in description: "Test project description"
   - Set start date: Today
   - Set due date: Next week
   - Click "Create Project" button
3. **Expected Result**: Project created successfully

### **Test 11: Project List**
1. **Actions**:
   - Check if projects load
   - Test "Edit Project" button
   - Test "Delete Project" button
   - Test "View Details" button
2. **Expected Result**: All project actions work

### **Test 12: Project Details**
1. **Actions**:
   - Click on a project to view details
   - Test "Add Member" button
   - Test "Create Task" button within project
   - Test project statistics
2. **Expected Result**: Project details load correctly

---

## 👥 **Team Management Testing**

### **Test 13: Team Page**
1. **Navigate to**: Team page
2. **Actions**:
   - Check if team members load
   - Test "Invite User" button
   - Test "Edit User" button on a member
   - Test "Delete User" button
3. **Expected Result**: All team actions work

### **Test 14: User Invitation**
1. **Actions**:
   - Click "Invite User" button
   - Enter phone number: `919876543210`
   - Enter name: "Test User"
   - Select role: "Member"
   - Click "Send Invitation" button
2. **Expected Result**: Invitation sent successfully

---

## 📊 **Analytics Testing**

### **Test 15: Analytics Page**
1. **Navigate to**: Analytics page
2. **Actions**:
   - Check if charts load
   - Test date range picker
   - Test different time periods (7d, 30d, 90d)
   - Test chart interactions
3. **Expected Result**: Analytics data displays correctly

---

## 📱 **WhatsApp Integration Testing**

### **Test 16: WhatsApp Test Page**
1. **Navigate to**: WhatsApp Test page
2. **Actions**:
   - Enter phone number: `919428120418`
   - Enter message: "Test message from WhatsTask"
   - Click "Send Test Message" button
3. **Expected Result**: Message sent successfully

### **Test 17: WhatsApp Admin**
1. **Navigate to**: WhatsApp Admin page
2. **Actions**:
   - Test contact registration
   - Test contact verification
   - Test message broadcasting
3. **Expected Result**: WhatsApp admin functions work

---

## 🎨 **Template Management Testing**

### **Test 18: Templates Page**
1. **Navigate to**: Templates page
2. **Actions**:
   - Check if templates load
   - Test "Create Template" button
   - Test "Edit Template" button
   - Test "Delete Template" button
   - Test "Use Template" button
3. **Expected Result**: All template actions work

---

## 🤖 **AI Admin Dashboard Testing**

### **Test 19: AI Admin Dashboard**
1. **Navigate to**: AI Admin Dashboard
2. **Actions**:
   - Check AI settings display
   - Test AI performance metrics
   - Test AI configuration updates
3. **Expected Result**: AI dashboard functions work

---

## 🔧 **API Testing Component**

### **Test 20: API Test Page**
1. **Navigate to**: API Test page
2. **Actions**:
   - Test all API endpoints
   - Check response validation
   - Test error handling
3. **Expected Result**: All API tests pass

---

## 📞 **Contact Management Testing**

### **Test 21: Contact Manager**
1. **Navigate to**: Contact Manager component
2. **Actions**:
   - Test contact registration
   - Test contact verification
   - Test contact sharing
   - Test phone number validation
3. **Expected Result**: Contact management functions work

---

## 🧪 **Error Handling Testing**

### **Test 22: Network Errors**
1. **Actions**:
   - Disconnect internet temporarily
   - Try to perform actions (create task, load data)
   - Check error messages
2. **Expected Result**: Graceful error handling

### **Test 23: Invalid Data**
1. **Actions**:
   - Try to submit forms with invalid data
   - Test with empty required fields
   - Test with invalid phone numbers
2. **Expected Result**: Proper validation messages

### **Test 24: Server Errors**
1. **Actions**:
   - Monitor browser console for API errors
   - Check if error states display correctly
   - Test retry mechanisms
2. **Expected Result**: Error states handled gracefully

---

## 📊 **Performance Testing**

### **Test 25: Page Load Times**
1. **Actions**:
   - Measure page load times
   - Check API response times
   - Test with large datasets
2. **Expected Result**: Load times under 3 seconds

### **Test 26: Memory Usage**
1. **Actions**:
   - Monitor memory usage in browser
   - Navigate between pages multiple times
   - Check for memory leaks
2. **Expected Result**: Stable memory usage

---

## 🔍 **Browser Console Monitoring**

### **During Testing, Monitor:**
```javascript
// Check for JavaScript errors
console.error()

// Check for API call failures
// Look for 4xx and 5xx responses in Network tab

// Check for React warnings
// Look for warnings in console

// Monitor localStorage
console.log(localStorage.getItem('authToken'))
console.log(sessionStorage.getItem('currentUser'))
```

---

## 📝 **Test Results Template**

### **Copy this template for each test:**

```
Test #: [Number]
Test Name: [Name]
Date: [Date]
Tester: [Your Name]

✅ PASSED / ❌ FAILED

Actions Taken:
- [List actions]

Expected Results:
- [List expected results]

Actual Results:
- [List actual results]

Backend API Calls:
- [List API calls made]

Errors Found:
- [List any errors]

Screenshots:
- [Add screenshots if needed]

Notes:
- [Additional notes]
```

---

## 🚨 **Critical Test Scenarios**

### **Must Test These Critical Paths:**

1. **User Registration & Login**
   - Phone number validation
   - OTP verification
   - Session management

2. **Task Creation & Assignment**
   - Task creation with all fields
   - WhatsApp notification delivery
   - Task status updates

3. **WhatsApp Integration**
   - Message sending
   - Contact registration
   - Webhook processing

4. **Data Persistence**
   - Form data retention
   - User preferences
   - Session data

5. **Error Recovery**
   - Network disconnection
   - Invalid data handling
   - Server error responses

---

## 🎯 **Success Criteria Checklist**

### **Before marking tests as complete:**

- [ ] All buttons respond to clicks
- [ ] All forms validate input
- [ ] All API calls return expected responses
- [ ] All error states display correctly
- [ ] All loading states show feedback
- [ ] Navigation works between all pages
- [ ] Data persists correctly
- [ ] WhatsApp integration functions
- [ ] No console errors
- [ ] No network errors (4xx/5xx)
- [ ] Performance is acceptable (< 3s load times)

---

## 📞 **Support & Troubleshooting**

### **If Tests Fail:**

1. **Check Backend Status**:
   ```bash
   curl https://vitan-task-production.up.railway.app/health
   ```

2. **Check Browser Console**:
   - Open F12 → Console tab
   - Look for JavaScript errors
   - Look for API call failures

3. **Check Network Tab**:
   - Open F12 → Network tab
   - Look for failed API calls
   - Check response status codes

4. **Common Issues**:
   - CORS errors: Backend not configured properly
   - 401 errors: Authentication issues
   - 500 errors: Server-side issues
   - Network errors: Connectivity issues

---

*Run this test script systematically to ensure all frontend functionality works correctly with proper backend integration.* 