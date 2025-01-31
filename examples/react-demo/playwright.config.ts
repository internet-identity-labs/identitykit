import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 120000,
  fullyParallel: true,
  workers: 2,
  retries: 1,
  expect: {
    timeout: 2000,
  },
  use: {
    headless: true,
    viewport: { width: 1440, height: 960 },
    actionTimeout: 0,
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
