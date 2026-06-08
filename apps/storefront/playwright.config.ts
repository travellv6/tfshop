import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.BASE_URL || "http://127.0.0.1:8000"
const shouldStartLocalServer =
  !process.env.BASE_URL ||
  baseURL.includes("127.0.0.1") ||
  baseURL.includes("localhost")

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: shouldStartLocalServer
    ? {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: "pipe",
        stderr: "pipe",
      }
    : undefined,
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1100 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        browserName: "chromium",
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        userAgent: devices["Pixel 7"].userAgent,
        viewport: { width: 390, height: 844 },
      },
    },
  ],
})
