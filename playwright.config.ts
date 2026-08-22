import { defineConfig, devices } from "@playwright/test";
import { getLocalPlaywrightHost } from "./playwright.config.helpers";

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3100";
const parsedBaseURL = new URL(baseURL);
const localHost = getLocalPlaywrightHost(baseURL);
const port = parsedBaseURL.port || "80";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: {
    timeout: 5_000,
  },
  timeout: 30_000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // External targets are already running; local targets use the configured host and port.
  webServer: localHost
    ? {
        command: `npm run start -- --hostname ${localHost} --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
