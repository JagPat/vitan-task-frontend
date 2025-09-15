import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/__screenshots__';

async function devLogin(page, role: 'user' | 'admin') {
  await page.goto('/login');
  // Dev quick login by setting localStorage directly
  const baseUser = { email: role === 'admin' ? 'admin@demo.local' : 'user@demo.local', role: role === 'admin' ? 'admin' : 'user', name: role === 'admin' ? 'Admin' : 'User' };
  await page.addInitScript((u) => {
    localStorage.setItem('adminToken', 'dev-token');
    localStorage.setItem('adminUser', JSON.stringify(u));
  }, baseUser);
  // Reload to pick up localStorage
  await page.reload();
  await page.goto(role === 'admin' ? '/admin/dashboard' : '/dashboard');
}

test.describe('Navigation bar', () => {
  test('User role sees user links only', async ({ page }) => {
    await devLogin(page, 'user');

    await expect(page.getByTestId('nav-link-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-link-tasks')).toBeVisible();
    await expect(page.getByTestId('nav-link-projects')).toBeVisible();
    await expect(page.getByTestId('nav-link-profile')).toBeVisible();
    await expect(page.getByTestId('nav-link-onboarding')).toBeVisible();
    await expect(page.getByTestId('nav-link-create-task')).toBeVisible();

    await expect(page.getByTestId('nav-link-admin-dashboard')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-roles')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-settings')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-analytics')).toHaveCount(0);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-user.png` });
  });

  test('Admin role sees both user and admin links', async ({ page }) => {
    await devLogin(page, 'admin');

    await expect(page.getByTestId('nav-link-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-link-tasks')).toBeVisible();
    await expect(page.getByTestId('nav-link-projects')).toBeVisible();
    await expect(page.getByTestId('nav-link-profile')).toBeVisible();
    await expect(page.getByTestId('nav-link-onboarding')).toBeVisible();
    await expect(page.getByTestId('nav-link-create-task')).toBeVisible();

    await expect(page.getByTestId('nav-link-admin-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-link-admin-roles')).toBeVisible();
    await expect(page.getByTestId('nav-link-admin-settings')).toBeVisible();
    await expect(page.getByTestId('nav-link-admin-analytics')).toBeVisible();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-admin.png` });
  });
});
