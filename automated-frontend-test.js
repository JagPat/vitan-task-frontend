#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';

class FrontendTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.backendUrl = 'https://vitan-task-production.up.railway.app';
    this.frontendUrl = 'http://localhost:3003';
  }

  async init() {
    console.log('🚀 Starting automated frontend testing...');
    this.browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized'],
    });
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => console.log('Browser Console:', msg.text()));
    this.page.on('pageerror', error => console.log('Page Error:', error.message));
  }

  async testBackendHealth() {
    console.log('\n🔍 Testing Backend Health...');
    try {
      const response = await fetch(`${this.backendUrl}/health`, { credentials: 'include' });
      const data = await response.json();
      this.logTest('Backend Health Check', response.ok, data);
    } catch (error) {
      this.logTest('Backend Health Check', false, error.message);
    }
  }

  async testFrontendLoad() {
    console.log('\n🌐 Testing Frontend Load...');
    try {
      await this.page.goto(this.frontendUrl, { waitUntil: 'networkidle0' });
      const title = await this.page.title();
      this.logTest('Frontend Load', true, `Title: ${title}`);
    } catch (error) {
      this.logTest('Frontend Load', false, error.message);
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication...');
    
    try {
      // Test login dialog appearance
      const loginButton = await this.page.$('[data-testid="login-button"]') ||
                         await this.page.$('[data-testid="login-dialog"]');
      
      if (loginButton) {
        await loginButton.click();
        await this.page.waitForTimeout(1000);
        
        // Test phone number input
        const phoneInput = await this.page.$('input[type="tel"], input[name="phone"]');
        if (phoneInput) {
          await phoneInput.type('919428120418');
          this.logTest('Phone Input', true, 'Phone number entered');
        } else {
          this.logTest('Phone Input', false, 'Phone input not found');
        }
        
        // Test OTP input
        const otpInput = await this.page.$('input[name="otp"], input[type="text"]');
        if (otpInput) {
          await otpInput.type('123456');
          this.logTest('OTP Input', true, 'OTP entered');
        } else {
          this.logTest('OTP Input', false, 'OTP input not found');
        }
      } else {
        this.logTest('Login Button', false, 'Login button not found');
      }
    } catch (error) {
      this.logTest('Authentication Flow', false, error.message);
    }
  }

  async testNavigation() {
    console.log('\n🧭 Testing Navigation...');
    
    const navigationTests = [
      { name: 'Dashboard', selector: 'a[href="/dashboard"], [data-testid="dashboard-link"]' },
      { name: 'Tasks', selector: 'a[href="/tasks"], [data-testid="tasks-link"]' },
      { name: 'Projects', selector: 'a[href="/projects"], [data-testid="projects-link"]' },
      { name: 'Team', selector: 'a[href="/team"], [data-testid="team-link"]' },
      { name: 'Analytics', selector: 'a[href="/analytics"], [data-testid="analytics-link"]' },
    ];

    for (const test of navigationTests) {
      try {
        const link = await this.page.$(test.selector);
        if (link) {
          await link.click();
          await this.page.waitForTimeout(1000);
          this.logTest(`${test.name} Navigation`, true, 'Navigation successful');
        } else {
          this.logTest(`${test.name} Navigation`, false, 'Link not found');
        }
      } catch (error) {
        this.logTest(`${test.name} Navigation`, false, error.message);
      }
    }
  }

  async testTaskManagement() {
    console.log('\n📋 Testing Task Management...');
    
    try {
      // Test create task button
      const createTaskBtn = await this.page.$('[data-testid="create-task-button"]') || (await this.page.$x("//button[contains(normalize-space(text()), 'Create Task')]"))[0];
      if (createTaskBtn) {
        await createTaskBtn.click();
        await this.page.waitForTimeout(1000);
        this.logTest('Create Task Button', true, 'Create task dialog opened');
        
        // Test task form inputs
        const titleInput = await this.page.$('input[name="title"], input[placeholder*="title"]');
        if (titleInput) {
          await titleInput.type('Test Task');
          this.logTest('Task Title Input', true, 'Title entered');
        }
        
        const descriptionInput = await this.page.$('textarea[name="description"], textarea[placeholder*="description"]');
        if (descriptionInput) {
          await descriptionInput.type('Test task description');
          this.logTest('Task Description Input', true, 'Description entered');
        }
        
        // Test priority selection
        const prioritySelect = await this.page.$('select[name="priority"], [data-testid="priority-select"]');
        if (prioritySelect) {
          await prioritySelect.select('high');
          this.logTest('Task Priority Selection', true, 'Priority selected');
        }
        
        // Test save button
        const saveBtn = await this.page.$('[data-testid="save-button"]') || await this.page.$('button[type="submit"]');
        if (saveBtn) {
          await saveBtn.click();
          await this.page.waitForTimeout(1000);
          this.logTest('Task Save', true, 'Task saved successfully');
        }
      } else {
        this.logTest('Create Task Button', false, 'Create task button not found');
      }
    } catch (error) {
      this.logTest('Task Management', false, error.message);
    }
  }

async testProjectManagement() {
    console.log('\n📁 Testing Project Management...');
    
    try {
      // Test create project button
      const createProjectBtn = await this.page.$('[data-testid="create-project-button"]') || await this.page.$('button');
      if (createProjectBtn) {
        await createProjectBtn.click();
        await this.page.waitForTimeout(1000);
        this.logTest('Create Project Button', true, 'Create project dialog opened');
        
        // Test project form inputs
        const nameInput = await this.page.$('input[name="name"], input[placeholder*="name"]');
        if (nameInput) {
          await nameInput.type('Test Project');
          this.logTest('Project Name Input', true, 'Name entered');
        } else {
          this.logTest('Project Name Input', false, 'Project name input not found');
        }
        
        const descriptionInput = await this.page.$('textarea[name="description"], textarea[placeholder*="description"]');
        if (descriptionInput) {
          await descriptionInput.type('Test project description');
          this.logTest('Project Description Input', true, 'Description entered');
        } else {
          this.logTest('Project Description Input', false, 'Project description input not found');
        }
        
        // Test save button
        const saveBtn = await this.page.$('[data-testid="save-button"]') || await this.page.$('button[type="submit"]');
        if (saveBtn) {
          await saveBtn.click();
          await this.page.waitForTimeout(1000);
          this.logTest('Project Save', true, 'Project saved successfully');
        } else {
          this.logTest('Project Save', false, 'Save button not found');
        }
      } else {
        this.logTest('Create Project Button', false, 'Create project button not found');
      }
    } catch (error) {
      this.logTest('Project Management', false, error.message);
    }
  }
async testTeamManagement() {
    console.log('\n👥 Testing Team Management...');
    
    try {
      // Test invite user button
      const inviteBtn = await this.page.$('[data-testid="invite-user-button"]');
      if (inviteBtn) {
        await inviteBtn.click();
        await this.page.waitForTimeout(1000);
        this.logTest('Invite User Button', true, 'Invite dialog opened');
        
        // Test invite form
        const emailInput = await this.page.$('input[type="email"], input[name="email"]');
        if (emailInput) {
          await emailInput.type('test@example.com');
          this.logTest('Invite Email Input', true, 'Email entered');
        }
        
        const roleSelect = await this.page.$('select[name="role"], [data-testid="role-select"]');
        if (roleSelect) {
          await roleSelect.select('member');
          this.logTest('Role Selection', true, 'Role selected');
        }
        
        // Test send invite button
        const [sendBtn] = await this.page.$x("//button[contains(., 'Send Invite') or contains(., 'Invite')]");
        if (sendBtn) {
          await sendBtn.click();
          await this.page.waitForTimeout(1000);
          this.logTest('Send Invite', true, 'Invite sent successfully');
        }
      } else {
        this.logTest('Invite User Button', false, 'Invite button not found');
      }
    } catch (error) {
      this.logTest('Team Management', false, error.message);
    }
  }

  async testWhatsAppIntegration() {
    console.log('\n📱 Testing WhatsApp Integration...');
    
    try {
      // Navigate to WhatsApp admin page
      await this.page.goto(`${this.frontendUrl}/whatsapp-admin`);
      await this.page.waitForTimeout(1000);
      
      // Test WhatsApp status
      const statusElement = await this.page.$('[data-testid="whatsapp-status"], .status-indicator');
      if (statusElement) {
        const status = await statusElement.textContent();
        this.logTest('WhatsApp Status', true, `Status: ${status}`);
      } else {
        this.logTest('WhatsApp Status', false, 'Status element not found');
      }
      
      // Test message sending
      const messageInput = await this.page.$('textarea[name="message"], input[name="message"]');
      if (messageInput) {
        await messageInput.type('Test message from automated testing');
        this.logTest('Message Input', true, 'Message entered');
        
        const sendBtn = await this.page.$('button:contains("Send"), button:contains("Send Message")');
        if (sendBtn) {
          await sendBtn.click();
          await this.page.waitForTimeout(1000);
          this.logTest('Send Message', true, 'Message sent successfully');
        }
      } else {
        this.logTest('Message Input', false, 'Message input not found');
      }
    } catch (error) {
      this.logTest('WhatsApp Integration', false, error.message);
    }
  }

  async testAnalytics() {
    console.log('\n📊 Testing Analytics...');
    
    try {
      // Navigate to analytics page
      await this.page.goto(`${this.frontendUrl}/analytics`);
      await this.page.waitForTimeout(2000);
      
      // Test chart loading
      const charts = await this.page.$$('canvas, [data-testid="chart"], .chart');
      if (charts.length > 0) {
        this.logTest('Analytics Charts', true, `${charts.length} charts found`);
      } else {
        this.logTest('Analytics Charts', false, 'No charts found');
      }
      
      // Test metrics cards
      const metrics = await this.page.$$('[data-testid="metric"], .metric-card');
      if (metrics.length > 0) {
        this.logTest('Analytics Metrics', true, `${metrics.length} metrics found`);
      } else {
        this.logTest('Analytics Metrics', false, 'No metrics found');
      }
    } catch (error) {
      this.logTest('Analytics', false, error.message);
    }
  }

  logTest(testName, passed, details) {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString(),
    };
    this.testResults.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  generateReport() {
    console.log('\n📋 Test Report Summary');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = ((passed / total) * 100).toFixed(1);
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${percentage}%`);
    
    console.log('\n📝 Detailed Results:');
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.details}`);
    });
    
    // Save report to file
    const report = {
      summary: {
        total: total,
        passed: passed,
        failed: total - passed,
        successRate: percentage,
      },
      results: this.testResults,
      timestamp: new Date().toISOString(),
    };
    
    fs.writeFileSync('frontend-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved to: frontend-test-report.json');
  }

  async run() {
    try {
      await this.init();
      await this.testBackendHealth();
      await this.testFrontendLoad();
      await this.testAuthentication();
      await this.testNavigation();
      await this.testTaskManagement();
      await this.testProjectManagement();
      await this.testTeamManagement();
      await this.testWhatsAppIntegration();
      await this.testAnalytics();
      
      this.generateReport();
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the tests
const tester = new FrontendTester();
tester.run(); 