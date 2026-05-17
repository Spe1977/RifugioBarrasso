# Stato sviluppo Rifugio Barrasso

Aggiornato: 2026-05-17.

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
- Embed Google Calendar caricato solo dopo click esplicito dell'utente.
- Quaderno del rifugio collegato a Google Apps Script tramite
  `PUBLIC_DEDICHE_ENDPOINT`, con dediche caricate da Google Sheets dopo
  approvazione.
- Pagina Info e Regole aggiornata con riquadro dotazioni del Barrasso:
  locale chiuso accessibile solo su prenotazione, locale aperto sempre
  accessibile, testo regole ingrandito e link "PRENOTAZIONE" verso
  `/prenotazioni/`.

Variabili da impostare su Cloudflare Pages:

- `PUBLIC_BOOKING_ENDPOINT`
- `PUBLIC_GOOGLE_CALENDAR_EMBED_URL`
- `PUBLIC_DEDICHE_ENDPOINT`

## Sicurezza

- Nessun segreto noto committato.
- Il vettore `GHSA-j687-52p2-xcff` / XSS Astro `define:vars` è chiuso lato
  codice: `CalendarEmbed.astro` non usa più `define:vars` con dati non fidati.
- Astro aggiornato a `6.3.3`; `npm audit` non segnala vulnerabilità.
- Override npm presenti per il tooling di sviluppo:
  - `tmp` bloccato a `0.2.5`;
  - `yaml` bloccato a `2.9.0`.
- Rate limiting Apps Script implementato in `apps-script/booking-handler.gs`:
  3 richieste per stessa email/24h, 3 per stesso telefono/24h, 30 richieste
  complessive/ora. Email e telefono vengono normalizzati prima del confronto.
- Rate limiting Apps Script implementato in `apps-script/dediche-handler.gs`:
  3 dediche per stessa email/24h e 30 dediche complessive/ora. I campi scritti
  su Google Sheets vengono neutralizzati se iniziano con caratteri da formula.
- Rimozione di `'unsafe-inline'` dalla CSP ancora opzionale: Astro continua a
  generare script inline in alcuni casi, quindi serve strategia dedicata
  tramite bundle esterni, hash o nonce.

## Test attuali

Suite aggiornata:

- 44 test unitari Vitest.
- 80 test E2E Playwright su Chromium desktop e Pixel 7.
- `@axe-core/playwright` integrato per controlli accessibilità automatici.

Copertura E2E critica ora presente:

- SEO base e H1 singolo su tutte le pagine principali:
  `/`, `/storia/`, `/eventi/`, `/galleria/`, `/escursioni-e-sci/`,
  `/info-e-regole/`, `/prenotazioni/`, `/quaderno-del-rifugio/`,
  `/grazie-prenotazione/`, `/privacy/`, `/404/`.
- Accessibilità automatica axe su tutte le pagine principali.
- Menu mobile.
- Link "PRENOTAZIONE" nel riquadro dotazioni della pagina Info e Regole.
- Allineamento leggibile dei testi lunghi su mobile.
- Flusso prenotazioni: validazione vuota, submit riuscito, errore rete.
- UX cross-field prenotazioni:
  - partenza non successiva all'arrivo;
  - soggiorno oltre 2 notti.
- Gating privacy degli embed:
  - iframe Google Calendar assente prima del consenso e presente dopo click;
- Quaderno del rifugio:
  - validazione dediche;
  - neutralizzazione formule prima della scrittura su Google Sheets;
  - rate limiting email/globale.
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
- `npm test` -> 44 passed
- `npm run build`
- `npm run test:e2e:server` -> 80 passed

## Priorità rimaste

1. Test header HTTP/CSP/cache con Playwright sul preview server.
2. SEO avanzato: Open Graph completo, Twitter card, JSON-LD, canonical e
   sitemap/robots verificati da test.
3. Lighthouse CI con soglie hard su LCP/CLS/INP.
4. Test immagini responsive e `alt` significativi.
5. Visual regression su home, prenotazioni e galleria.
6. Progetto WebKit Playwright per copertura Safari/iOS.

PUBLIC_BOOKING_ENDPOINT = https://script.google.com/macros/s/AKfycbxCib48ZpIhhRXbUoQk6UEKd7f7UlZY_uSTGYbBckEZ9iDI6K1HI1kkhFVfZhcoTWzluQ/exec

PUBLIC_DEDICHE_ENDPOINT = https://script.google.com/macros/s/AKfycbwGyoVKWTGNpwzGuoSQiR1j4feegYBI4FfSRNo5ov_7s0VtDQ-6JThi0cVC-VjLFTBqhA/exec

PUBLIC_GOOGLE_CALENDAR_EMBED_URL = https://calendar.google.com/calendar/embed?src=b228cf7cd6642ee180bc7093c8431d0be6c005506571eeef55900a7f19cb7173%40group.calendar.google.com&ctz=Europe%2FRome&mode=MONTH&showTitle=0&showPrint=0&showTabs=1&showCalendars=0
