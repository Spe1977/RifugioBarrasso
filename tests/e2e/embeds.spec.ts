import { expect, test } from "@playwright/test";

test.describe("External Embeds", () => {
  test("calendar embed is present on the booking page", async ({ page }) => {
    await page.goto("/prenotazioni/");

    // Check if the calendar section exists
    const calendarHeading = page.getByRole("heading", { name: /Calendario/i });
    await expect(calendarHeading).toBeVisible();

    // Check for the iframe or a clear fallback link
    const calendarIframe = page.locator("iframe[src*='calendar.google.com']");
    const fallbackLink = page.locator("a[href*='calendar.google.com']");

    const hasIframe = (await calendarIframe.count()) > 0;
    const hasFallback = (await fallbackLink.count()) > 0;

    expect(hasIframe || hasFallback).toBeTruthy();
  });

  test("tally embed is present on the guestbook page", async ({ page }) => {
    await page.goto("/quaderno-del-rifugio/");

    // Check if the tally section exists
    const tallyHeading = page.getByRole("heading", {
      name: /Lascia la tua dedica/i,
    });
    await expect(tallyHeading).toBeVisible();

    // Check for the iframe or a clear fallback link
    const tallyIframe = page.locator("iframe[src*='tally.so']");
    const fallbackLink = page.locator("a[href*='tally.so']");

    const hasIframe = (await tallyIframe.count()) > 0;
    const hasFallback = (await fallbackLink.count()) > 0;

    expect(hasIframe || hasFallback).toBeTruthy();
  });
});
