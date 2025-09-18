// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const resolvedTestDir = resolve(__dirname, 'tests');
console.log('[playwright-config] testDir =', resolvedTestDir);
try {
  console.log('[playwright-config] tests entries =', fs.readdirSync(resolvedTestDir));
} catch (error) {
  console.warn('[playwright-config] failed to read tests dir', error);
}

export default defineConfig({
  testDir: resolvedTestDir,
  testMatch: /.*\.spec\.(ts|js)/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://vitan-task-frontend.up.railway.app',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
