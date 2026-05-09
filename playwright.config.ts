import { defineConfig, devices } from "@playwright/test";

const e2ePort = Number(process.env.PLAYWRIGHT_PORT ?? 4322);
const e2eBaseUrl = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  webServer:
    process.env.PLAYWRIGHT_START_SERVER === "1"
      ? {
          command: `PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/test/exec PUBLIC_GOOGLE_CALENDAR_EMBED_URL=https://calendar.google.com/calendar/embed PUBLIC_TALLY_FORM_ID=test-form npm run build && npx astro preview --host 127.0.0.1 --port ${e2ePort}`,
          url: e2eBaseUrl,
          reuseExistingServer: true,
          timeout: 180_000,
        }
      : undefined,
  use: {
    baseURL: e2eBaseUrl,
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
