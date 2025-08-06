import axios from 'axios';
import fs from 'fs';

// Backend API Testing for Railway Deployment
const BASE_URL = 'https://vitan-task-production.up.railway.app';

class BackendAPITester {
  constructor() {
    this.results = [];
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
  }

  async logTest(name, success, details = '') {
    this.testCount++;
    if (success) {
      this.passCount++;
      console.log(`✅ ${name}: PASSED`);
    } else {
      this.failCount++;
      console.log(`❌ ${name}: FAILED - ${details}`);
    }
    this.results.push({ name, success, details });
  }

  async testHealthCheck() {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      const success = response.status === 200 && response.data.status === 'OK';
      await this.logTest('Health Check', success, `Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
      return success;
    } catch (error) {
      await this.logTest('Health Check', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testTasksAPI() {
    try {
      // Test GET /api/tasks
      const getResponse = await axios.get(`${BASE_URL}/api/tasks`);
      const getSuccess = getResponse.status === 200;
      await this.logTest('GET /api/tasks', getSuccess, `Status: ${getResponse.status}, Count: ${getResponse.data?.length || 0}`);

      // Test POST /api/tasks
      const taskData = {
        title: 'Test Task from API',
        description: 'This is a test task created via API',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const postResponse = await axios.post(`${BASE_URL}/api/tasks`, taskData);
      const postSuccess = postResponse.status === 201 || postResponse.status === 200;
      await this.logTest('POST /api/tasks', postSuccess, `Status: ${postResponse.status}`);

      return getSuccess && postSuccess;
    } catch (error) {
      await this.logTest('Tasks API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testUsersAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      const success = response.status === 200;
      await this.logTest('GET /api/users', success, `Status: ${response.status}, Count: ${response.data?.length || 0}`);
      return success;
    } catch (error) {
      await this.logTest('Users API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testProjectsAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/projects`);
      const success = response.status === 200;
      await this.logTest('GET /api/projects', success, `Status: ${response.status}, Count: ${response.data?.length || 0}`);
      return success;
    } catch (error) {
      await this.logTest('Projects API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testTemplatesAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/templates`);
      const success = response.status === 200;
      await this.logTest('GET /api/templates', success, `Status: ${response.status}, Count: ${response.data?.length || 0}`);
      return success;
    } catch (error) {
      await this.logTest('Templates API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testAnalyticsAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/analytics/tasks`);
      const success = response.status === 200;
      await this.logTest('GET /api/analytics/tasks', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      await this.logTest('Analytics API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testWhatsAppAPI() {
    try {
      // Test WhatsApp send endpoint
      const messageData = {
        phoneNumber: '+1234567890',
        message: 'Test message from API'
      };

      const response = await axios.post(`${BASE_URL}/api/whatsapp/send`, messageData);
      const success = response.status === 200 || response.status === 400; // 400 is expected for invalid number
      await this.logTest('POST /api/whatsapp/send', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      await this.logTest('WhatsApp API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testContactsAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/contacts`);
      const success = response.status === 200;
      await this.logTest('GET /api/contacts', success, `Status: ${response.status}, Count: ${response.data?.length || 0}`);
      return success;
    } catch (error) {
      await this.logTest('Contacts API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testTeamAPI() {
    try {
      const response = await axios.get(`${BASE_URL}/api/team`);
      const success = response.status === 200;
      await this.logTest('GET /api/team', success, `Status: ${response.status}, Count: ${response.data?.length || 0}`);
      return success;
    } catch (error) {
      await this.logTest('Team API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testAIAPI() {
    try {
      const aiData = {
        command: 'Create a test task',
        userId: 'test-user'
      };

      const response = await axios.post(`${BASE_URL}/api/ai/process`, aiData);
      const success = response.status === 200;
      await this.logTest('POST /api/ai/process', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      await this.logTest('AI API', false, `Error: ${error.message}`);
      return false;
    }
  }

  async testErrorHandling() {
    try {
      // Test 404 endpoint
      const response = await axios.get(`${BASE_URL}/api/nonexistent`);
      await this.logTest('404 Error Handling', false, 'Expected 404 but got success');
      return false;
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTest('404 Error Handling', success, `Status: ${error.response?.status || 'No response'}`);
      return success;
    }
  }

  async testCORS() {
    try {
      const response = await axios.options(`${BASE_URL}/api/tasks`);
      const success = response.status === 200 || response.status === 204;
      await this.logTest('CORS Headers', success, `Status: ${response.status}`);
      return success;
    } catch (error) {
      await this.logTest('CORS Headers', false, `Error: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Backend API Testing for Railway Deployment');
    console.log(`📍 Target URL: ${BASE_URL}`);
    console.log('='.repeat(60));

    const tests = [
      this.testHealthCheck(),
      this.testTasksAPI(),
      this.testUsersAPI(),
      this.testProjectsAPI(),
      this.testTemplatesAPI(),
      this.testAnalyticsAPI(),
      this.testWhatsAppAPI(),
      this.testContactsAPI(),
      this.testTeamAPI(),
      this.testAIAPI(),
      this.testErrorHandling(),
      this.testCORS()
    ];

    await Promise.all(tests);

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.testCount}`);
    console.log(`Passed: ${this.passCount}`);
    console.log(`Failed: ${this.failCount}`);
    console.log(`Success Rate: ${((this.passCount / this.testCount) * 100).toFixed(1)}%`);

    return {
      total: this.testCount,
      passed: this.passCount,
      failed: this.failCount,
      successRate: (this.passCount / this.testCount) * 100,
      results: this.results
    };
  }
}

// Run the tests
async function main() {
  const tester = new BackendAPITester();
  const results = await tester.runAllTests();
  
  // Save results to file
  fs.writeFileSync('testsprite_tests/backend-test-results.json', JSON.stringify(results, null, 2));
  
  console.log('\n✅ Backend API testing completed!');
  console.log('📄 Results saved to: testsprite_tests/backend-test-results.json');
}

main().catch(console.error); 