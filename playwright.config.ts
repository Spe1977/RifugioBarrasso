import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer:
    process.env.PLAYWRIGHT_START_SERVER === "1"
      ? {
          command:
            "PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/test/exec npm run build && npx astro preview --host 127.0.0.1 --port 4321",
          url: "http://127.0.0.1:4321",
          reuseExistingServer: true,
          timeout: 180_000,
        }
      : undefined,
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
