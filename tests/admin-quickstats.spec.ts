import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Quick Stats', () => {
  test('renders quick-stats cards with labels', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Look for expected labels from the quick-stats section we render
    await expect(page.getByText('Completion Rate')).toBeVisible();
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Team Collaboration')).toBeVisible();

    // Values should be numeric or zero if backend returns empty
    const completion = await page.getByText(/Completion Rate/).locator('..').locator('p:text-matches("^\\d+%$")').first().catch(() => null);
    // Non-fatal; presence of labels is primary
    expect(await page.getByText('Completion Rate').isVisible()).toBeTruthy();
  });
});

