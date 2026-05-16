import { expect, test } from "@playwright/test";

test.describe("Responsive typography", () => {
  test("keeps long informational copy justified on narrow screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/info-e-regole/");

    const heroLead = page
      .locator("p")
      .filter({
        hasText: "Salire fino al Barrasso significa vivere la montagna",
      })
      .first();
    const introCopy = page
      .locator("p")
      .filter({ hasText: "Il percorso alterna strada comunale" })
      .first();

    await expect(heroLead).toBeVisible();
    await expect(introCopy).toBeVisible();

    for (const copyBlock of [heroLead, introCopy]) {
      const textAlign = await copyBlock.evaluate(
        (element) => getComputedStyle(element).textAlign,
      );

      expect(textAlign).toBe("justify");
    }
  });
});
