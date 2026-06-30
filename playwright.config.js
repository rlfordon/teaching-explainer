import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/components',
  use: { headless: true },
  reporter: 'list',
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
