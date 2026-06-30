import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/retrieval-mc.html');

test('wrong answer is retryable; right answer shows why', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="0"]').check();
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Not quite/);

  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Correct — Secondary sources/);
});

test('check with no selection prompts a selection', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Select an answer/);
});

test('tally counts each question once (denominator stable across retries)', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="0"]').check();
  await page.locator('.te-mc-check').click();           // wrong → total becomes 1
  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();           // right → correct becomes 1
  await expect(page.locator('[data-te-tally]')).toHaveText('Score: 1 / 1');
});

test('no axe violations after feedback shown', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});

test('kit adds role=status and aria-live to .te-mc-feedback by construction', async ({ page }) => {
  await page.goto(fixture);
  const fb = page.locator('.te-mc-feedback');
  await expect(fb).toHaveAttribute('role', 'status');
  await expect(fb).toHaveAttribute('aria-live', 'polite');
});
