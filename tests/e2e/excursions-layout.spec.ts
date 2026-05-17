import { expect, test } from "@playwright/test";

test("keeps both seasonal photos left of their text on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto("/escursioni-e-sci/");

  for (const season of ["Estate", "Inverno"]) {
    const section = page.locator("article").filter({ hasText: season }).first();
    const mediaBox = await section.locator(".season-media").boundingBox();
    const textBox = await section.locator(".reveal-delay").boundingBox();

    expect(mediaBox).not.toBeNull();
    expect(textBox).not.toBeNull();
    expect(mediaBox!.x).toBeLessThan(textBox!.x);
    expect(Math.abs(mediaBox!.y - textBox!.y)).toBeLessThan(80);
  }
});

test("keeps seasonal photos below the season labels on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/escursioni-e-sci/");

  for (const season of ["Estate", "Inverno"]) {
    const section = page.locator("article").filter({ hasText: season }).first();
    const seasonBox = await section
      .locator("p.lg\\:hidden", { hasText: season })
      .boundingBox();
    const mediaBox = await section.locator(".season-media").boundingBox();

    expect(seasonBox).not.toBeNull();
    expect(mediaBox).not.toBeNull();
    expect(mediaBox!.y).toBeGreaterThan(seasonBox!.y + seasonBox!.height);
  }
});
