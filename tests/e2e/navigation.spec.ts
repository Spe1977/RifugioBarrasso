import { expect, test } from "@playwright/test";

test("renders the Italian multipage navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Il Focolare nel Cielo d'Abruzzo" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Prenota il locale" }).click();
  await expect(page).toHaveURL(/\/prenotazioni\/$/);
  await expect(
    page.getByRole("heading", { name: "Richiedi il locale chiuso" }),
  ).toBeVisible();
});

test("booking form exposes the official limits", async ({ page }) => {
  await page.goto("/prenotazioni/");

  await expect(
    page.getByText("Numero Totale di Ospiti (massimo 8) *"),
  ).toBeVisible();
  await expect(page.getByText("Numero notti (massimo 2) *")).toBeVisible();
  await expect(
    page
      .locator("#booking-note")
      .getByRole("link", { name: "rifugio.barrasso@gmail.com" }),
  ).toBeVisible();
});

test("info and rules booking word link opens the reservations page", async ({
  page,
}) => {
  await page.goto("/info-e-regole/");

  const bookingWordLink = page
    .getByRole("article", { name: "COSA TROVI ALL'INTERNO DEL BARRASSO" })
    .getByRole("link", { name: "PRENOTAZIONE" });

  await expect(bookingWordLink).toHaveAttribute("href", "/prenotazioni/");

  await bookingWordLink.click();

  await expect(page).toHaveURL(/\/prenotazioni\/$/);
  await expect(
    page.getByRole("heading", { name: "Richiedi il locale chiuso" }),
  ).toBeVisible();
});

test("footer links to the refuge Facebook page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Facebook" }),
  ).toHaveAttribute("href", "https://www.facebook.com/rifugio.barrasso");
});
