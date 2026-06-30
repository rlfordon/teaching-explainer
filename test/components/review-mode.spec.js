import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/review-mode.html');
const editFixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/review-mode-edit.html');

// Helper: collect the dialog's visible focusables in DOM order, in-page.
const VISIBLE_FOCUSABLES = () => {
  const d = document.querySelector('[role="dialog"]');
  return [...d.querySelectorAll(
    'button,textarea,[href],input,select,[tabindex]:not([tabindex="-1"])'
  )].filter((el) => el.getClientRects().length > 0);
};

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

test('Tab wraps forward and Shift+Tab wraps backward (focus trap, both directions)', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();

  const count = await page.evaluate((fn) => eval(`(${fn})`)().length, VISIBLE_FOCUSABLES.toString());
  expect(count).toBeGreaterThan(1);

  // Forward wrap: focus last, Tab -> first.
  await page.evaluate((fn) => { const f = eval(`(${fn})`)(); f[f.length - 1].focus(); }, VISIBLE_FOCUSABLES.toString());
  await page.keyboard.press('Tab');
  const onFirst = await page.evaluate((fn) => {
    const f = eval(`(${fn})`)();
    return document.activeElement === f[0];
  }, VISIBLE_FOCUSABLES.toString());
  expect(onFirst).toBe(true);

  // Backward wrap: focus first, Shift+Tab -> last.
  await page.evaluate((fn) => { const f = eval(`(${fn})`)(); f[0].focus(); }, VISIBLE_FOCUSABLES.toString());
  await page.keyboard.press('Shift+Tab');
  const onLast = await page.evaluate((fn) => {
    const f = eval(`(${fn})`)();
    return document.activeElement === f[f.length - 1];
  }, VISIBLE_FOCUSABLES.toString());
  expect(onLast).toBe(true);
});

test('mode switching toggles contentEditable and aria-pressed', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();

  const editBtn = page.locator('[data-te-mode="edit"]');
  const previewBtn = page.locator('[data-te-mode="preview"]');

  await editBtn.click();
  await expect(editBtn).toHaveAttribute('aria-pressed', 'true');
  const editableInEdit = await page.evaluate(() =>
    [...document.querySelectorAll('[data-te-edit]')].every((el) => el.isContentEditable));
  expect(editableInEdit).toBe(true);

  await previewBtn.click();
  await expect(previewBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(editBtn).toHaveAttribute('aria-pressed', 'false');
  const editableInPreview = await page.evaluate(() =>
    [...document.querySelectorAll('[data-te-edit]')].some((el) => el.isContentEditable));
  expect(editableInPreview).toBe(false);
});

test('Copy notes for LLM invokes clipboard with the brief text', async ({ page }) => {
  await page.goto(fixture);
  await page.evaluate(() => {
    try { localStorage.removeItem('te-review-notes'); } catch (e) {}
    window.__copied = null;
    navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
  });
  await page.locator('[data-te-review-launch]').click();

  // Add a note first so the brief is non-trivial.
  await page.locator('[data-te-mode="note"]').click();
  await page.locator('[data-te-review-note-input]').fill('Clarify the intro paragraph.');
  await page.locator('[data-te-review-note-save]').click();

  await page.locator('[data-te-review-copy]').click();
  const copied = await page.evaluate(() => window.__copied);
  expect(copied).toContain('Revision requests');
  expect(copied).toContain('Clarify the intro paragraph.');
});

test('Download edits produces a download', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-te-review-download]').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/-edited\.html$/);
});

test('Add note saves and persists across reload (localStorage round-trip)', async ({ page }) => {
  await page.goto(fixture);
  // Clear once at the start; do NOT use an init script (it would re-run on reload).
  await page.evaluate(() => { try { localStorage.removeItem('te-review-notes'); } catch (e) {} });

  await page.locator('[data-te-review-launch]').click();
  await page.locator('[data-te-mode="note"]').click();
  await page.locator('[data-te-review-note-input]').fill('Persisted note about figure 2.');
  await page.locator('[data-te-review-note-save]').click();

  const stored = await page.evaluate(() => localStorage.getItem('te-review-notes'));
  expect(stored).toContain('Persisted note about figure 2.');

  // Reload: a fresh script instance must load the note from localStorage.
  await page.reload();
  await page.locator('[data-te-review-launch]').click();
  await page.evaluate(() => {
    window.__copied = null;
    navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
  });
  await page.locator('[data-te-review-copy]').click();
  const copied = await page.evaluate(() => window.__copied);
  expect(copied).toContain('Persisted note about figure 2.');
});

test('?edit auto-opens the dialog without clicking the launcher', async ({ page }) => {
  await page.goto(editFixture + '?edit');
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
});
