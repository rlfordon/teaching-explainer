import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/self-explain.html');

test('reveal disabled until learner writes; then reveals model answer', async ({ page }) => {
  await page.goto(fixture);
  const btn = page.locator('.te-se-reveal');
  await expect(btn).toBeDisabled();
  await page.locator('.te-se-input').fill('grounding limits hallucination');
  await expect(btn).toBeEnabled();
  await btn.click();
  await expect(page.locator('.te-se-model')).toBeVisible();
  await expect(page.locator('.te-se-model')).toBeFocused();
});

test('whitespace-only input does not enable reveal', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-se-input').fill('    ');
  await expect(page.locator('.te-se-reveal')).toBeDisabled();
});

test('no axe violations', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
