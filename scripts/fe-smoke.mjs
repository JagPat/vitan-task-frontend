#!/usr/bin/env node

import https from 'https';
import { URL } from 'url';

// Configuration
const BASE_URL = process.env.VITE_API_BASE_URL || 'https://vitan-task-production.up.railway.app';
const ENDPOINTS = [
  '/api/modules',
  '/api/events/stats',
  '/api/modules/whatsapp/health',
  '/api/tasks'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
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
      timeout: 10000,
      headers: {
        'User-Agent': 'WhatsTask-Frontend-Smoke-Test/1.0.0'
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
async function testEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`\n🔍 Testing: ${url}`);
  
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      console.log(`${colors.green}✅ SUCCESS${colors.reset} - Status: ${response.statusCode}`);
      
      // Check if response has data
      if (response.data && response.data.trim()) {
        try {
          const jsonData = JSON.parse(response.data);
          if (jsonData.success !== undefined) {
            console.log(`   Response: ${jsonData.success ? 'Success' : 'Error'}`);
          }
          if (jsonData.data) {
            console.log(`   Data present: Yes`);
          }
        } catch (e) {
          console.log(`   Response: Raw data (${response.data.length} chars)`);
        }
      } else {
        console.log(`   Response: Empty`);
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

// Run smoke test
async function runSmokeTest() {
  console.log(`${colors.yellow}🚀 WhatsTask Frontend Smoke Test${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Testing ${ENDPOINTS.length} endpoints...`);
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const success = await testEndpoint(endpoint);
    results.push({ endpoint, success });
  }
  
  // Summary
  console.log(`\n${colors.yellow}📊 Test Summary:${colors.reset}`);
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`Failed: ${colors.red}${failed}${colors.reset}`);
  
  if (failed > 0) {
    console.log(`\n${colors.red}❌ Smoke test failed!${colors.reset}`);
    console.log('Failed endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.endpoint}`);
    });
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All endpoints are accessible!${colors.reset}`);
    console.log('Frontend can be deployed safely.');
  }
}

// Run the test
runSmokeTest().catch(error => {
  console.error(`${colors.red}💥 Smoke test crashed:${colors.reset}`, error);
  process.exit(1);
});
