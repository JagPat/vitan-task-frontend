// Quick Route Verification Script
// Run this in your browser console on the main dashboard page

const routes = [
  '/admin/dashboard',
  '/admin/ai',
  '/admin/tasks',
  '/admin/team',
  '/admin/modules',
  '/admin/contacts',
  '/admin/templates',
  '/admin/projects',
  '/admin/onboarding',
  '/admin/users',
  '/admin/system',
  '/admin/analytics',
  '/admin/shell'
];

console.log('🧪 Starting Route Verification...');
console.log('Base URL: https://vitan-task-frontend.up.railway.app');

routes.forEach((route, index) => {
  const fullUrl = `https://vitan-task-frontend.up.railway.app${route}`;
  console.log(`${index + 1}. ${route}`);
  console.log(`   🔗 ${fullUrl}`);
});

console.log('\n📋 Testing Instructions:');
console.log('1. Open each URL in a new tab');
console.log('2. Take a screenshot of each page');
console.log('3. Check browser console for errors');
console.log('4. Verify layout and functionality');
console.log('5. Document findings in QA report');

console.log('\n✅ Expected Results:');
console.log('- All routes should load without errors');
console.log('- Layout should match expected design');
console.log('- No JavaScript errors in console');
console.log('- All interactive elements should work');
