import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/step-through.html');

test('shows one step, advances, moves focus, bounds buttons', async ({ page }) => {
  await page.goto(fixture);
  await expect(page.locator('.te-st-progress')).toHaveText('Step 1 of 2');
  await expect(page.locator('.te-st-prev')).toBeDisabled();

  await page.locator('.te-st-next').click();
  await expect(page.locator('.te-st-progress')).toHaveText('Step 2 of 2');
  await expect(page.locator('.te-st-step').nth(1).locator('h3')).toBeFocused();
  await expect(page.locator('.te-st-next')).toBeDisabled();
});

test('no axe violations on each step', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
  await page.locator('.te-st-next').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
