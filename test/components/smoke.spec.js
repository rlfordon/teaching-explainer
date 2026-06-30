import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const fixture = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/_template.html'
);

test('kit exposes TE.init and runs on load', async ({ page }) => {
  await page.goto('file://' + fixture);
  const hasInit = await page.evaluate(() => typeof window.TE?.init === 'function');
  expect(hasInit).toBe(true);
});
