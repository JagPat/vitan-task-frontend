import { test, expect } from '@playwright/test';
import './_hooks';

const SCREENSHOT_DIR = 'tests/screenshots';

async function quickLogin(page, role: 'user' | 'admin') {
  const btnName = role === 'admin' ? 'Admin' : 'User';
  await page.goto('/login');
  // Try dev quick-login button first (available when built with NO_AUTH)
  const btn = page.getByRole('button', { name: btnName, exact: true });
  try {
    await btn.waitFor({ state: 'visible', timeout: 1000 });
    await btn.click();
    await page.waitForLoadState('networkidle');
    return;
  } catch {
    // Fallback: set token/user in localStorage and navigate directly
    const user = role === 'admin'
      ? { email: 'admin@demo.local', role: 'admin', name: 'Admin' }
      : { email: 'user@demo.local', role: 'user', name: 'User' };
    await page.addInitScript((u) => {
      localStorage.setItem('adminToken', 'dev-token');
      localStorage.setItem('adminUser', JSON.stringify(u));
    }, user);
    await page.goto(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Navigation bar', () => {
  test('User role sees user links only', async ({ page }) => {
    await quickLogin(page, 'user');

    await expect(page.getByTestId('nav-link-dashboard')).toBeVisible();
    await expect(page.getByTestId('nav-link-tasks')).toBeVisible();
    await expect(page.getByTestId('nav-link-projects')).toBeVisible();
    await expect(page.getByTestId('nav-link-profile')).toBeVisible();
    await expect(page.getByTestId('nav-link-onboarding')).toBeVisible();
    await expect(page.getByTestId('nav-link-create-task')).toBeVisible();

    // Admin links should not exist for normal user
    await expect(page.getByTestId('nav-link-admin-dashboard')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-roles')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-settings')).toHaveCount(0);
    await expect(page.getByTestId('nav-link-admin-analytics')).toHaveCount(0);

    // Explicit named screenshot (CI artifact target)
    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-user.png` });
  });

  test('Admin role sees both user and admin links', async ({ page }) => {
    await quickLogin(page, 'admin');

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

    // Explicit named screenshot (CI artifact target)
    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-admin.png` });
  });
});
