import { test, expect } from '@playwright/test';

test.describe('Mobile UX', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Login screen renders on mobile', async ({ page }) => {
    await page.goto('/login');
    // Header or title present
    await expect(page.getByText('Admin Login')).toBeVisible();
    // Google button container present
    await expect(page.locator('#google-oauth-button')).toBeVisible();
  });

  test('Navbar shows login when unauthenticated', async ({ page }) => {
    await page.goto('/');
    // If unauthenticated, nav shows Login button
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });
});

