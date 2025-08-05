#!/usr/bin/env node

/**
 * Quick Production Test for Vitan Task Project
 * 
 * Tests the live deployment at:
 * - Backend: https://vitan-task-production.up.railway.app
 * - Frontend: https://vitan-task-frontend.up.railway.app
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class QuickProductionTest {
  constructor() {
    this.config = {
      backendUrl: 'https://vitan-task-production.up.railway.app',
      frontendUrl: 'https://vitan-task-frontend.up.railway.app',
      timeout: 10000
    };
    
    this.results = [];
  }

  async testBackendHealth() {
    console.log('🔧 Testing Backend Health...');
    
    try {
      const response = await axios.get(`${this.config.backendUrl}/health`, {
        timeout: this.config.timeout
      });
      
      // Updated to match actual response format
      const isHealthy = response.status === 200 && response.data.status === 'OK';
      
      this.results.push({
        name: 'Backend Health Check',
        status: isHealthy ? 'PASS' : 'FAIL',
        response: response.data,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  ${isHealthy ? '✅ PASS' : '❌ FAIL'}: Backend Health Check`);
      console.log(`  📊 Response: ${JSON.stringify(response.data, null, 2)}`);
      return isHealthy;
    } catch (error) {
      console.log(`  ❌ ERROR: Backend Health Check - ${error.message}`);
      this.results.push({
        name: 'Backend Health Check',
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  async testBackendEndpoints() {
    console.log('\n🔧 Testing Backend API Endpoints...');
    
    const endpoints = [
      { name: 'Tasks API', path: '/api/tasks' },
      { name: 'Users API', path: '/api/users' },
      { name: 'Analytics API', path: '/api/analytics' },
      { name: 'Contacts API', path: '/api/contacts' },
      { name: 'Projects API', path: '/api/projects' },
      { name: 'Project Members API', path: '/api/project-members' },
      { name: 'Invitations API', path: '/api/invitations' }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`  🔍 Testing: ${endpoint.name}`);
        const response = await axios.get(`${this.config.backendUrl}${endpoint.path}`, {
          timeout: this.config.timeout
        });
        
        const isWorking = response.status === 200 || response.status === 401; // 401 is expected for unauthenticated requests
        
        this.results.push({
          name: endpoint.name,
          status: isWorking ? 'PASS' : 'FAIL',
          statusCode: response.status,
          timestamp: new Date().toISOString()
        });
        
        console.log(`  ${isWorking ? '✅ PASS' : '❌ FAIL'}: ${endpoint.name} (${response.status})`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${endpoint.name} - ${error.message}`);
        this.results.push({
          name: endpoint.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testWhatsAppWebhook() {
    console.log('\n📱 Testing WhatsApp Webhook...');
    
    try {
      const response = await axios.post(`${this.config.backendUrl}/webhook`, {
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              messages: [{
                from: '1234567890',
                text: { body: 'Test message' }
              }]
            }
          }]
        }]
      }, {
        timeout: this.config.timeout
      });
      
      const isWorking = response.status === 200;
      
      this.results.push({
        name: 'WhatsApp Webhook',
        status: isWorking ? 'PASS' : 'FAIL',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  ${isWorking ? '✅ PASS' : '❌ FAIL'}: WhatsApp Webhook (${response.status})`);
      return isWorking;
    } catch (error) {
      console.log(`  ❌ ERROR: WhatsApp Webhook - ${error.message}`);
      this.results.push({
        name: 'WhatsApp Webhook',
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  async testFrontendAccessibility() {
    console.log('\n🌐 Testing Frontend Accessibility...');
    
    try {
      const response = await axios.get(this.config.frontendUrl, {
        timeout: this.config.timeout
      });
      
      const isAccessible = response.status === 200;
      
      this.results.push({
        name: 'Frontend Accessibility',
        status: isAccessible ? 'PASS' : 'FAIL',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  ${isAccessible ? '✅ PASS' : '❌ FAIL'}: Frontend Accessibility (${response.status})`);
      return isAccessible;
    } catch (error) {
      console.log(`  ❌ ERROR: Frontend Accessibility - ${error.message}`);
      this.results.push({
        name: 'Frontend Accessibility',
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const performanceTests = [
      {
        name: 'Backend Response Time',
        test: async () => {
          const startTime = Date.now();
          await axios.get(`${this.config.backendUrl}/health`, {
            timeout: this.config.timeout
          });
          const responseTime = Date.now() - startTime;
          return { passed: responseTime < 2000, time: responseTime };
        }
      },
      {
        name: 'API Response Time',
        test: async () => {
          const startTime = Date.now();
          await axios.get(`${this.config.backendUrl}/api/tasks`, {
            timeout: this.config.timeout
          });
          const responseTime = Date.now() - startTime;
          return { passed: responseTime < 3000, time: responseTime };
        }
      }
    ];

    for (const test of performanceTests) {
      try {
        console.log(`  🔍 Testing: ${test.name}`);
        const result = await test.test();
        
        this.results.push({
          name: test.name,
          status: result.passed ? 'PASS' : 'FAIL',
          responseTime: result.time,
          timestamp: new Date().toISOString()
        });
        
        console.log(`  ${result.passed ? '✅ PASS' : '❌ FAIL'}: ${test.name} (${result.time}ms)`);
      } catch (error) {
        console.log(`  ❌ ERROR: ${test.name} - ${error.message}`);
        this.results.push({
          name: test.name,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Quick Test Report...');
    
    const report = {
      project: 'Vitan Task Management System',
      environment: 'production',
      backendUrl: this.config.backendUrl,
      frontendUrl: this.config.frontendUrl,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'PASS').length,
        failed: this.results.filter(r => r.status === 'FAIL').length,
        errors: this.results.filter(r => r.status === 'ERROR').length
      },
      details: this.results
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'quick_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Quick test report saved to: ${reportPath}`);
    
    // Print summary
    console.log('\n🎯 Quick Test Summary:');
    console.log(`Total: ${report.summary.passed}/${report.summary.total} passed`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Errors: ${report.summary.errors}`);
    
    return report;
  }

  async runQuickTests() {
    console.log('🚀 Starting Quick Production Tests...');
    console.log(`📡 Backend: ${this.config.backendUrl}`);
    console.log(`🌐 Frontend: ${this.config.frontendUrl}`);
    
    try {
      await this.testBackendHealth();
      await this.testBackendEndpoints();
      await this.testWhatsAppWebhook();
      await this.testFrontendAccessibility();
      await this.testPerformance();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Quick test execution failed:', error);
    }
  }
}

// Run tests if this file is executed directly
const runner = new QuickProductionTest();
runner.runQuickTests(); 