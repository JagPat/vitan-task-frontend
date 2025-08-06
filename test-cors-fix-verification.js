const puppeteer = require('puppeteer');

async function testCorsFix() {
  console.log('🧪 Testing CORS Fix Verification...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable request interception to monitor API calls
    await page.setRequestInterception(true);
    
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('vitan-task-production.up.railway.app')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
      request.continue();
    });
    
    // Navigate to the frontend
    console.log('📱 Loading frontend at http://localhost:3003...');
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });
    
    // Wait a bit for any initial API calls
    await page.waitForTimeout(3000);
    
    console.log('\n📊 API Calls Detected:');
    apiCalls.forEach((call, index) => {
      console.log(`${index + 1}. ${call.method} ${call.url}`);
      console.log(`   Headers: ${JSON.stringify(call.headers, null, 2)}`);
    });
    
    // Check for any console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(2000);
    
    console.log('\n🚨 Console Errors:');
    if (errors.length === 0) {
      console.log('✅ No console errors detected!');
    } else {
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Test a specific API call
    console.log('\n🔍 Testing direct API call...');
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('https://vitan-task-production.up.railway.app/api/tasks', {
          credentials: 'include'
        });
        return {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries())
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('API Response:', response);
    
    if (response.ok) {
      console.log('✅ CORS fix is working! Frontend can communicate with backend.');
    } else {
      console.log('❌ CORS issue still exists:', response);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCorsFix().catch(console.error); 