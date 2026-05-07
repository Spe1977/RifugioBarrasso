import { expect, test } from "@playwright/test";

test.describe("SEO and Accessibility Basics", () => {
  const pages = [
    { url: "/", title: "Rifugio Paolo Barrasso" },
    { url: "/storia/", title: "Storia" },
    { url: "/info-e-regole/", title: "Info e Regole" },
    { url: "/prenotazioni/", title: "Prenotazioni" },
    { url: "/quaderno-del-rifugio/", title: "Quaderno" },
  ];

  for (const p of pages) {
    test(`Page ${p.url} has basic SEO tags and single H1`, async ({ page }) => {
      await page.goto(p.url);

      // Check title
      const pageTitle = await page.title();
      expect(pageTitle.length).toBeGreaterThan(5);
      expect(pageTitle).toContain(p.title);

      // Check meta description
      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveCount(1);
      const descContent = await metaDesc.getAttribute("content");
      expect(descContent?.length).toBeGreaterThan(10);

      // Check for exactly one H1
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });
  }

  test("Mobile menu opens and closes", async ({ page, isMobile }) => {
    if (!isMobile) return;

    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Apri menu/i });
    const closeButton = page.getByRole("button", { name: /Chiudi menu/i });
    const mobileMenu = page.locator("[data-mobile-menu]");

    // Open
    await menuButton.click();
    await expect(mobileMenu).toBeVisible();

    // Close
    await closeButton.click();
    await expect(mobileMenu).not.toBeVisible();
  });
});
