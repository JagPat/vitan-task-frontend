import { test, expect, request } from '@playwright/test';

const BACKEND_BASE = process.env.BACKEND_BASE || 'http://localhost:4000';

async function quickLogin(page) {
  await page.goto('/login');
  await page.getByRole('button', { name: /^User$/ }).click();
}

test.describe('Tasks E2E (desktop)', () => {
  test('Create → List → Update → Delete', async ({ page }) => {
    await quickLogin(page);

    const title = `PW Task ${Date.now()}`;

    // Create task via UI
    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill(title);
    await page.getByRole('button', { name: /Create Task/i }).click();

    // Navigate to tasks list
    await page.goto('/tasks');
    await expect(page.getByText(title)).toBeVisible();
    await page.screenshot({ path: 'tests/__screenshots__/tasks-list.png' });

    // Fetch created task id via API
    const ctx = await request.newContext();
    const list = await ctx.get(`${BACKEND_BASE}/api/modules/tasks`);
    const json = await list.json();
    const task = (json.data || []).find((t: any) => t.title === title);
    expect(task).toBeTruthy();

    // Update task via API
    const upd = await ctx.put(`${BACKEND_BASE}/api/modules/tasks/${task.id}`, { data: { status: 'completed' } });
    expect(upd.ok()).toBeTruthy();
    await page.reload();
    // UI shows completed status cell
    await expect(page.getByText('completed')).toBeVisible();

    // Delete via API
    const del = await ctx.delete(`${BACKEND_BASE}/api/modules/tasks/${task.id}`);
    expect(del.ok()).toBeTruthy();
    await page.reload();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});

test.describe('Tasks E2E (mobile)', () => {
  test.use({ viewport: { width: 375, height: 812 } });
  test('Create and list on mobile', async ({ page }) => {
    await quickLogin(page);
    const title = `PW Mobile Task ${Date.now()}`;
    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill(title);
    await page.getByRole('button', { name: /Create Task/i }).click();
    await page.goto('/tasks');
    await expect(page.getByText(title)).toBeVisible();
    await page.screenshot({ path: 'tests/__screenshots__/tasks-create.png' });
  });
});

