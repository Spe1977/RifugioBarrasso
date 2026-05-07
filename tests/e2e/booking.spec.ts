import { expect, test } from "@playwright/test";

test.describe("Booking Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prenotazioni/");
  });

  // The submit button is disabled until ALL declaration checkboxes are
  // ticked. Helper to tick them so we can exercise the submit flow.
  async function tickAllDeclarations(page: import("@playwright/test").Page) {
    await page.getByLabel(/Accetto regolamento e norme/).check();
    await page.getByLabel(/Prendo atto del contributo/).check();
    await page.getByLabel(/Prendo atto delle responsabilità/).check();
    await page.getByLabel(/Ho letto l'informativa privacy e autorizzo/).check();
    await page.getByLabel(/Accetto di essere ricontattato/).check();
  }

  test("shows validation errors on empty submit", async ({ page }) => {
    // The submit button is gated on declarations; tick them so it becomes
    // clickable, then click without filling the rest of the form.
    await tickAllDeclarations(page);

    const submit = page.getByRole("button", { name: "Invia richiesta" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Form must not navigate.
    await expect(page).toHaveURL(/\/prenotazioni\/$/);

    // Visible JS validation errors must appear.
    const errorSpans = page.locator("span[data-error]");
    const visibleErrors = await errorSpans.evaluateAll(
      (spans) => spans.filter((s) => !s.classList.contains("hidden")).length,
    );
    expect(visibleErrors).toBeGreaterThan(0);
  });

  test("successfully submits when correctly filled", async ({ page }) => {
    // Mock the fetch request to simulate success.
    await page.route("**/exec*", async (route) => {
      const json = { status: "success" };
      await route.fulfill({ json });
    });

    // Fill all required text/date fields.
    await page.getByLabel("Nome e Cognome *").fill("Test User");
    await page.getByLabel("Data di nascita *").fill("1990-01-01");
    await page.getByLabel("Luogo di nascita *").fill("Roma");
    await page.getByLabel("Numero documento *").fill("AB1234567");
    await page.getByLabel("Indirizzo Email *").fill("test@example.com");
    await page.getByLabel("Numero di Telefono *").fill("1234567890");
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-01");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-02");

    // Radios and select.
    await page.getByLabel("1 Notte").check();
    await page.getByLabel(/Numero Totale di Ospiti/).selectOption("2");
    await page
      .getByLabel(/Elenco dei partecipanti/)
      .fill("Test User 1, Test User 2");
    await page.getByLabel("Solo escursione").check();

    // Declarations + ricontatto.
    await tickAllDeclarations(page);

    // Submit.
    const submit = page.getByRole("button", { name: "Invia richiesta" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Verify success message.
    await expect(page.locator("[data-booking-success]")).not.toHaveClass(
      /hidden/,
    );
  });

  test("shows error message on network failure", async ({ page }) => {
    // Mock the fetch request to simulate failure.
    await page.route("**/exec*", async (route) => {
      await route.abort("failed");
    });

    // Fill all required fields to pass client validation.
    await page.getByLabel("Nome e Cognome *").fill("Test User");
    await page.getByLabel("Data di nascita *").fill("1990-01-01");
    await page.getByLabel("Luogo di nascita *").fill("Roma");
    await page.getByLabel("Numero documento *").fill("AB1234567");
    await page.getByLabel("Indirizzo Email *").fill("test@example.com");
    await page.getByLabel("Numero di Telefono *").fill("1234567890");
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-01");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-02");
    await page.getByLabel("1 Notte").check();
    await page.getByLabel(/Numero Totale di Ospiti/).selectOption("1");
    await page.getByLabel(/Elenco dei partecipanti/).fill("Test User 1");
    await page.getByLabel("Solo escursione").check();
    await tickAllDeclarations(page);

    // Submit.
    const submit = page.getByRole("button", { name: "Invia richiesta" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Verify error message.
    await expect(page.locator("[data-booking-error]")).not.toHaveClass(
      /hidden/,
    );
  });
});
