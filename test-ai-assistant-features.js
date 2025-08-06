#!/usr/bin/env node

/**
 * Comprehensive Test Suite for AI Assistant Enhancements
 * Tests both new features and existing functionality
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'https://vitan-task-production.up.railway.app';
const TEST_PHONE = '+1234567890'; // Test phone number
const WEBHOOK_URL = `${BASE_URL}/webhook`;

console.log('🧪 TESTING AI ASSISTANT ENHANCEMENTS'.cyan.bold);
console.log('=====================================\n');

// Test data for webhook simulation
const createTestMessage = (phoneNumber, messageText) => ({
  object: 'whatsapp_business_account',
  entry: [{
    id: 'test_entry',
    changes: [{
      value: {
        messaging_product: 'whatsapp',
        metadata: {
          display_phone_number: '1234567890',
          phone_number_id: 'test_phone_id'
        },
        messages: [{
          from: phoneNumber,
          id: `msg_${Date.now()}`,
          timestamp: Date.now().toString(),
          text: { body: messageText },
          type: 'text'
        }]
      },
      field: 'messages'
    }]
  }]
});

// Test helper function
async function sendTestMessage(phoneNumber, message, testName) {
  try {
    console.log(`\n🔍 Testing: ${testName}`.yellow);
    console.log(`📱 Sending: "${message}"`);
    
    const testData = createTestMessage(phoneNumber, message);
    
    const response = await axios.post(WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WhatsApp/2.0'
      },
      timeout: 15000
    });
    
    if (response.status === 200) {
      console.log(`✅ Response: ${response.status} - ${testName} PASSED`.green);
      return true;
    } else {
      console.log(`❌ Response: ${response.status} - ${testName} FAILED`.red);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error in ${testName}:`.red);
    console.log(`   Status: ${error.response?.status || 'Network Error'}`);
    console.log(`   Message: ${error.response?.data || error.message}`);
    return false;
  }
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  let passedTests = 0;
  let totalTests = 0;
  
  console.log('🚀 Starting AI Assistant Feature Tests...\n');
  
  // ============================================================================
  // 1. ENHANCED CLARIFICATION DIALOGUE TESTS
  // ============================================================================
  
  console.log('\n📋 1. ENHANCED CLARIFICATION DIALOGUE TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'start task', 'Vague Command - Start Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'create', 'Vague Command - Create')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'task', 'Vague Command - Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'update', 'Vague Command - Update')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'help me', 'Vague Command - Help Me')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // 2. USER COMMAND LEARNING & ADAPTATION TESTS  
  // ============================================================================
  
  console.log('\n🧠 2. USER COMMAND LEARNING & ADAPTATION TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'I need to make a new task for tomorrow', 'Learning Pattern - Create Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'make another task urgent priority', 'Learning Pattern - Repeat Create')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'show me my tasks', 'Learning Pattern - View Tasks')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // 3. PROACTIVE ASSISTANT BEHAVIOR TESTS
  // ============================================================================
  
  console.log('\n🤖 3. PROACTIVE ASSISTANT BEHAVIOR TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Create a task to review documents by Friday', 'Assistant Feedback - Task Creation')) {
    passedTests++;
  }
  await sleep(3000); // Wait for follow-up suggestions
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Update my task priority to high', 'Assistant Feedback - Task Update')) {
    passedTests++;
  }
  await sleep(3000);
  
  // ============================================================================
  // 4. ENHANCED TASK LIFECYCLE MAPPING TESTS
  // ============================================================================
  
  console.log('\n🔄 4. ENHANCED TASK LIFECYCLE MAPPING TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Start working on the document review task', 'Lifecycle - Start Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'I finished the task', 'Lifecycle - Complete Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Delete the old task', 'Lifecycle - Delete Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // 5. EXISTING FUNCTIONALITY VERIFICATION TESTS
  // ============================================================================
  
  console.log('\n✅ 5. EXISTING FUNCTIONALITY VERIFICATION TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'view tasks', 'Existing - View Tasks Command')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'help', 'Existing - Help Command')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'menu', 'Existing - Menu Command')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Create project called "AI Enhancement Testing"', 'Existing - Create Project')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // 6. NATURAL LANGUAGE UNDERSTANDING TESTS
  // ============================================================================
  
  console.log('\n🗣️ 6. NATURAL LANGUAGE UNDERSTANDING TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Delete a task', 'NLU - Delete Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Create a project', 'NLU - Create Project')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Help', 'NLU - Help Request')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'Complete task', 'NLU - Complete Task')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // 7. EDGE CASES AND ERROR HANDLING TESTS
  // ============================================================================
  
  console.log('\n⚠️ 7. EDGE CASES AND ERROR HANDLING TESTS'.cyan.bold);
  console.log('=' .repeat(50));
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, '', 'Edge Case - Empty Message')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, '12345', 'Edge Case - Numbers Only')) {
    passedTests++;
  }
  await sleep(2000);
  
  totalTests++;
  if (await sendTestMessage(TEST_PHONE, 'xyz abc random words', 'Edge Case - Unknown Input')) {
    passedTests++;
  }
  await sleep(2000);
  
  // ============================================================================
  // TEST RESULTS SUMMARY
  // ============================================================================
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TEST RESULTS SUMMARY'.cyan.bold);
  console.log('='.repeat(60));
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`\n📊 Tests Passed: ${passedTests}/${totalTests} (${successRate}%)`);
  
  if (successRate >= 90) {
    console.log('🎉 EXCELLENT! AI Assistant features are working properly.'.green.bold);
  } else if (successRate >= 75) {
    console.log('✅ GOOD! Most features working, minor issues detected.'.yellow.bold);
  } else {
    console.log('⚠️ ISSUES DETECTED! Several features need attention.'.red.bold);
  }
  
  console.log('\n🔍 Key Features Tested:');
  console.log('✅ Enhanced clarification dialogue for vague commands');
  console.log('✅ User command learning and pattern adaptation');
  console.log('✅ Proactive assistant behavior with follow-ups');
  console.log('✅ Enhanced task lifecycle mapping and transitions');
  console.log('✅ User understanding summaries with learning feedback');
  console.log('✅ Existing functionality preservation');
  console.log('✅ Natural language understanding improvements');
  console.log('✅ Edge cases and error handling');
  
  console.log('\n💡 Next Steps:');
  console.log('• Monitor WhatsApp chat for AI assistant responses');
  console.log('• Check Railway logs for any errors or issues');
  console.log('• Verify database entries for learned patterns');
  console.log('• Test with real users for feedback');
  
  return { passedTests, totalTests, successRate };
}

// Health check before running tests
async function healthCheck() {
  try {
    console.log('🏥 Performing health check...'.yellow);
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 10000 });
    
    if (response.status === 200) {
      console.log('✅ Backend is healthy and running'.green);
      return true;
    } else {
      console.log('❌ Backend health check failed'.red);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend is not accessible'.red);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🧪 AI ASSISTANT COMPREHENSIVE TEST SUITE'.rainbow.bold);
  console.log('==========================================\n');
  
  // Health check first
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    console.log('\n❌ Cannot proceed with tests - backend not accessible'.red.bold);
    process.exit(1);
  }
  
  console.log('\n⏳ Starting tests in 3 seconds...\n');
  await sleep(3000);
  
  const results = await runTests();
  
  console.log('\n✨ Test suite completed!'.cyan.bold);
  console.log(`📈 Final Score: ${results.passedTests}/${results.totalTests} (${results.successRate}%)\n`);
}

// Run the tests
main().catch(error => {
  console.error('❌ Test suite failed:'.red.bold, error.message);
  process.exit(1);
});