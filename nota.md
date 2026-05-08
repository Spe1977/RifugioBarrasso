# Stato sviluppo Rifugio Barrasso

Aggiornato: 2026-05-08.

## Stato app

- Sito Astro statico pronto per Cloudflare Pages.
- Deploy target: Cloudflare Pages da branch `main`.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Configurazione Pages presente in `wrangler.jsonc`.
- Documentazione presente in `README.md`, `docs/cloudflare-pages.md` e
  `docs/release-checklist.md`.
- Header Cloudflare presenti in `public/_headers` con CSP, cache asset e
  protezioni base.
- `robots.txt` presente.
- Form prenotazioni collegato tramite variabile:
  `PUBLIC_BOOKING_ENDPOINT`.
- Embed Google Calendar e Tally caricati solo dopo click esplicito
  dell'utente, con URL/ID letti da variabili pubbliche.

Variabili da impostare su Cloudflare Pages:

- `PUBLIC_BOOKING_ENDPOINT`
- `PUBLIC_GOOGLE_CALENDAR_EMBED_URL`
- `PUBLIC_TALLY_FORM_ID`

## Sicurezza

- Nessun segreto noto committato.
- Il vettore `GHSA-j687-52p2-xcff` / XSS Astro `define:vars` è chiuso lato
  codice: `CalendarEmbed.astro` e `TallyEmbed.astro` non usano più
  `define:vars`.
- Astro aggiornato a `6.3.1` nel branch dedicato `upgrade-astro-6`.
  `npm audit --omit dev` non segnala vulnerabilità di produzione.
- L'audit completo segnala ancora 9 vulnerabilità dev-only, quindi non
  incluse nel bundle statico di produzione:
  - `tmp <=0.2.3`, via `@lhci/cli` e `inquirer -> external-editor -> tmp`:
    gestione insicura di directory temporanee tramite symlink; rischio pratico
    basso in questo progetto perché riguarda tooling di sviluppo/CI.
  - `yaml 2.0.0 - 2.8.2`, via
    `@astrojs/check -> @astrojs/language-server -> volar-service-yaml`:
    possibile stack overflow con YAML molto annidati; gravità moderate,
    limitata al tooling di check/language server.
  - `npm audit fix --force` propone fix breaking/downgrade, quindi meglio
    attendere aggiornamenti non-breaking di `@lhci/cli` e `@astrojs/check`.
- Rate limiting Apps Script implementato in `apps-script/booking-handler.gs`:
  3 richieste per stessa email/24h, 3 per stesso telefono/24h, 30 richieste
  complessive/ora. Email e telefono vengono normalizzati prima del confronto.
- Rimozione di `'unsafe-inline'` dalla CSP ancora opzionale: Astro continua a
  generare script inline in alcuni casi, quindi serve strategia dedicata
  tramite bundle esterni, hash o nonce.

## Test attuali

Suite aggiornata:

- 35 test unitari Vitest.
- 64 test E2E Playwright su Chromium desktop e Pixel 7.
- `@axe-core/playwright` integrato per controlli accessibilità automatici.

Copertura E2E critica ora presente:

- SEO base e H1 singolo su tutte le pagine principali:
  `/`, `/storia/`, `/eventi/`, `/galleria/`, `/escursioni-e-sci/`,
  `/info-e-regole/`, `/prenotazioni/`, `/quaderno-del-rifugio/`,
  `/grazie-prenotazione/`, `/privacy/`, `/404/`.
- Accessibilità automatica axe su tutte le pagine principali.
- Menu mobile.
- Flusso prenotazioni: validazione vuota, submit riuscito, errore rete.
- UX cross-field prenotazioni:
  - partenza non successiva all'arrivo;
  - soggiorno oltre 2 notti.
- Gating privacy degli embed:
  - iframe Google Calendar assente prima del consenso e presente dopo click;
  - iframe Tally assente prima del consenso e presente dopo click.
- Rate limiting Apps Script:
  - normalizzazione email e telefono;
  - blocco quarta richiesta per stessa email/24h;
  - blocco quarta richiesta per stesso telefono/24h;
  - blocco trentunesima richiesta complessiva/ora;
  - ignorate richieste più vecchie di 24 ore.

Correzioni fatte perché emerse dai test a11y:

- Rimosso `aside` annidato nella pagina prenotazioni.
- Migliorato contrasto della data nelle dediche del quaderno.

Verifiche passate:

- `npm run lint`
- `npm test` -> 35 passed
- `npm run build`
- `npm run test:e2e:server` -> 64 passed

## Priorità rimaste

1. Test header HTTP/CSP/cache con Playwright sul preview server.
2. SEO avanzato: Open Graph completo, Twitter card, JSON-LD, canonical e
   sitemap/robots verificati da test.
3. Lighthouse CI con soglie hard su LCP/CLS/INP.
4. Test immagini responsive e `alt` significativi.
5. Visual regression su home, prenotazioni e galleria.
6. Progetto WebKit Playwright per copertura Safari/iOS.
