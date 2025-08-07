# 🤖 Testing Automation Implementation Plan

## 🎯 Phase 1: Frontend Testing Automation

### Jest + React Testing Library Setup
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Component Testing Framework
```javascript
// tests/components/LoginDialog.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginDialog from '../src/components/LoginDialog';

describe('LoginDialog Authentication', () => {
  test('OAuth tab renders correctly', () => {
    render(<LoginDialog open={true} />);
    expect(screen.getByText('OAuth')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginDialog open={true} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'invalid-email');
    await user.click(screen.getByText('Login with OAuth'));
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('prevents unauthorized access', async () => {
    const user = userEvent.setup();
    render(<LoginDialog open={true} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'test@invalid.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByText('Login with OAuth'));
    
    // Verify localStorage is cleaned up
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
```

### E2E Testing with Playwright
```bash
npm install --save-dev @playwright/test
```

```javascript
// tests/e2e/task-management.spec.js
import { test, expect } from '@playwright/test';

test.describe('Task Management Flow', () => {
  test('complete task creation workflow', async ({ page }) => {
    await page.goto('http://localhost:3003');
    
    // Login
    await page.click('button:has-text("Login")');
    await page.click('button:has-text("OAuth")');
    await page.fill('#oauth_email', 'admin@test.com');
    await page.fill('#oauth_password', 'password123');
    await page.click('button:has-text("Login with OAuth")');
    
    // Navigate to task creation
    await page.goto('/CreateTask');
    
    // Fill task form
    await page.fill('#title', 'E2E Test Task');
    await page.fill('#description', 'Automated test task creation');
    await page.selectOption('select[name="priority"]', 'High');
    
    // Submit and verify
    await page.click('button:has-text("Create Task")');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.toast')).toContainText('Task created successfully');
  });
});
```

## 🎯 Phase 2: Backend Testing Automation

### API Testing with Jest + Supertest
```bash
cd ../vitan-task-backend
npm install --save-dev jest supertest
```

```javascript
// tests/api/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication Endpoints', () => {
  test('POST /api/auth/login-email with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login-email')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login-email with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login-email')
      .send({
        email: 'invalid@test.com',
        password: 'wrongpass'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('Task Management Endpoints', () => {
  let authToken;
  
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login-email')
      .send({ email: 'admin@test.com', password: 'password123' });
    authToken = loginResponse.body.data.token;
  });

  test('GET /api/tasks returns tasks list', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/tasks creates new task', async () => {
    const taskData = {
      title: 'API Test Task',
      description: 'Task created via API test',
      priority: 'Medium',
      assigned_to: 1
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);
    
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe(taskData.title);
  });
});
```

### WhatsApp Integration Testing
```javascript
// tests/integration/whatsapp.test.js
const { processWhatsAppMessage } = require('../services/whatsappService');

describe('WhatsApp Message Processing', () => {
  test('processes task creation command', async () => {
    const messageData = {
      from: '1234567890',
      text: { body: '/task "Test Task" "Task description" High' }
    };

    const result = await processWhatsAppMessage(messageData);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Task created successfully');
  });

  test('processes natural language Hindi input', async () => {
    const messageData = {
      from: '1234567890',
      text: { body: 'मुझे एक नया कार्य बनाना है - ग्राहक मीटिंग आज शाम 5 बजे' }
    };

    const result = await processWhatsAppMessage(messageData);
    
    expect(result.success).toBe(true);
    expect(result.taskCreated).toBe(true);
  });
});
```

## 🎯 Phase 3: CI/CD Automation

### GitHub Actions Workflow
```yaml
# .github/workflows/test-and-deploy.yml
name: Test and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: ./vitan-task-frontend
      
      - name: Run unit tests
        run: npm test
        working-directory: ./vitan-task-frontend
      
      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: ./vitan-task-frontend

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: ./vitan-task-backend
      
      - name: Run API tests
        run: npm test
        working-directory: ./vitan-task-backend
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test

  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Railway
        run: |
          echo "Deploying to Railway..."
          # Railway deployment commands
```

### Automated Testing Dashboard
```javascript
// scripts/test-dashboard.js
const TestResults = require('./test-results-collector');

class TestingDashboard {
  async generateReport() {
    const results = {
      frontend: await TestResults.getFrontendResults(),
      backend: await TestResults.getBackendResults(),
      e2e: await TestResults.getE2EResults(),
      whatsapp: await TestResults.getWhatsAppResults()
    };

    const overallHealth = this.calculateHealth(results);
    
    return {
      timestamp: new Date().toISOString(),
      overallHealth,
      passRate: this.calculatePassRate(results),
      results,
      recommendations: this.generateRecommendations(results)
    };
  }

  calculateHealth(results) {
    const totalTests = Object.values(results).reduce((sum, r) => sum + r.total, 0);
    const passedTests = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    return Math.round((passedTests / totalTests) * 100);
  }
}
```

## 🎯 Phase 4: Performance & Load Testing

### Performance Testing with Artillery
```yaml
# tests/performance/load-test.yml
config:
  target: 'https://vitan-task-production.up.railway.app'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "API Load Test"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login-email"
          json:
            email: "load-test@example.com"
            password: "password123"
          capture:
            header: "Authorization"
            as: "token"
      - get:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ token }}"
      - post:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            title: "Load Test Task {{ $randomString() }}"
            description: "Generated by load test"
            priority: "Medium"

  - name: "WhatsApp Webhook Load"
    weight: 30
    flow:
      - post:
          url: "/webhook"
          json:
            messaging:
              - sender:
                  id: "{{ $randomInt(1000000000, 9999999999) }}"
                message:
                  text: "Load test message {{ $randomString() }}"
```

### Monitoring & Alerting
```javascript
// scripts/monitoring.js
const AlertManager = require('./alert-manager');

class SystemMonitor {
  async checkSystemHealth() {
    const checks = await Promise.all([
      this.checkFrontendHealth(),
      this.checkBackendHealth(),
      this.checkDatabaseHealth(),
      this.checkWhatsAppIntegration()
    ]);

    const failedChecks = checks.filter(check => !check.healthy);
    
    if (failedChecks.length > 0) {
      await AlertManager.sendAlert({
        type: 'system_health',
        severity: 'high',
        message: `${failedChecks.length} system checks failed`,
        details: failedChecks
      });
    }

    return {
      overall: failedChecks.length === 0,
      details: checks
    };
  }
}
```