Fatto: commit e push completati su main.

Repository: https://github.com/Spe1977/RifugioBarrasso.git
Commit: a5e3546 (Prepare Rifugio Barrasso site for Cloudflare deploy)

Ho aggiunto/ottimizzato:

- documentazione principale in README.md
- guida Cloudflare in docs/cloudflare-pages.md
- checklist rilascio in docs/release-checklist.md
- wrangler.jsonc per Pages con output ./dist
- robots.txt
- header Cloudflare in public/\_headers con sicurezza + cache asset
- script preview:cloudflare e deploy:cloudflare
- .gitignore aggiornato per escludere .env, dist, node_modules, report e
  screenshot
- fix lint su test-h1.spec.ts

Verifiche passate:

- npm run build
- npm test
- npm run lint
- Prettier sui file modificati/supportati

Per Cloudflare Pages usa:

- Production branch: main
- Build command: npm run build
- Build output directory: dist

Da impostare su Cloudflare Pages come variabile ambiente:
PUBLIC_BOOKING_ENDPOINT = https://script.google.com/macros/s/AKfycbxCib48ZpIhhRXbUoQk6UEKd7f7UlZY_uSTGYbBckEZ9iDI6K1HI1kkhFVfZhcoTWzluQ/exec

Fonti Cloudflare usate: guida Astro Pages e configurazione build ufficiali:
https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
https://developers.cloudflare.com/pages/configuration/build-configuration/

## Raccomandazioni di sicurezza (audit 2026-05-07)

Nessuna vulnerabilità sfruttabile e nessun segreto trapelato. Punti aperti:

1. Aggiornare Astro a >= 6.1.6 (XSS in `define:vars`, GHSA-j687-52p2-xcff —
   attualmente 5.18.1, fix richiede `npm audit fix --force`, breaking).
2. Completare l'informativa privacy in `src/pages/privacy/index.astro`
   (oggi marcata come bozza) prima del go-live: titolare, base giuridica,
   tempi di conservazione, diritti GDPR artt. 15-22.
3. Aggiungere rate limiting in `apps-script/booking-handler.gs` (es. max N
   richieste per email/giorno leggendo le ultime righe del foglio).
4. (Opzionale) Rimuovere `'unsafe-inline'` dalla CSP in `public/_headers`
   rifattorizzando i `<script is:inline>` di CalendarEmbed/TallyEmbed.
5. Rebuild di `dist/` prima del deploy: l'endpoint Apps Script attuale in
   `.env` (`AKfycbxCib48...`) differisce da quello compilato in
   `dist/prenotazioni/index.html` (`AKfycbz3HbSR...`).

## Test da implementare (audit 2026-05-07)

Suite attuale: 29 unit (Vitest) + 10 E2E (Playwright su Chromium + Pixel 7).
Copre bene validazione/submit del booking, contratto dei dati di
contenuto, SEO base e presenza degli embed. Lacune da chiudere in ordine
di priorità:

### Alta

1. Accessibilità: integrare `@axe-core/playwright` ed eseguire un check
   a11y su ogni pagina (contrasti, ARIA, label/error association, focus
   order, skip-link).
2. Estendere `seo.spec.ts` alle pagine mancanti: `/eventi/`, `/galleria/`,
   `/grazie-prenotazione/`, `/privacy/`, `/404`.
3. Consent gating del calendario: oggi `embeds.spec.ts` verifica solo la
   presenza dell'iframe. Aggiungere test che senza consenso l'iframe non
   sia caricato e che dopo click sul consenso compaia.
4. Cross-field UX del booking: messaggi visibili per "data partenza >
   arrivo" e "max 2 notti" (oggi coperti solo a livello dati).

### Media

5. SEO avanzato: `link rel=canonical`, Open Graph completo
   (`og:title/description/image/url`), Twitter card, JSON-LD
   (`Organization`/`LocalBusiness`/`BreadcrumbList`), `sitemap-index.xml`
   accessibile e completo, `robots.txt` con riferimento sitemap.
6. Header HTTP/sicurezza (`public/_headers`): CSP, X-Frame-Options, HSTS,
   `Cache-Control: immutable` su `/assets/*`. Verificabili con
   `request.fetch()` di Playwright sul preview server.
7. Immagini responsive: verificare presenza di
   `<picture><source type="image/webp">` su hero e logo, e `alt`
   significativo dove richiesto.
8. Lighthouse CI: passare da `warn`-only a soglie hard su LCP/CLS/INP
   per bloccare regressioni di performance al deploy.

### Bassa

9. Apps Script (`apps-script/booking-handler.gs`): test di forma del
   payload e, una volta implementato, del rate limiting.
10. Visual regression con `expect(page).toHaveScreenshot()` su home,
    prenotazioni e galleria.
11. Status code della 404 su path inesistente.
12. Aggiungere progetto WebKit a `playwright.config.ts` per coprire
    Safari/iOS.

Quick win (80% del valore): 1, 2 e 3.
