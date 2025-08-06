#!/usr/bin/env node

/**
 * TestSprite Test Execution Script for Vitan Task Project
 * 
 * This script provides comprehensive testing capabilities for:
 * - Frontend UI/UX testing
 * - Backend API testing  
 * - WhatsApp integration testing
 * - AI integration testing
 * - Performance testing
 * - Security testing
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class TestSpriteRunner {
  constructor() {
    this.results = {
      frontend: [],
      backend: [],
      integration: [],
      performance: [],
      security: []
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing TestSprite for Vitan Task Project...');
    
    // Launch browser for frontend testing
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set up request interception for API testing
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      // Log API calls for testing
      if (request.url().includes('/api/')) {
        console.log(`📡 API Call: ${request.method()} ${request.url()}`);
      }
      request.continue();
    });
    
    console.log('✅ TestSprite initialized successfully');
  }

  async runFrontendTests() {
    console.log('\n🧪 Running Frontend Tests...');
    
    const frontendTests = [
      {
        name: 'User Authentication Flow',
        test: async () => {
          await this.page.goto('http://localhost:3000');
          await this.page.waitForSelector('[data-testid="login-button"]');
          await this.page.click('[data-testid="login-button"]');
          
          // Fill login form
          await this.page.type('[data-testid="email-input"]', 'test@example.com');
          await this.page.type('[data-testid="password-input"]', 'password123');
          await this.page.click('[data-testid="submit-login"]');
          
          // Verify successful login
          await this.page.waitForSelector('[data-testid="dashboard"]');
          const dashboardText = await this.page.$eval('[data-testid="dashboard"]', el => el.textContent);
          
          return dashboardText.includes('Dashboard');
        }
      },
      {
        name: 'Task Creation Wizard',
        test: async () => {
          await this.page.goto('http://localhost:3000/create-task');
          await this.page.waitForSelector('[data-testid="task-wizard"]');
          
          // Start wizard
          await this.page.click('[data-testid="start-wizard"]');
          
          // Fill task details
          await this.page.type('[data-testid="task-title"]', 'Test Task');
          await this.page.click('[data-testid="next-step"]');
          
          // Select project
          await this.page.select('[data-testid="project-select"]', 'test-project');
          await this.page.click('[data-testid="next-step"]');
          
          // Complete wizard
          await this.page.click('[data-testid="complete-task"]');
          
          // Verify task created
          await this.page.waitForSelector('[data-testid="success-message"]');
          const successText = await this.page.$eval('[data-testid="success-message"]', el => el.textContent);
          
          return successText.includes('Task created successfully');
        }
      },
      {
        name: 'Project Management',
        test: async () => {
          await this.page.goto('http://localhost:3000/projects');
          await this.page.waitForSelector('[data-testid="projects-list"]');
          
          // Create new project
          await this.page.click('[data-testid="create-project"]');
          await this.page.type('[data-testid="project-name"]', 'Test Project');
          await this.page.type('[data-testid="project-description"]', 'Test Description');
          await this.page.click('[data-testid="save-project"]');
          
          // Verify project created
          await this.page.waitForSelector('[data-testid="project-item"]');
          const projectText = await this.page.$eval('[data-testid="project-item"]', el => el.textContent);
          
          return projectText.includes('Test Project');
        }
      },
      {
        name: 'Team Management',
        test: async () => {
          await this.page.goto('http://localhost:3000/team');
          await this.page.waitForSelector('[data-testid="team-list"]');
          
          // Add team member
          await this.page.click('[data-testid="add-member"]');
          await this.page.type('[data-testid="member-name"]', 'John Doe');
          await this.page.type('[data-testid="member-email"]', 'john@example.com');
          await this.page.click('[data-testid="invite-member"]');
          
          // Verify invitation sent
          await this.page.waitForSelector('[data-testid="invitation-sent"]');
          const invitationText = await this.page.$eval('[data-testid="invitation-sent"]', el => el.textContent);
          
          return invitationText.includes('Invitation sent');
        }
      },
      {
        name: 'WhatsApp Integration',
        test: async () => {
          await this.page.goto('http://localhost:3000/whatsapp-admin');
          await this.page.waitForSelector('[data-testid="whatsapp-dashboard"]');
          
          // Test message history
          const messageHistory = await this.page.$eval('[data-testid="message-history"]', el => el.children.length);
          
          // Test AI responses
          await this.page.click('[data-testid="test-ai"]');
          await this.page.waitForSelector('[data-testid="ai-response"]');
          const aiResponse = await this.page.$eval('[data-testid="ai-response"]', el => el.textContent);
          
          return messageHistory > 0 && aiResponse.length > 0;
        }
      },
      {
        name: 'Analytics Dashboard',
        test: async () => {
          await this.page.goto('http://localhost:3000/analytics');
          await this.page.waitForSelector('[data-testid="analytics-dashboard"]');
          
          // Check charts load
          const charts = await this.page.$$('[data-testid="chart"]');
          
          // Check metrics display
          const metrics = await this.page.$$('[data-testid="metric"]');
          
          return charts.length > 0 && metrics.length > 0;
        }
      }
    ];

    for (const test of frontendTests) {
      try {
        console.log(`  🔍 Running: ${test.name}`);
        const result = await test.test();
        this.results.frontend.push({
          name: test.name,
          status: result ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        });
        console.log(`  ${result ? '✅ PASS' : '❌ FAIL'}: ${test.name}`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${test.name} - ${error.message}`);
        this.results.frontend.push({
          name: test.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async runBackendTests() {
    console.log('\n🔧 Running Backend Tests...');
    
    const backendTests = [
      {
        name: 'User Authentication API',
        test: async () => {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
          });
          return response.status === 200 && response.data.token;
        }
      },
      {
        name: 'Task Management API',
        test: async () => {
          const response = await axios.get('http://localhost:5000/api/tasks');
          return response.status === 200 && Array.isArray(response.data);
        }
      },
      {
        name: 'Project Management API',
        test: async () => {
          const response = await axios.get('http://localhost:5000/api/projects');
          return response.status === 200 && Array.isArray(response.data);
        }
      },
      {
        name: 'Team Management API',
        test: async () => {
          const response = await axios.get('http://localhost:5000/api/team/members');
          return response.status === 200 && Array.isArray(response.data);
        }
      },
      {
        name: 'WhatsApp Webhook',
        test: async () => {
          const response = await axios.post('http://localhost:5000/webhook', {
            entry: [{
              changes: [{
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  messages: [{
                    from: '1234567890',
                    text: { body: 'Hello' }
                  }]
                }
              }]
            }]
          });
          return response.status === 200;
        }
      },
      {
        name: 'AI Integration',
        test: async () => {
          const response = await axios.post('http://localhost:5000/api/ai/process', {
            message: 'Create a task for tomorrow'
          });
          return response.status === 200 && response.data.intent;
        }
      }
    ];

    for (const test of backendTests) {
      try {
        console.log(`  🔍 Running: ${test.name}`);
        const result = await test.test();
        this.results.backend.push({
          name: test.name,
          status: result ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        });
        console.log(`  ${result ? '✅ PASS' : '❌ FAIL'}: ${test.name}`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${test.name} - ${error.message}`);
        this.results.backend.push({
          name: test.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');
    
    const performanceTests = [
      {
        name: 'Page Load Performance',
        test: async () => {
          const startTime = Date.now();
          await this.page.goto('http://localhost:3000');
          const loadTime = Date.now() - startTime;
          return loadTime < 3000; // 3 seconds threshold
        }
      },
      {
        name: 'API Response Time',
        test: async () => {
          const startTime = Date.now();
          await axios.get('http://localhost:5000/api/tasks');
          const responseTime = Date.now() - startTime;
          return responseTime < 1000; // 1 second threshold
        }
      },
      {
        name: 'Database Query Performance',
        test: async () => {
          const startTime = Date.now();
          await axios.get('http://localhost:5000/api/projects');
          const queryTime = Date.now() - startTime;
          return queryTime < 500; // 500ms threshold
        }
      }
    ];

    for (const test of performanceTests) {
      try {
        console.log(`  🔍 Running: ${test.name}`);
        const result = await test.test();
        this.results.performance.push({
          name: test.name,
          status: result ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        });
        console.log(`  ${result ? '✅ PASS' : '❌ FAIL'}: ${test.name}`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${test.name} - ${error.message}`);
        this.results.performance.push({
          name: test.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async runSecurityTests() {
    console.log('\n🔒 Running Security Tests...');
    
    const securityTests = [
      {
        name: 'SQL Injection Prevention',
        test: async () => {
          try {
            await axios.get('http://localhost:5000/api/tasks?search=1\' OR 1=1--');
            return false; // Should not succeed
          } catch (error) {
            return error.response.status === 400; // Should return 400
          }
        }
      },
      {
        name: 'XSS Prevention',
        test: async () => {
          const response = await axios.post('http://localhost:5000/api/tasks', {
            title: '<script>alert("xss")</script>',
            description: 'Test task'
          });
          return response.status === 400; // Should reject XSS
        }
      },
      {
        name: 'Authentication Required',
        test: async () => {
          try {
            await axios.get('http://localhost:5000/api/tasks');
            return false; // Should require auth
          } catch (error) {
            return error.response.status === 401; // Should return 401
          }
        }
      }
    ];

    for (const test of securityTests) {
      try {
        console.log(`  🔍 Running: ${test.name}`);
        const result = await test.test();
        this.results.security.push({
          name: test.name,
          status: result ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        });
        console.log(`  ${result ? '✅ PASS' : '❌ FAIL'}: ${test.name}`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${test.name} - ${error.message}`);
        this.results.security.push({
          name: test.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');
    
    const report = {
      project: 'Vitan Task Management System',
      timestamp: new Date().toISOString(),
      summary: {
        frontend: {
          total: this.results.frontend.length,
          passed: this.results.frontend.filter(r => r.status === 'PASS').length,
          failed: this.results.frontend.filter(r => r.status === 'FAIL').length,
          errors: this.results.frontend.filter(r => r.status === 'ERROR').length
        },
        backend: {
          total: this.results.backend.length,
          passed: this.results.backend.filter(r => r.status === 'PASS').length,
          failed: this.results.backend.filter(r => r.status === 'FAIL').length,
          errors: this.results.backend.filter(r => r.status === 'ERROR').length
        },
        performance: {
          total: this.results.performance.length,
          passed: this.results.performance.filter(r => r.status === 'PASS').length,
          failed: this.results.performance.filter(r => r.status === 'FAIL').length,
          errors: this.results.performance.filter(r => r.status === 'ERROR').length
        },
        security: {
          total: this.results.security.length,
          passed: this.results.security.filter(r => r.status === 'PASS').length,
          failed: this.results.security.filter(r => r.status === 'FAIL').length,
          errors: this.results.security.filter(r => r.status === 'ERROR').length
        }
      },
      details: this.results
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Test report saved to: ${reportPath}`);
    
    // Print summary
    console.log('\n🎯 Test Summary:');
    console.log(`Frontend: ${report.summary.frontend.passed}/${report.summary.frontend.total} passed`);
    console.log(`Backend: ${report.summary.backend.passed}/${report.summary.backend.total} passed`);
    console.log(`Performance: ${report.summary.performance.passed}/${report.summary.performance.total} passed`);
    console.log(`Security: ${report.summary.security.passed}/${report.summary.security.total} passed`);
    
    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 TestSprite cleanup completed');
  }

  async runAllTests() {
    try {
      await this.initialize();
      await this.runFrontendTests();
      await this.runBackendTests();
      await this.runPerformanceTests();
      await this.runSecurityTests();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestSpriteRunner();
  runner.runAllTests();
}

module.exports = TestSpriteRunner; 