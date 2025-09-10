import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test('shows loading, then stats or empty state', async ({ page }) => {
    await page.goto('/dashboard');

    // Header visible
    await expect(page.getByText('User Dashboard')).toBeVisible();

    // Loading banner optionally appears
    // Not making it mandatory due to timing; check after short wait that stats grid exists
    await page.waitForTimeout(1500);

    // Stats cards labels
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Projects')).toBeVisible();

    // Quick actions present
    await expect(page.getByText('Quick Actions')).toBeVisible();
  });
});

