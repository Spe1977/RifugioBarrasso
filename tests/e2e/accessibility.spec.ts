import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/storia/",
  "/eventi/",
  "/galleria/",
  "/escursioni-e-sci/",
  "/info-e-regole/",
  "/prenotazioni/",
  "/quaderno-del-rifugio/",
  "/grazie-prenotazione/",
  "/privacy/",
  "/404/",
];

test.describe("Accessibility", () => {
  for (const url of pages) {
    test(`has no automatically detectable accessibility violations on ${url}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(url);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
