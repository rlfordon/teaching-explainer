import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/predict-reveal.html');

test('answer hidden until reveal; reveal updates state, focus, a11y', async ({ page }) => {
  await page.goto(fixture);
  const answer = page.locator('.te-pr-answer');
  await expect(answer).toBeHidden();

  const btn = page.locator('.te-pr-reveal');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await btn.click();

  await expect(answer).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(answer).toBeFocused();
});

test('keyboard: reveal is operable via Enter', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-pr-reveal').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.te-pr-answer')).toBeVisible();
});

test('no axe violations before and after reveal', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
  await page.locator('.te-pr-reveal').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
