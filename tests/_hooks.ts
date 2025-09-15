import { test } from '@playwright/test';

function toSafeName(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

test.afterEach(async ({ page }, testInfo) => {
  try {
    const safe = toSafeName(testInfo.title);
    await page.screenshot({ path: `tests/screenshots/${safe}.png`, fullPage: true });
  } catch {
    // best-effort; ignore errors capturing screenshots
  }
});


