import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/classify.html');

test('correct classification via keyboard; wrong is corrected', async ({ page }) => {
  await page.goto(fixture);
  const article = page.locator('.te-cl-item', { hasText: 'law review' });
  await article.click();
  await expect(article).toHaveAttribute('aria-pressed', 'true');

  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();   // wrong
  await expect(page.locator('.te-cl-feedback')).toHaveText(/Not quite/);

  await page.locator('.te-cl-cat', { hasText: 'Secondary' }).click(); // right
  await expect(article).toHaveAttribute('aria-disabled', 'true');
});

test('category click with nothing selected prompts selection', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();
  await expect(page.locator('.te-cl-feedback')).toHaveText(/Select an item/);
});

test('sorting all items shows completion; no axe violations', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-cl-item', { hasText: 'law review' }).click();
  await page.locator('.te-cl-cat', { hasText: 'Secondary' }).click();
  await page.locator('.te-cl-item', { hasText: 'statute' }).click();
  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();
  await expect(page.locator('.te-cl-feedback')).toHaveText('All sorted.');
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
