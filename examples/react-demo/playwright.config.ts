import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 180000,
  fullyParallel: true,
  workers: 1,
  retries: 2,
  expect: {
    timeout: 2000,
  },
  use: {
    headless: true,
    viewport: { width: 1440, height: 960 },
    // No single action or navigation may wait longer than 30 s
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    baseURL: "http://localhost:3002",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
})
