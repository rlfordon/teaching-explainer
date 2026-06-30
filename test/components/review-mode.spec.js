import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/review-mode.html');

test('launcher opens an aria-modal dialog; Esc closes and restores focus', async ({ page }) => {
  await page.goto(fixture);
  const launch = page.locator('[data-te-review-launch]');
  await launch.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(launch).toBeFocused();
});

test('focus is trapped inside the dialog while open', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();
  const focusedInDialog = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d.contains(document.activeElement);
  });
  expect(focusedInDialog).toBe(true);
});

test('no axe violations with dialog open', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();
  expect((await runAxe(page, 'body')).violations).toEqual([]);
});
