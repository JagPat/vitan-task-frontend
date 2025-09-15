import { test, expect } from '@playwright/test';
import './_hooks';

const SCREENSHOT_DIR = 'tests/__screenshots__';

async function quickLoginViaButtons(page, role: 'user' | 'admin') {
  await page.goto('/login');
  // Use the dev quick login buttons rendered by GoogleOAuthLogin when VITE_NO_AUTH=true
  const btnName = role === 'admin' ? 'Admin' : 'User';
  await page.getByRole('button', { name: btnName, exact: true }).click();
  // Buttons navigate automatically; wait for destination
  await page.waitForLoadState('networkidle');
}

test.describe('Navigation bar', () => {
  test('User role sees user links only', async ({ page }) => {
    await quickLoginViaButtons(page, 'user');

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

    // Explicit named screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-user.png` });
  });

  test('Admin role sees both user and admin links', async ({ page }) => {
    await quickLoginViaButtons(page, 'admin');

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

    // Explicit named screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/nav-admin.png` });
  });
});
