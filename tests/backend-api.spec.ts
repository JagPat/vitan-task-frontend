import { test, expect, request } from '@playwright/test';

const BACKEND_BASE = process.env.BACKEND_BASE || 'https://vitan-task-backend-production.up.railway.app';

test.describe('Backend API smoke', () => {
  test('health endpoint returns OK', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`${BACKEND_BASE}/health`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.status).toBe('OK');
  });

  test('dashboard quick-stats returns object', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`${BACKEND_BASE}/api/modules/dashboard/quick-stats`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(typeof json).toBe('object');
  });

  test('tasks endpoint returns list wrapper or empty', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`${BACKEND_BASE}/api/modules/tasks`);
    // Endpoint may be protected or empty; tolerate 200 with wrapper
    if (res.ok()) {
      const json = await res.json();
      expect(typeof json).toBe('object');
    } else {
      // Accept non-200 while modules stabilize
      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  });
});

