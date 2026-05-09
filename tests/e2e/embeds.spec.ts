import { expect, test } from "@playwright/test";

test.describe("External Embeds", () => {
  test("calendar iframe is gated until explicit consent", async ({ page }) => {
    await page.goto("/prenotazioni/");

    const calendarHeading = page.getByRole("heading", { name: /Calendario/i });
    await expect(calendarHeading).toBeVisible();

    const loadButton = page.getByRole("button", {
      name: /Mostra calendario disponibilità/i,
    });

    if ((await loadButton.count()) === 0) {
      await expect(
        page.getByText(/calendario disponibilità verrà incorporato/i),
      ).toBeVisible();
      return;
    }

    await expect(
      page.locator("iframe[src*='calendar.google.com']"),
    ).toHaveCount(0);
    await expect(page.locator("iframe:not([src])")).toHaveCount(1);

    await loadButton.click();

    await expect(
      page.locator("iframe[src*='calendar.google.com']"),
    ).toHaveCount(1);
    await expect(loadButton).not.toBeVisible();
    await expect(page.locator("[data-calendar-frame]")).toBeVisible();
  });
});
