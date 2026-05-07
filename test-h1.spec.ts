import { test } from "@playwright/test";

test("count h1s", async ({ page }) => {
  await page.goto("http://localhost:4321/storia/");
  const texts = await page.locator("h1").allInnerTexts();
  console.log(texts);
});
