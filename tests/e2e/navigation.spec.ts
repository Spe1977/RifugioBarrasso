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

test("home experience call to action opens the reservations page", async ({
  page,
}) => {
  await page.goto("/");

  const experienceLink = page.getByRole("link", { name: "Vivi l'esperienza" });

  await expect(experienceLink).toHaveAttribute("href", "/prenotazioni/");

  await experienceLink.click();

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

test("info and rules maps call to action opens Google Maps", async ({
  page,
}) => {
  await page.goto("/info-e-regole/");

  const mapsLink = page.getByRole("link", {
    name: "Naviga verso il Rifugio Paolo Barrasso su Google Maps",
  });

  await expect(mapsLink).toHaveAttribute(
    "href",
    "https://www.google.com/maps/search/?api=1&query=42.13584,14.06078",
  );
  await expect(mapsLink).toHaveAttribute("target", "_blank");
  await expect(mapsLink).toHaveAttribute("rel", "noreferrer");
});

test("info and rules contact box exposes both operational emails", async ({
  page,
}) => {
  await page.goto("/info-e-regole/");
  const main = page.getByRole("main");

  await expect(
    main.getByRole("link", { name: "rifugio.barrasso@gmail.com" }),
  ).toHaveAttribute("href", "mailto:rifugio.barrasso@gmail.com");
  await expect(
    main.getByRole("link", { name: "info@rifugiobarrasso.com" }),
  ).toHaveAttribute("href", "mailto:info@rifugiobarrasso.com");
});

test("footer links to the refuge Facebook page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "info@rifugiobarrasso.com" }),
  ).toHaveAttribute("href", "mailto:info@rifugiobarrasso.com");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Facebook" }),
  ).toHaveAttribute("href", "https://www.facebook.com/rifugio.barrasso");
});
