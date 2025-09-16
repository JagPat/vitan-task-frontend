import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/__screenshots__';

test.beforeEach(async ({ page }) => {
  // Dev quick login as super_admin
  await page.addInitScript(() => {
    localStorage.setItem('adminToken', 'dev-token');
    localStorage.setItem('adminUser', JSON.stringify({ email: 'superadmin@demo.local', role: 'super_admin', name: 'Super Admin' }));
  });
});

test.describe('Admin actions navigation', () => {
  test('User Management navigates to /admin/roles', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.getByTestId('admin-action-users').click();
    await expect(page).toHaveURL(/\/admin\/roles$/);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-roles-nav.png` });
  });

  test('System Settings navigates and loads status', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.getByTestId('admin-action-settings').click();
    await expect(page).toHaveURL(/\/admin\/settings$/);
    await expect(page.getByText('System Settings')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-settings.png` });
  });

  test('Analytics navigates and loads performance + logs', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.getByTestId('admin-action-analytics').click();
    await expect(page).toHaveURL(/\/admin\/analytics$/);
    await expect(page.getByText('System Logs & Analytics')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/admin-analytics.png` });
  });
});




