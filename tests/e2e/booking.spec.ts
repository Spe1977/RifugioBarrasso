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

  async function fillRequiredFields(page: import("@playwright/test").Page) {
    await page.getByLabel("Nome e Cognome *").fill("Test User");
    await page.getByLabel("Data di nascita *").fill("1990-01-01");
    await page.getByLabel("Luogo di nascita *").fill("Roma");
    await page.getByLabel("Numero documento *").fill("AB1234567");
    await page.getByLabel("Indirizzo Email *").fill("test@example.com");
    await page.getByLabel("Numero di Telefono *").fill("1234567890");
    await page.getByLabel(/Numero Totale di Ospiti/).selectOption("2");
    await page
      .getByLabel(/Elenco dei partecipanti/)
      .fill("Test User 1, Test User 2");
    await page.getByLabel("Solo escursione").check();
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

    await fillRequiredFields(page);
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-01");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-02");
    await page.getByLabel("1 Notte").check();

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

    await fillRequiredFields(page);
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-01");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-02");
    await page.getByLabel("1 Notte").check();
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

  test("shows a visible error when departure is not after arrival", async ({
    page,
  }) => {
    await fillRequiredFields(page);
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-02");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-01");
    await page.getByLabel("1 Notte").check();
    await tickAllDeclarations(page);

    await page.getByRole("button", { name: "Invia richiesta" }).click();

    await expect(page.locator('[data-error="data_partenza"]')).toHaveText(
      "Data partenza non valida o precedente all'arrivo.",
    );
    await expect(page.locator("[data-booking-success]")).toHaveClass(/hidden/);
  });

  test("shows a visible error when the stay exceeds two nights", async ({
    page,
  }) => {
    await fillRequiredFields(page);
    await page.getByLabel(/Data di Arrivo/).fill("2099-12-01");
    await page.getByLabel(/Data di Partenza/).fill("2099-12-04");
    await tickAllDeclarations(page);

    await page.evaluate(() => {
      document
        .querySelectorAll<HTMLInputElement>('input[name="notti"]')
        .forEach((radio) => {
          radio.checked = false;
        });

      const extraNights = document.createElement("input");
      extraNights.type = "radio";
      extraNights.name = "notti";
      extraNights.value = "3";
      extraNights.checked = true;
      document.querySelector("[data-booking-form]")?.append(extraNights);
    });

    await page.getByRole("button", { name: "Invia richiesta" }).click();

    await expect(page.locator('[data-error="notti"]')).toHaveText(
      "Seleziona 1 o 2 notti.",
    );
    await expect(page.locator("[data-booking-success]")).toHaveClass(/hidden/);
  });
});
