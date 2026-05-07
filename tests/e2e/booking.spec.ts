import { expect, test } from "@playwright/test";

test.describe("Booking Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prenotazioni/");
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    // Click submit without filling anything
    await page.getByRole("button", { name: "Invia richiesta" }).click();

    // Check that custom HTML5 validation or JS validation messages appear
    // We expect the form to prevent submission, and our JS might show error text.
    // If native validation blocks it, the form isn't submitted.
    // Let's verify that the form doesn't navigate away.
    await expect(page).toHaveURL(/\/prenotazioni\/$/);
    
    // Check for visible error messages added by JS
    const errorSpans = page.locator("span[data-error]");
    const visibleErrors = await errorSpans.evaluateAll((spans) =>
      spans.filter((s) => !s.classList.contains("hidden")).length
    );
    expect(visibleErrors).toBeGreaterThan(0);
  });

  test("successfully submits when correctly filled", async ({ page }) => {
    // Mock the fetch request to simulate success
    await page.route("**/exec*", async (route) => {
      const json = { status: "success" };
      await route.fulfill({ json });
    });

    // Fill required fields
    await page.getByLabel("Nome e Cognome *").fill("Test User");
    await page.getByLabel("Data di nascita *").fill("1990-01-01");
    await page.getByLabel("Indirizzo Email *").fill("test@example.com");
    await page.getByLabel("Numero di Telefono *").fill("1234567890");
    await page.getByLabel("Data di Arrivo").fill("2099-12-01");
    await page.getByLabel("Data di Partenza").fill("2099-12-02");
    
    // Select radios and selects
    await page.getByLabel("1 Notte").check();
    await page.getByLabel("Numero Totale di Ospiti").selectOption("2");
    await page.getByLabel(/Elenco dei partecipanti/).fill("Test User 1, Test User 2");
    await page.getByLabel("Solo escursione").check();
    
    // Fill checkboxes
    await page.getByLabel(/Dichiaro di aver letto e accettato i regolamenti/).check();
    await page.getByLabel(/Ho letto l'informativa privacy/).check();
    await page.getByLabel(/Accetto di essere ricontattato/).check();

    // Submit
    await page.getByRole("button", { name: "Invia richiesta" }).click();

    // Verify success message
    await expect(page.locator("[data-booking-success]")).not.toHaveClass(/hidden/);
  });

  test("shows error message on network failure", async ({ page }) => {
    // Mock the fetch request to simulate failure
    await page.route("**/exec*", async (route) => {
      await route.abort("failed");
    });

    // Fill minimal required fields to pass client validation
    await page.getByLabel("Nome e Cognome *").fill("Test User");
    await page.getByLabel("Data di nascita *").fill("1990-01-01");
    await page.getByLabel("Indirizzo Email *").fill("test@example.com");
    await page.getByLabel("Numero di Telefono *").fill("1234567890");
    await page.getByLabel("Data di Arrivo").fill("2099-12-01");
    await page.getByLabel("Data di Partenza").fill("2099-12-02");
    await page.getByLabel("1 Notte").check();
    await page.getByLabel("Numero Totale di Ospiti").selectOption("1");
    await page.getByLabel(/Elenco dei partecipanti/).fill("Test User 1");
    await page.getByLabel("Solo escursione").check();
    await page.getByLabel(/Dichiaro di aver letto e accettato i regolamenti/).check();
    await page.getByLabel(/Ho letto l'informativa privacy/).check();
    await page.getByLabel(/Accetto di essere ricontattato/).check();

    // Submit
    await page.getByRole("button", { name: "Invia richiesta" }).click();

    // Verify error message
    await expect(page.locator("[data-booking-error]")).not.toHaveClass(/hidden/);
  });
});
