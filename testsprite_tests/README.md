# TestSprite Testing Framework for Vitan Task Project

## 🧪 Overview

This directory contains comprehensive testing setup using TestSprite for the Vitan Task Management System. The testing framework covers:

- **Frontend Testing**: React components, UI/UX, responsive design
- **Backend Testing**: API endpoints, database operations, WhatsApp integration
- **Integration Testing**: Frontend-backend communication, AI integration
- **Performance Testing**: Load times, API response times, database queries
- **Security Testing**: Authentication, authorization, input validation

## 📁 Directory Structure

```
testsprite_tests/
├── README.md                    # This file
├── run_tests.js                 # Main test execution script
├── frontend_test_plan.json      # Frontend test cases and scenarios
├── backend_test_plan.json       # Backend test cases and scenarios
├── tmp/
│   ├── code_summary.json        # Project code analysis
│   └── prd_files/              # Product requirements documents
└── test_report.json            # Generated test reports
```

## 🚀 Quick Start

### Prerequisites

1. **Install Dependencies**
   ```bash
   npm install puppeteer axios
   ```

2. **Start Your Applications**
   ```bash
   # Start frontend (in frontend directory)
   npm run dev
   
   # Start backend (in backend directory)
   npm start
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   node testsprite_tests/run_tests.js
   
   # Run specific test categories
   node -e "
   const TestSpriteRunner = require('./testsprite_tests/run_tests.js');
   const runner = new TestSpriteRunner();
   runner.runFrontendTests();
   "
   ```

## 📋 Test Categories

### Frontend Tests

| Test Category | Description | Priority |
|---------------|-------------|----------|
| **Authentication** | User login, registration, session management | High |
| **Task Management** | Task creation wizard, editing, filtering | High |
| **Project Management** | Project creation, assignment, details | High |
| **Team Management** | Member invitation, contact management | Medium |
| **WhatsApp Integration** | Admin interface, AI responses | High |
| **Analytics Dashboard** | Charts, metrics, data visualization | Medium |
| **UI/UX** | Responsive design, accessibility | Medium |
| **Performance** | Page load times, memory usage | Low |

### Backend Tests

| Test Category | Description | Priority |
|---------------|-------------|----------|
| **API Endpoints** | REST API functionality | High |
| **WhatsApp Integration** | Webhook processing, message handling | High |
| **Database Operations** | CRUD operations, queries | High |
| **AI Integration** | Intent recognition, entity extraction | High |
| **Security** | Authentication, authorization, validation | High |
| **Performance** | Response times, query optimization | Medium |

## 🎯 Test Execution

### Manual Testing

1. **Frontend Testing**
   ```bash
   # Start frontend
   npm run dev
   
   # Open browser and test manually
   # Follow test cases in frontend_test_plan.json
   ```

2. **Backend Testing**
   ```bash
   # Start backend
   npm start
   
   # Test API endpoints using Postman or curl
   # Follow test cases in backend_test_plan.json
   ```

### Automated Testing

1. **Run All Tests**
   ```bash
   node testsprite_tests/run_tests.js
   ```

2. **Run Specific Categories**
   ```javascript
   const TestSpriteRunner = require('./testsprite_tests/run_tests.js');
   const runner = new TestSpriteRunner();
   
   // Run only frontend tests
   await runner.runFrontendTests();
   
   // Run only backend tests
   await runner.runBackendTests();
   
   // Run only performance tests
   await runner.runPerformanceTests();
   
   // Run only security tests
   await runner.runSecurityTests();
   ```

## 📊 Test Reports

After running tests, a comprehensive report is generated at `testsprite_tests/test_report.json`:

```json
{
  "project": "Vitan Task Management System",
  "timestamp": "2025-08-04T17:30:00.000Z",
  "summary": {
    "frontend": {
      "total": 6,
      "passed": 5,
      "failed": 1,
      "errors": 0
    },
    "backend": {
      "total": 6,
      "passed": 6,
      "failed": 0,
      "errors": 0
    },
    "performance": {
      "total": 3,
      "passed": 3,
      "failed": 0,
      "errors": 0
    },
    "security": {
      "total": 3,
      "passed": 3,
      "failed": 0,
      "errors": 0
    }
  },
  "details": {
    // Detailed test results
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend URL
FRONTEND_URL=http://localhost:3000

# Backend URL
BACKEND_URL=http://localhost:5000

# Test Data
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123

# WhatsApp Test Number
WHATSAPP_TEST_NUMBER=1234567890

# OpenAI API Key (for AI testing)
OPENAI_API_KEY=your_openai_api_key
```

### Test Data Setup

1. **Create Test Users**
   ```sql
   INSERT INTO users (email, password, full_name, role) 
   VALUES ('test@example.com', 'hashed_password', 'Test User', 'admin');
   ```

2. **Create Test Projects**
   ```sql
   INSERT INTO projects (name, description, created_by) 
   VALUES ('Test Project', 'Test Description', 1);
   ```

3. **Create Test Tasks**
   ```sql
   INSERT INTO tasks (title, description, assigned_to, project_id) 
   VALUES ('Test Task', 'Test Description', 1, 1);
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Browser Launch Fails**
   ```bash
   # Install additional dependencies
   sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

2. **API Connection Fails**
   ```bash
   # Check if backend is running
   curl http://localhost:5000/api/health
   
   # Check environment variables
   echo $BACKEND_URL
   ```

3. **Test Selectors Not Found**
   ```bash
   # Add data-testid attributes to components
   <button data-testid="login-button">Login</button>
   <input data-testid="email-input" type="email" />
   ```

### Debug Mode

Run tests in debug mode for detailed logging:

```bash
DEBUG=* node testsprite_tests/run_tests.js
```

## 📈 Continuous Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: TestSprite Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Start backend
      run: npm start &
    
    - name: Start frontend
      run: npm run dev &
    
    - name: Wait for services
      run: sleep 30
    
    - name: Run tests
      run: node testsprite_tests/run_tests.js
    
    - name: Upload test results
      uses: actions/upload-artifact@v2
      with:
        name: test-results
        path: testsprite_tests/test_report.json
```

## 🎯 Best Practices

1. **Test Data Management**
   - Use separate test database
   - Clean up test data after each run
   - Use realistic test data

2. **Test Isolation**
   - Each test should be independent
   - Avoid test dependencies
   - Use unique identifiers

3. **Error Handling**
   - Graceful error handling
   - Detailed error messages
   - Proper cleanup on failure

4. **Performance Monitoring**
   - Set realistic performance thresholds
   - Monitor memory usage
   - Track response times

## 📞 Support

For issues or questions about TestSprite testing:

1. Check the troubleshooting section above
2. Review test logs in `test_report.json`
3. Verify environment setup
4. Check application logs for errors

## 🔄 Updates

To update TestSprite tests:

1. **Update Test Plans**
   - Modify `frontend_test_plan.json` or `backend_test_plan.json`
   - Add new test cases as needed

2. **Update Test Script**
   - Modify `run_tests.js` for new test logic
   - Add new test categories

3. **Update Dependencies**
   ```bash
   npm update puppeteer axios
   ```

---

**Happy Testing! 🧪✨** 