import { defineConfig } from '@playwright/test'

const base = process.env.TEST_BASE || '/academy-check/'
export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  expect: { timeout: 10_000 },
  workers: 2,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://127.0.0.1:4178${base}`, browserName: 'chromium', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4178 --strictPort',
    url: `http://127.0.0.1:4178${base}`,
    env: { PAGES_BASE: base },
    reuseExistingServer: false,
    timeout: 120_000,
  },
})