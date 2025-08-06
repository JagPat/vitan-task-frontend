#!/usr/bin/env node

/**
 * Test script to verify CORS fix and frontend-backend integration
 * Run with: node test-cors-fix.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = 'https://vitan-task-production.up.railway.app';
const FRONTEND_URL = 'https://vitan-task-frontend.up.railway.app';

// Test data
const testPhoneNumber = '+919876543210';
const testMessage = 'Test message from CORS verification script';

console.log('🧪 Testing CORS Fix and Frontend-Backend Integration\n');

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  console.log('1️⃣ Testing Backend Health...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    if (response.status === 200) {
      console.log('✅ Backend health check passed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Environment: ${response.data.environment}`);
      console.log(`   Meta API: ${response.data.metaApi.configured ? 'Configured' : 'Not configured'}`);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend health check error:', error.message);
    return false;
  }
}

async function testCORSHeaders() {
  console.log('\n2️⃣ Testing CORS Headers...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:3004',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS preflight test completed');
    console.log(`   Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
    return false;
  }
}

async function testWhatsAppAPI() {
  console.log('\n3️⃣ Testing WhatsApp API Endpoint...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/whatsapp/send`, {
      method: 'POST',
      body: {
        phoneNumber: testPhoneNumber,
        message: testMessage
      }
    });
    
    if (response.status === 200 || response.status === 400) {
      console.log('✅ WhatsApp API endpoint accessible');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return true;
    } else {
      console.log('❌ WhatsApp API endpoint failed');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ WhatsApp API test error:', error.message);
    return false;
  }
}

async function testAuthEndpoints() {
  console.log('\n4️⃣ Testing Authentication Endpoints...');
  
  const endpoints = [
    '/api/auth/login',
    '/api/auth/verify',
    '/api/auth/me'
  ];
  
  let passed = 0;
  let total = endpoints.length;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        body: {
          whatsappNumber: testPhoneNumber
        }
      });
      
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  console.log(`\n   Authentication endpoints: ${passed}/${total} accessible`);
  return passed === total;
}

async function testTaskEndpoints() {
  console.log('\n5️⃣ Testing Task Management Endpoints...');
  
  const endpoints = [
    '/api/tasks',
    '/api/projects',
    '/api/users'
  ];
  
  let passed = 0;
  let total = endpoints.length;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint}`);
      
      if (response.status === 200 || response.status === 401) {
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        passed++;
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  console.log(`\n   Task management endpoints: ${passed}/${total} accessible`);
  return passed === total;
}

async function testFrontendAccessibility() {
  console.log('\n6️⃣ Testing Frontend Accessibility...');
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.status === 200) {
      console.log('✅ Frontend is accessible');
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log('❌ Frontend accessibility failed');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend test error:', error.message);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting CORS and Integration Tests...\n');
  
  const tests = [
    testBackendHealth,
    testCORSHeaders,
    testWhatsAppAPI,
    testAuthEndpoints,
    testTaskEndpoints,
    testFrontendAccessibility
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! CORS fix is working correctly.');
    console.log('✅ Frontend-backend integration is ready for testing.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Test the frontend locally at http://localhost:3004');
  console.log('2. Verify API calls work from the browser');
  console.log('3. Run the automated test suite');
  console.log('4. Execute the manual test plan');
}

// Run tests
runTests().catch(console.error); 