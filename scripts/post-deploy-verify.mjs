#!/usr/bin/env node

import https from 'https';
import { URL } from 'url';

// Configuration
const FRONTEND_URL = 'https://vitan-task-frontend.up.railway.app';
const BACKEND_URL = 'https://vitan-task-production.up.railway.app';

// Test endpoints
const FRONTEND_TESTS = [
  { path: '/', name: 'Frontend Homepage' },
  { path: '/login', name: 'Login Page' }
];

const BACKEND_TESTS = [
  { path: '/api/modules', name: 'Modules Status' },
  { path: '/api/events/stats', name: 'Event Statistics' },
  { path: '/api/modules/whatsapp/health', name: 'WhatsApp Health' },
  { path: '/api/tasks', name: 'Tasks API' }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'WhatsTask-Post-Deploy-Verification/1.0.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test endpoint
async function testEndpoint(baseUrl, endpoint, name) {
  const url = `${baseUrl}${endpoint.path}`;
  console.log(`\n🔍 Testing ${name}: ${url}`);
  
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      console.log(`${colors.green}✅ SUCCESS${colors.reset} - Status: ${response.statusCode}`);
      
      // Check if response has content
      if (response.data && response.data.trim()) {
        if (endpoint.path === '/') {
          // Check if it's HTML (frontend)
          if (response.data.includes('<html') || response.data.includes('<!DOCTYPE')) {
            console.log(`   Content: HTML page loaded`);
          } else {
            console.log(`   Content: ${response.data.length} characters`);
          }
        } else {
          console.log(`   Content: ${response.data.length} characters`);
        }
      } else {
        console.log(`   Content: Empty response`);
      }
      
      return true;
    } else {
      console.log(`${colors.red}❌ FAILED${colors.reset} - Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
    return false;
  }
}

// Run verification tests
async function runVerification() {
  console.log(`${colors.blue}🚀 WhatsTask Post-Deployment Verification${colors.reset}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`\n${colors.yellow}Testing Frontend Endpoints:${colors.reset}`);
  
  // Test frontend endpoints
  const frontendResults = [];
  for (const test of FRONTEND_TESTS) {
    const success = await testEndpoint(FRONTEND_URL, test, test.name);
    frontendResults.push({ ...test, success });
  }
  
  console.log(`\n${colors.yellow}Testing Backend Endpoints:${colors.reset}`);
  
  // Test backend endpoints
  const backendResults = [];
  for (const test of BACKEND_TESTS) {
    const success = await testEndpoint(BACKEND_URL, test, test.name);
    backendResults.push({ ...test, success });
  }
  
  // Summary
  console.log(`\n${colors.blue}📊 Verification Summary:${colors.reset}`);
  
  const frontendPassed = frontendResults.filter(r => r.success).length;
  const frontendFailed = frontendResults.filter(r => !r.success).length;
  const backendPassed = backendResults.filter(r => r.success).length;
  const backendFailed = backendResults.filter(r => !r.success).length;
  
  console.log(`Frontend: ${colors.green}${frontendPassed} passed${colors.reset}, ${colors.red}${frontendFailed} failed${colors.reset}`);
  console.log(`Backend: ${colors.green}${backendPassed} passed${colors.reset}, ${colors.red}${backendFailed} failed${colors.reset}`);
  
  const totalPassed = frontendPassed + backendPassed;
  const totalFailed = frontendFailed + backendFailed;
  
  if (totalFailed > 0) {
    console.log(`\n${colors.red}❌ Verification failed!${colors.reset}`);
    console.log('Failed tests:');
    [...frontendResults, ...backendResults].filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.path}`);
    });
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All tests passed!${colors.reset}`);
    console.log('Frontend deployment is successful and all endpoints are accessible.');
    console.log(`\n🌐 Frontend is live at: ${FRONTEND_URL}`);
    console.log(`🔗 Backend is accessible at: ${BACKEND_URL}`);
  }
}

// Run the verification
runVerification().catch(error => {
  console.error(`${colors.red}💥 Verification crashed:${colors.reset}`, error);
  process.exit(1);
});
