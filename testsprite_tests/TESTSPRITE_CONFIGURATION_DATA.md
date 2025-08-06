# TestSprite MCP Configuration Data

## 🎯 **Complete Testing Setup for Full-Stack Application**

### **Frontend Testing Configuration**

#### **1. Frontend Project Data**
```json
{
  "projectName": "vitan-task-frontend",
  "projectType": "frontend",
  "technologyStack": ["React", "Vite", "Tailwind CSS", "Radix UI", "React Router"],
  "localURL": "http://localhost:3004",
  "backendURL": "https://vitan-task-production.up.railway.app",
  "testScope": "codebase",
  "needLogin": false,
  "mockAPI": true
}
```

#### **2. Frontend Test Configuration**
```json
{
  "localPort": 3004,
  "type": "frontend",
  "testScope": "codebase",
  "needLogin": false,
  "additionalInstruction": "Focus on UI/UX testing without backend dependencies. Use mock API for any API calls. Test form validation, component rendering, navigation, and user interface behavior. Ignore backend-related failures and focus on frontend functionality only."
}
```

#### **3. Frontend Features to Test**
```json
{
  "features": [
    {
      "name": "Form Validation System",
      "description": "Client-side form validation with multi-language support",
      "testRequirements": [
        "Test required field validation",
        "Test multi-language input handling",
        "Test phone number format validation",
        "Test real-time validation feedback"
      ]
    },
    {
      "name": "React Component Library",
      "description": "Comprehensive UI component library with accessibility",
      "testRequirements": [
        "Test component rendering without warnings",
        "Test responsive design",
        "Test accessibility features",
        "Test error state handling"
      ]
    },
    {
      "name": "Navigation & Routing",
      "description": "React Router implementation with proper navigation",
      "testRequirements": [
        "Test page navigation",
        "Test URL parameter handling",
        "Test browser history",
        "Test deep linking"
      ]
    },
    {
      "name": "UI/UX Components",
      "description": "Interactive UI components including modals and dialogs",
      "testRequirements": [
        "Test modal and dialog functionality",
        "Test loading states",
        "Test error message display",
        "Test toast notifications"
      ]
    }
  ]
}
```

### **Backend Testing Configuration**

#### **1. Backend Project Data**
```json
{
  "projectName": "vitan-task-backend",
  "projectType": "backend",
  "technologyStack": ["Node.js", "Express", "MongoDB", "WhatsApp API"],
  "deploymentURL": "https://vitan-task-production.up.railway.app",
  "port": 8080,
  "testScope": "codebase",
  "needLogin": true,
  "authentication": "JWT"
}
```

#### **2. Backend Test Configuration**
```json
{
  "deploymentURL": "https://vitan-task-production.up.railway.app",
  "port": 8080,
  "type": "backend",
  "testScope": "codebase",
  "needLogin": true,
  "additionalInstruction": "Focus on API endpoint testing, database operations, and external service integration. Test all CRUD operations, authentication, and error handling."
}
```

#### **3. Backend Features to Test**
```json
{
  "features": [
    {
      "name": "Task Management API",
      "description": "Complete CRUD operations for task management",
      "endpoints": [
        "GET /api/tasks",
        "POST /api/tasks",
        "PUT /api/tasks/:id",
        "DELETE /api/tasks/:id"
      ],
      "testRequirements": [
        "Test task creation with validation",
        "Test task retrieval with filtering",
        "Test task updates and deletions",
        "Test error handling for invalid requests"
      ]
    },
    {
      "name": "User Management API",
      "description": "User authentication and profile management",
      "endpoints": [
        "POST /api/users",
        "POST /api/auth/login",
        "GET /api/users/profile",
        "PUT /api/users/:id"
      ],
      "testRequirements": [
        "Test user registration",
        "Test login authentication",
        "Test JWT token validation",
        "Test password reset functionality"
      ]
    },
    {
      "name": "WhatsApp Integration API",
      "description": "WhatsApp messaging and notification system",
      "endpoints": [
        "POST /api/whatsapp/send",
        "POST /webhook/whatsapp",
        "GET /api/whatsapp/status"
      ],
      "testRequirements": [
        "Test message sending functionality",
        "Test webhook handling",
        "Test message status tracking",
        "Test error handling for failed messages"
      ]
    }
  ]
}
```

### **Authentication Data for Testing**

#### **1. Login Credentials**
```json
{
  "adminUser": {
    "email": "admin@vitan.com",
    "password": "AdminPass123!",
    "role": "admin"
  },
  "testUser": {
    "email": "test@vitan.com",
    "password": "TestPass123!",
    "role": "user"
  },
  "demoUser": {
    "email": "demo@vitan.com",
    "password": "DemoPass123!",
    "role": "user"
  }
}
```

#### **2. API Authentication**
```json
{
  "authentication": {
    "type": "JWT",
    "tokenExpiry": "24 hours",
    "refreshToken": true,
    "rateLimiting": "100 requests per minute",
    "headers": {
      "Authorization": "Bearer <token>",
      "Content-Type": "application/json"
    }
  }
}
```

### **Test Data for Both Frontend and Backend**

