import { test, expect, request } from '@playwright/test';

const BACKEND_BASE = process.env.BACKEND_BASE || 'https://vitan-task-backend-production.up.railway.app';

test('WhatsApp incoming intent creates structured response', async () => {
  const ctx = await request.newContext();
  const res = await ctx.post(`${BACKEND_BASE}/api/modules/whatsapp/incoming`, {
    data: { from: 'playwright', text: 'Create task follow up with team' }
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.success).toBeTruthy();
  expect(json.data.intent).toBeDefined();
  expect(typeof json.data.message).toBe('string');
});

