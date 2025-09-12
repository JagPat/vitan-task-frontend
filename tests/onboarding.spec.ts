import { test, expect, request } from '@playwright/test';

const BACKEND_BASE = process.env.BACKEND_BASE || 'https://vitan-task-backend-production.up.railway.app';

test('Onboarding preferences POST → GET roundtrip', async () => {
  const ctx = await request.newContext();
  const email = `tester_${Date.now()}@demo.local`;

  const post = await ctx.post(`${BACKEND_BASE}/api/modules/onboarding/preferences`, {
    data: { email, preferred_language: 'en', answers: { use_case: 'Testing onboarding' } }
  });
  expect(post.ok()).toBeTruthy();

  const get = await ctx.get(`${BACKEND_BASE}/api/modules/onboarding/preferences?email=${encodeURIComponent(email)}`);
  expect(get.ok()).toBeTruthy();
  const json = await get.json();
  expect(json.success).toBeTruthy();
});