#### **1. Test User Data**
```json
{
  "testUser": {
    "full_name": "Test User",
    "email": "test@example.com",
    "phone_number": "+1234567890",
    "role": "user",
    "password": "TestPassword123!"
  }
}
```

#### **2. Test Task Data**
```json
{
  "testTask": {
    "title": "Test Task",
    "description": "Test Description",
    "assigned_to": "test-user-id",
    "due_date": "2025-08-15",
    "priority": "high",
    "status": "pending",
    "tags": ["test", "api"],
    "estimated_hours": 8
  }
}
```

#### **3. Test Contact Data**
```json
{
  "testContact": {
    "name": "Test Contact",
    "phone_number": "+1234567890",
    "email": "contact@example.com",
    "company": "Test Company",
    "role": "Manager"
  }
}
```

#### **4. Test Project Data**
```json
{
  "testProject": {
    "name": "Test Project",
    "description": "Test Project Description",
    "status": "active",
    "start_date": "2025-08-01",
    "end_date": "2025-12-31",
    "budget": 10000,
    "team_members": ["user1", "user2"]
  }
}
```

### **Environment Configuration**

#### **1. Frontend Environment Variables**
```bash
REACT_APP_API_MODE=mock
REACT_APP_BACKEND_URL=https://vitan-task-production.up.railway.app
REACT_APP_VERSION=1.0.0
```

#### **2. Backend Environment Variables**
```bash
NODE_ENV=production
DATABASE_URL=mongodb://localhost:27017/vitan-task
WHATSAPP_API_KEY=your_whatsapp_api_key
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_KEY=your_email_service_key
```

### **Test Execution Commands**

#### **1. Frontend Testing Commands**
```bash
# Start frontend development server
npm run dev

# Run frontend tests with TestSprite
mcp_TestSprite_testsprite_bootstrap_tests({
  localPort: 3004,
  type: "frontend",
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-frontend",
  testScope: "codebase"
});

# Generate frontend test plan
mcp_TestSprite_testsprite_generate_frontend_test_plan({
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-frontend",
  needLogin: false
});

# Execute frontend tests
mcp_TestSprite_testsprite_generate_code_and_execute({
  projectName: "vitan-task-frontend",
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-frontend",
  testIds: [],
  additionalInstruction: "Focus on UI/UX testing without backend dependencies"
});
```

#### **2. Backend Testing Commands**
```bash
# Test backend API endpoints
mcp_TestSprite_testsprite_bootstrap_tests({
  deploymentURL: "https://vitan-task-production.up.railway.app",
  type: "backend",
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-backend",
  testScope: "codebase"
});

# Generate backend test plan
mcp_TestSprite_testsprite_generate_backend_test_plan({
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-backend"
});

# Execute backend tests
mcp_TestSprite_testsprite_generate_code_and_execute({
  projectName: "vitan-task-backend",
  projectPath: "/Users/jagrutpatel/Vitan Task/vitan-task-backend",
  testIds: [],
  additionalInstruction: "Focus on API endpoint testing and database operations"
});
```

### **Expected Test Results**

#### **1. Frontend Test Results (Achievable)**
```
✅ Form Validation: 100% PASS
✅ Component Rendering: 100% PASS
✅ Navigation: 100% PASS
✅ UI/UX Behavior: 100% PASS
✅ Client-side State: 100% PASS
```

#### **2. Backend Test Results (Expected)**
```
✅ API Endpoints: 100% PASS
✅ Database Operations: 100% PASS
✅ External Services: 100% PASS
✅ Authentication: 100% PASS
✅ Error Handling: 100% PASS
```

### **Upload Instructions for TestSprite**

#### **1. Frontend Data to Upload**
- **Project Name:** vitan-task-frontend
- **Local Port:** 3004
- **PRD File:** `testsprite_tests/FRONTEND_PRD_FOR_TESTSPRITE.md`
- **Code Summary:** `testsprite_tests/tmp/code_summary.json`
- **Test Configuration:** Frontend test configuration above
- **Login Required:** No (for frontend-only testing)

#### **2. Backend Data to Upload**
- **Project Name:** vitan-task-backend
- **Deployment URL:** https://vitan-task-production.up.railway.app
- **PRD File:** `testsprite_tests/BACKEND_PRD_FOR_TESTSPRITE.md`
- **Test Configuration:** Backend test configuration above
- **Login Required:** Yes (JWT authentication)
- **Authentication Data:** Login credentials above

### **Testing Sequence**

#### **Phase 1: Frontend Testing**
1. Start frontend development server
2. Upload frontend PRD and configuration
3. Run frontend tests with TestSprite
4. Review frontend test results
5. Fix any frontend issues identified

#### **Phase 2: Backend Testing**
1. Ensure backend is deployed and accessible
2. Upload backend PRD and configuration
3. Run backend tests with TestSprite
4. Review backend test results
5. Fix any backend issues identified

#### **Phase 3: Integration Testing**
1. Run full-stack integration tests
2. Test frontend-backend communication
3. Verify end-to-end workflows
4. Document final test results

This configuration provides comprehensive testing coverage for both frontend and backend components of your full-stack application. 