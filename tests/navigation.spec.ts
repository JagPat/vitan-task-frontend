import { test, expect } from '@playwright/test';
import './_hooks';

const SCREENSHOT_DIR = 'tests/screenshots';

async function quickLogin(page, role: 'user' | 'admin') {
  const btnName = role === 'admin' ? 'Admin' : 'User';
  await page.goto('/login');
  // Try dev quick-login button first (available when built with NO_AUTH)
  const btn = page.getByRole('button', { name: btnName, exact: true });
  try {
    await btn.waitFor({ state: 'visible', timeout: 1200 });
    await btn.click();
    await page.waitForLoadState('networkidle');
    return;
  } catch {
    // Fallback: craft a minimal unsigned JWT that jwt_decode can parse in production
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60; // +1h
    const u = role === 'admin'
      ? { email: 'admin@demo.local', role: 'admin', name: 'Admin' }
      : { email: 'user@demo.local', role: 'user', name: 'User' };

    function b64url(obj: any) {
      const json = JSON.stringify(obj);
      return Buffer.from(json).toString('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
    }
    const header = { alg: 'none', typ: 'JWT' };
    const payload = { userId: 'dev', email: u.email, role: u.role, loginMethod: 'dev', exp };
    const token = `${b64url(header)}.${b64url(payload)}.`;

    await page.addInitScript((args) => {
      const { token, role, user } = args as any;
      // Ensure no stale admin state when logging in as user
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (role === 'admin') {
        localStorage.setItem('adminToken', token);
      } else {
        localStorage.setItem('userToken', token);
      }
      // Optional convenience for UI-only state
      localStorage.setItem('authUser', JSON.stringify({ ...user, token }));
    }, { token, role, user: u });

    await page.goto(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Navigation bar', () => {
  test('User role sees user links only', async ({ page }) => {
    await quickLogin(page, 'user');

    try {
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
    } finally {
      // Explicit named screenshot (CI artifact target)
      await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-user.png` });
    }
  });

  test('Admin role sees both user and admin links', async ({ page }) => {
    await quickLogin(page, 'admin');

    try {
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
    } finally {
      // Explicit named screenshot (CI artifact target)
      await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-admin.png` });
    }
  });
});
