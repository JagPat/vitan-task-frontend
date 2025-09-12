import { test, expect } from '@playwright/test';

test.describe('Auth UX', () => {
  test('Login page renders Google OAuth UI', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Admin Login')).toBeVisible();
    await expect(page.locator('#google-oauth-button')).toBeVisible();
  });

  test('Protected pages redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/admin/roles');
    await expect(page).toHaveURL(/\/login/);
  });
});

