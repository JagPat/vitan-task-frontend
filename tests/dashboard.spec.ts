import { test, expect } from '@playwright/test'

test('Admin Dashboard Snapshot + Data Verification', async ({ page }) => {
  await page.goto('https://vitan-task-frontend.up.railway.app/admin/dashboard');

  // Wait for the stats grid to load (look for the grid container)
  await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');

  // Wait a bit more for API data to load
  await page.waitForTimeout(2000);

  // Take a full-page screenshot
  await page.screenshot({ path: 'snapshots/admin-dashboard.png', fullPage: true });

  // Grab each stat card's label + value
  const stats = await page.$$eval('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div', cards =>
    cards.map(card => {
      const paragraphs = card.querySelectorAll('p');
      const label = paragraphs[0]?.textContent?.trim();
      const value = paragraphs[1]?.textContent?.trim();
      return { label, value };
    })
  );

  console.log('📊 Stats captured:', stats);

  // Also capture the API response from console logs
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.text().includes('Dashboard quick-stats response:')) {
      consoleLogs.push(msg.text());
    }
  });

  // Assertions
  expect(stats.length).toBe(4); // Should have 4 stat cards
  expect(stats[0].label).toBe('Completion Rate');
  expect(stats[1].label).toBe('Active Projects');
  expect(stats[2].label).toBe('Team Collaboration');
  expect(stats[3].label).toBe('System Health');

  // Log the captured data for verification
  console.log('✅ AdminDashboard Integration Verification:');
  console.log('🔗 URL: https://vitan-task-frontend.up.railway.app/admin/dashboard');
  console.log('📸 Screenshot: snapshots/admin-dashboard.png');
  console.log('📊 Real API Data:', stats);
});
