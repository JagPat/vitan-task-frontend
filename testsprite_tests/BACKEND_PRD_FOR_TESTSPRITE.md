# Backend PRD for TestSprite MCP Testing

## Project Overview
**Project Name:** Vitan Task Management Backend
**Technology Stack:** Node.js, Express, MongoDB, WhatsApp API
**Deployment URL:** https://vitan-task-production.up.railway.app
**Port:** 8080 (Railway deployment)

## Core Features

### 1. Task Management API
**Description:** Complete CRUD operations for task management
**Endpoints:**
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id` - Get specific task

**Test Requirements:**
- Task creation with validation
- Task retrieval with filtering
- Task updates with proper validation
- Task deletion with cascade handling
- Error handling for invalid requests

### 2. User Management API
**Description:** User authentication and profile management
**Endpoints:**
- `POST /api/users` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

**Test Requirements:**
- User registration with validation
- Login authentication with JWT
- Profile management operations
- Password reset functionality
- Session management

### 3. Contact Management API
**Description:** Contact registration and WhatsApp integration
**Endpoints:**
- `POST /api/contacts` - Register new contact
- `POST /api/contacts/verify` - Verify contact with OTP
- `GET /api/contacts` - Get all contacts
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

**Test Requirements:**
- Contact registration workflow
- WhatsApp OTP verification
- Contact data validation
- Phone number normalization
- Contact search and filtering

### 4. WhatsApp Integration API
**Description:** WhatsApp messaging and notification system
**Endpoints:**
- `POST /api/whatsapp/send` - Send WhatsApp message
- `POST /webhook/whatsapp` - WhatsApp webhook handler
- `GET /api/whatsapp/status` - Get message status
- `POST /api/whatsapp/bulk` - Send bulk messages

**Test Requirements:**
- Message sending functionality
- Webhook handling
- Message status tracking
- Error handling for failed messages
- Rate limiting compliance

### 5. Project Management API
**Description:** Project creation and team collaboration
**Endpoints:**
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/members` - Get project members

**Test Requirements:**
- Project CRUD operations
- Team member management
- Project assignment workflow
- Permission-based access control
- Project analytics and reporting

### 6. Analytics API
**Description:** Data analytics and reporting
**Endpoints:**
- `GET /api/analytics/tasks` - Task analytics
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/projects` - Project analytics
- `GET /api/analytics/performance` - Performance metrics

**Test Requirements:**
- Data aggregation and processing
- Report generation
- Real-time analytics
- Data export functionality
- Performance optimization

## Test Scenarios

### API Endpoint Testing
1. **Task Management Testing**
   - Test task creation with valid data
   - Test task creation with invalid data
   - Test task retrieval with filters
   - Test task updates and deletions
   - Test error handling for invalid requests

2. **User Authentication Testing**
   - Test user registration
   - Test login with valid credentials
   - Test login with invalid credentials
   - Test JWT token validation
   - Test password reset functionality

3. **Contact Management Testing**
   - Test contact registration
   - Test WhatsApp OTP verification
   - Test contact data validation
   - Test phone number formatting
   - Test contact search functionality

4. **WhatsApp Integration Testing**
   - Test message sending
   - Test webhook handling
   - Test message status tracking
   - Test error handling for failed messages
   - Test rate limiting

### Database Operations Testing
1. **Data Validation Testing**
   - Test required field validation
   - Test data type validation
   - Test unique constraint validation
   - Test foreign key constraints
   - Test data integrity

2. **Transaction Testing**
   - Test rollback scenarios
   - Test concurrent operations
   - Test data consistency
   - Test error recovery
   - Test performance under load

### External Service Integration Testing
1. **WhatsApp API Testing**
   - Test message delivery
   - Test webhook processing
   - Test error handling
   - Test rate limiting
   - Test message status tracking

2. **Email Service Testing**
   - Test email sending
   - Test email templates
   - Test error handling
   - Test delivery confirmation
   - Test spam prevention

## Test Data Requirements

### Test User Data
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

### Test Task Data
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

### Test Contact Data
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

### Test Project Data
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

## Authentication Requirements

### Login Credentials for Testing
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
  }
}
```

### API Authentication
- **JWT Token Required:** Yes
- **Token Expiry:** 24 hours
- **Refresh Token:** Yes
- **Rate Limiting:** 100 requests per minute

## Success Criteria

### Backend Success Metrics
- ✅ 100% pass rate for API endpoint tests
- ✅ All database operations successful
- ✅ External service integrations working
- ✅ Proper error handling and responses
- ✅ Performance within acceptable limits

### Test Coverage Requirements
- API endpoints: 100%
- Database operations: 100%
- External service integration: 100%
- Error handling: 100%
- Authentication: 100%

## Configuration Notes

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=mongodb://localhost:27017/vitan-task
WHATSAPP_API_KEY=your_whatsapp_api_key
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_KEY=your_email_service_key
```

### API Base URL
```
https://vitan-task-production.up.railway.app
```

### Test Configuration
- **Deployment URL:** https://vitan-task-production.up.railway.app
- **Port:** 8080 (Railway deployment)
- **Test Scope:** codebase
- **Login Required:** true (for API testing)
- **Authentication:** JWT token required

## Expected Test Results

### Backend Test Results (Expected)
```
✅ API Endpoints: 100% PASS
✅ Database Operations: 100% PASS
✅ External Services: 100% PASS
✅ Authentication: 100% PASS
✅ Error Handling: 100% PASS
```

## Error Handling Requirements

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

This PRD provides comprehensive coverage for backend testing, focusing on API endpoints, database operations, external service integrations, and authentication systems. 