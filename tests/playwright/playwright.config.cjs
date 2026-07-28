const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

const repoRoot = path.resolve(__dirname, '../..');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5176';

const webServer = process.env.BASE_URL
  ? undefined
  : {
      command: 'sh -c "npm install -g pnpm && pnpm dev --host 127.0.0.1 --port 5176"',
      cwd: repoRoot,
      url: 'http://127.0.0.1:5176',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    };

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  webServer,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
